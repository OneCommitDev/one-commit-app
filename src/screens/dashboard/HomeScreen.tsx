// HomeScreen.tsx
import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
import {  View,  Text,  FlatList,  Alert,  TouchableOpacity, Linking,  Platform,  AppState,  Animated,  Easing,  UIManager,
  LayoutAnimation,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TitleText from "~/components/TitleText";
import AppText from "~/components/AppText";
import { PREF_KEYS } from "~/utils/Prefs";
import { getItem, setItem } from "expo-secure-store";
import Loader from "~/components/Loader";
import { Api_Url, httpRequest2 } from "~/services/serviceRequest";
import { communication_history, HomeToDo, SimpleResponse, todo_items } from "~/services/DataModals";
import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "~/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { capitalizeWords, getFCMToken } from "~/utils/AppFunctions";
import messaging from "@react-native-firebase/messaging";
import { checkNotifications, requestNotifications } from "react-native-permissions";
import LottieView from "lottie-react-native";
import { resetToLogin } from "~/navigation/NavigationService";
import { clearAllPrefss } from "~/utils/storage";

// enable LayoutAnimation on Android (keeps it for small layout tweaks)
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CardItem = {
  id: string;
  title: string;
  icon: JSX.Element;
  items: string[];
  todoItems?: todo_items[];
  communication_history : communication_history[];
};

export default function HomeScreen({ onRedirect }: { onRedirect: (tab: "Explore") => void }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState<HomeToDo | null>(null);
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean | null>(null);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
  const [screenload, setScreenload] = useState(false);

  // per-card animation & measured height store
  const animRefs = useRef<Record<string, { animated: Animated.Value; measuredHeight: number | null }>>({});
const slideAnim = useRef(new Animated.Value(50)).current; // start 50px lower
const opacityAnim = useRef(new Animated.Value(0)).current; // start hidden
 const [fcmToken, setFCMToken] = useState<string>("");

  useEffect(() => {
    // fetchTODO();
    checkPermissionOnLoad();
  }, []);

 useFocusEffect(
  useCallback(() => {
    const fetchTokenAndData = async () => {
      const token = await getFCMToken();  // now string | null

      if (token) {
        setFCMToken(token);
        console.log("Got FCM token:", token);
        // await fcmTokenSavingAPi(token);
      } else {
        console.log("Failed to get FCM token");
      }

      fetchTODO();
    };

    fetchTokenAndData();
  }, [])
);



const runEnterAnimation = () => {
  Animated.parallel([
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }),
  ]).start();
};


  const fetchTODO = async () => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.homeToDo;

      const res = await httpRequest2<HomeToDo>(url, "get", {}, accessToken ?? "");
      
setScreenload(true);
      if (res.status) {
      /*  let updatedRes = { ...res };
        let apiItems = updatedRes?.data?.todo_items ?? [];

        if (apiItems.length < 20) {
          const extra = Array.from({ length: 20 - apiItems.length }, (_, i) => ({
            id: `dummy-${apiItems.length + i + 1}`,
            notification: `Dummy task #${apiItems.length + i + 1}`,
            school_id: "0",
            redirect_type: "none",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isDummy: true,
          })) as todo_items[];
          updatedRes.data.todo_items = [...apiItems, ...extra];
        }

        setTodoList(updatedRes);
        */
 
          setTodoList(res);
        setItem(PREF_KEYS.displayName, String(res.data?.profile?.name ?? ""));
        setItem(PREF_KEYS.connected_id, String(res.data?.connected_email?.email ?? ""));
        setItem(PREF_KEYS.connected_id_provider, String(res.data?.connected_email?.provider ?? ""));
           runEnterAnimation();
      } else {
       // Alert.alert("Notice", "No To-Do items found.");
      }
        if(res.status == true){
          //console.log('fcmToken', fcmToken);
          await  fcmTokenSavingAPi(fcmToken);
        }
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };
/*
  const fcmTokenSavingAPi = async () => {
    try {
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const fcm = await getItem(PREF_KEYS.fcmToken);
      const url = Api_Url.fcmTokenAPI;

      await getFCMToken();

      await httpRequest2<SimpleResponse>(url, "post", { fcmToken: fcm }, accessToken ?? "", true);
    } catch (err) {
      // console.error(err);
    }
  };
  */

  

 const fcmTokenSavingAPi = async (fcm : string) => {
  try {
    const accessToken = await getItem(PREF_KEYS.accessToken);
    const url = Api_Url.fcmTokenAPI;
    if (!fcm) {
      console.warn("⚠️ No FCM token available, skipping API call");
      return;
    }
    await httpRequest2<SimpleResponse>(
      url,
      "post",
      { fcmToken: fcm },
      accessToken ?? "",
      true
    );
    console.log("✅ FCM token sent to API");
  } catch (err) {
   // console.error("❌ Failed to save FCM token:", err);
  }
};


  const buildCardData = (): CardItem[] => [
    {
      id: "1",
      title: "TO-DO",
      icon: <Ionicons name="warning-outline" size={20} color="#14532D" />,
      items: todoList?.data?.todo_items?.map((item) => item.notification) ?? [],
      todoItems: todoList?.data?.todo_items ?? [],
      communication_history : []
    },
    {
      id: "2",
      title: "INBOX (COACH THREADS)",
      icon: <Ionicons name="mail-outline" size={20} color="#14532D" />,
      items: todoList?.data?.todo_items?.map((item) => item.notification) ?? [],
      todoItems: [],
      communication_history: Array.isArray(todoList?.data?.communication_history) 
      ? todoList.data.communication_history 
      : todoList?.data?.communication_history 
        ? [todoList.data.communication_history] 
        : [],

    },
  ];

  const handleTodoClick = (item: todo_items) => {
    if (item.redirect_type === "dashboard_school" && item.school_id) {
      navigation.navigate("EmailCommunication", {
        id: item.school_id,
        type: item.notification,
      });
    } else if (item.redirect_type === "explorer") {
      onRedirect("Explore");
    } else {
      Alert.alert("Info", "No action available for this item.");
    }
  };

  const handleInboxClick = (item: communication_history) => {
  navigation.navigate("EmailCommunication", {
    id: item.school_id,
    type: item.email_status,
  });
};


  // Toggle expand: animate container height (pixel-based Animated.Value).
  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // small UX polish
    const current = expandedCards[id] ?? false;
    const next = !current;

    if (!animRefs.current[id]) {
      animRefs.current[id] = { animated: new Animated.Value(0), measuredHeight: null };
    }
    const animObj = animRefs.current[id];

    setExpandedCards((p) => ({ ...p, [id]: next }));

    // if measuredHeight is known animate immediately, otherwise animation will run when measured (see onLayout below)
    if (animObj.measuredHeight != null) {
      Animated.timing(animObj.animated, {
        toValue: next ? animObj.measuredHeight! : 0,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false, // height animation requires false
      }).start();
    }
  };

  // If measuredHeight becomes available after first render and card is expanded, animate to that height
  const ensureAnimateAfterMeasure = (id: string) => {
    const animObj = animRefs.current[id];
    if (!animObj) return;
    const expanded = expandedCards[id] ?? false;
    if (animObj.measuredHeight != null) {
      Animated.timing(animObj.animated, {
        toValue: expanded ? animObj.measuredHeight! : 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  };

  // renderTodoCard uses measured height + Animated.View for extras
  const renderTodoCard = ({ item }: { item: CardItem }) => {
    const allItems = item.todoItems ?? [];
    const visibleBase = allItems.slice(0, 2);
    const extras = allItems.slice(2);
    const expanded = expandedCards[item.id] ?? false;

    // ensure anim ref exists
    if (!animRefs.current[item.id]) {
      animRefs.current[item.id] = { animated: new Animated.Value(0), measuredHeight: null };
    }
    const animObj = animRefs.current[item.id];

    // animated height value (in px)
    const animatedHeight = animObj.animated;

    return (
      <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            {item.icon}
            <TitleText className="ml-2">{item.title}</TitleText>
          </View>

          {allItems.length > 2 && (
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text className="text-blue-600 font-semibold">{expanded ? "View Less" : "View All"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Always visible first 2 items */}
        <View>
          {visibleBase.length > 0 ? (
            visibleBase.map((todoItem, idx) => (
              <TouchableOpacity key={`base-${idx}`} onPress={() => handleTodoClick(todoItem)}>
                <View className="flex-row items-start mt-1">
                   <TitleText className="ml-5 -mt-2" size="text-24">•</TitleText>
                  <View className="flex-1 mr-4">
                    <AppText className="ml-5 pr-1">{todoItem.notification}</AppText>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <AppText className="ml-5 mt-2 text-gray-500 italic">No data available</AppText>
          )}
        </View>

        {/* --- Hidden offscreen measurement block (renders the exact 'extras' content so we can measure its height) --- */}
        {extras.length > 0 && (
          <View
            pointerEvents="none"
            style={{ position: "absolute", left: -10000, top: 0, opacity: 0, zIndex: -1 }}
            onLayout={(e) => {
              const measured = Math.round(e.nativeEvent.layout.height);
              const prev = animRefs.current[item.id]?.measuredHeight ?? null;
              if (prev !== measured) {
                animRefs.current[item.id].measuredHeight = measured;
                // If currently expanded, animate to measured height
                ensureAnimateAfterMeasure(item.id);
              }
            }}
          >
            {extras.map((todoItem, idx) => (
              <View key={`measure-extra-${idx}`} className="flex-row items-start mt-1">
                <TitleText className="ml-5" size="text-24">•</TitleText>
                <AppText className="ml-5">{todoItem.notification}</AppText>
              </View>
            ))}
          </View>
        )}

        {/* Animated extras container - height animated from 0 -> measuredHeight */}
        {extras.length > 0 && (
          <Animated.View
            style={{
              height: animatedHeight, // pixel height from measured content
              overflow: "hidden",
            }}
          >
            {/* The actual visible extras (same markup as measurement) */}
            {extras.map((todoItem, idx) => (
              <TouchableOpacity key={`extra-${idx}`} onPress={() => handleTodoClick(todoItem)}>
                <View className="flex-row items-start">
                  <TitleText className="ml-5 -mt-2" size="text-24">•</TitleText>
                  <View className="w-full mr-3">
                  <AppText className="ml-5 mr-1">{todoItem.notification}</AppText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

  // renderInboxCard - similar approach
  const renderInboxCard = ({ item }: { item: CardItem }) => {
  const allItems = item.communication_history ?? [];
  const visibleBase = allItems.slice(0, 2);
  const extras = allItems.slice(2);
  const expanded = expandedCards[item.id] ?? false;

  if (!animRefs.current[item.id]) {
    animRefs.current[item.id] = { animated: new Animated.Value(0), measuredHeight: null };
  }
  const animObj = animRefs.current[item.id];
  const animatedHeight = animObj.animated;

  const renderMessage = (msg: communication_history, key: string) => (
     <TouchableOpacity key={key} onPress={() => handleInboxClick(msg)}>
    <View key={key} className="flex-row items-start mt-1">
      <TitleText className="ml-5 -mt-2" size="text-24">•</TitleText>
      
      <View>
        <AppText className="ml-5 mr-10">
          <Text className="font-nunitoextrabold text-16">
            {msg.email_info}
          </Text>
          {msg.email_subject}
        </AppText>
        <Text className="ml-5">{formatDate(msg.email_sent_date)} - {msg.email_status}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );

  const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};


  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          {item.icon}
          <TitleText className="ml-2">{item.title}</TitleText>
        </View>

        {allItems.length > 2 && (
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <View className="flex-1">
              <Text className="text-blue-600 font-semibold">
                {expanded ? "View Less" : "View All"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View>
        {visibleBase.length > 0 ? (
          visibleBase.map((msg, idx) => renderMessage(msg, `base-inbox-${idx}`))
        ) : (
          <AppText className="ml-5 mt-2 text-gray-500 italic">
            No data available
          </AppText>
        )}
      </View>

      {/* Hidden measure block */}
      {extras.length > 0 && (
        <View
          pointerEvents="none"
          style={{ position: "absolute", left: -10000, top: 0, opacity: 0, zIndex: -1 }}
          onLayout={(e) => {
            const measured = Math.round(e.nativeEvent.layout.height);
            const prev = animRefs.current[item.id]?.measuredHeight ?? null;
            if (prev !== measured) {
              animRefs.current[item.id].measuredHeight = measured;
              ensureAnimateAfterMeasure(item.id);
            }
          }}
        >
          {extras.map((msg, idx) => renderMessage(msg, `measure-extra-inbox-${idx}`))}
        </View>
      )}

      {/* Animated visible extras */}
      {extras.length > 0 && (
        <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
          {extras.map((msg, idx) => renderMessage(msg, `extra-inbox-${idx}`))}
        </Animated.View>
      )}
    </View>
  );
};


  // Notification/permissions code unchanged
  const requestNotificationPermission = async () => {
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert(
          "Notifications Alert",
          "Notifications are off. Please enable them in Settings to continue receiving alerts.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openURL("app-settings:"),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } else if (Platform.OS === "android") {
      const { status } = await checkNotifications();

      if (status !== "granted") {
        const { status: newStatus } = await requestNotifications(["alert", "sound", "badge"]);
        if (newStatus !== "granted") {
          Alert.alert(
            "Notifications Alert",
            "Notifications are off. Please enable them in Settings to continue receiving alerts.",
            [
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
              { text: "Cancel", style: "cancel" },
            ]
          );
        }
      }
    }
  };

  const checkPermissionOnLoad = async () => {
    if (Platform.OS === "ios") {
      const authStatus = await messaging().hasPermission();
      setNotificationsAllowed(authStatus === messaging.AuthorizationStatus.AUTHORIZED);
    } else {
      const { status } = await checkNotifications();
      setNotificationsAllowed(status === "granted");
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await checkPermissionOnLoad();
      })();
      const sub = AppState.addEventListener("change", (next) => {
        if (next === "active") {
          checkPermissionOnLoad();
        }
      });
      return () => {
        sub.remove();
      };
    }, [])
  );

  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(today);

  const renderCard = ({ item }: { item: CardItem }) => {
    switch (item.id) {
      case "1":
        return renderTodoCard({ item });
      case "2":
        return renderInboxCard({ item });
      default:
        return renderTodoCard({ item });
    }
  };

  return (
    <View className="flex-1 bg-background pt-14 px-4">
      <View className="px-4 mb-6">
        <TitleText size="text-24">Hi, {capitalizeWords(todoList?.data?.profile?.name) ?? ""} 👋</TitleText>
        <AppText className="-mt-4">{formattedDate}</AppText>
      </View>

      {screenload ? (
   <> 

      {notificationsAllowed === false && (
        <View className="bg-yellow-100 border border-yellow-50 rounded-lg p-4 flex-row items-center mb-1">
          <View className="flex-1 flex-row items-start">
            <Ionicons name="warning-outline" size={22} color="#B45309" style={{ marginTop: 2, marginRight: 8 }} />
            <View className="flex-1">
              <TitleText className="text-yellow-800 -mt-3">Notifications disabled</TitleText>
              <AppText className="text-yellow-700 text-sm -mt-3">
                Please enable notifications to ensure you don’t miss important emails and alerts.
              </AppText>
            </View>
          </View>

          <TouchableOpacity onPress={requestNotificationPermission} className="bg-yellow-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-semibold text-sm">Allow</Text>
          </TouchableOpacity>
        </View>
      )}

<Animated.View
  style={{
    flex: 1,
    opacity: opacityAnim,
    transform: [{ translateY: slideAnim }],
  }}
>
      <FlatList
        data={buildCardData()}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
      </Animated.View>
 </>
) : (
       <View className="flex-1 items-center justify-center">
       {/* <LottieView
        source={require('../../../assets/animations/bot_loading.json')}
        autoPlay
        loop={true}
        style={{ width: 200, height: 200 }} 
      /> */}

      </View>
    )}
            <Loader show={loading} />

    </View>
  );
}

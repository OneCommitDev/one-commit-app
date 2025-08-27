import React, { JSX, useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, Linking, Platform, AppState } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import { PREF_KEYS } from '~/utils/Prefs';
import { getItem, setItem } from 'expo-secure-store';
import Loader from '~/components/Loader';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { HomeToDo, SimpleResponse, todo_items } from '~/services/DataModals';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getFCMToken } from '~/utils/AppFunctions';
import messaging from "@react-native-firebase/messaging";
import { checkNotifications, requestNotifications } from "react-native-permissions";

type CardItem = {
  id: string;
  title: string;
  icon: JSX.Element;
  items: string[];
  todoItems?: todo_items[];
};

type EmailRouteProp = RouteProp<RootStackParamList, 'EmailCommunication'>;

export default function HomeScreen({ onRedirect }: { onRedirect: (tab: 'Explore') => void }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState<HomeToDo | null>(null);
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean | null>(null);
const isHermes = () => typeof global.HermesInternal !== "undefined";

  useEffect(() => {
    console.log("Hermes enabled:", isHermes());

   fetchTODO();
    fcmTokenSavingAPi();
    checkPermissionOnLoad();
  }, []);

  const fetchTODO = async () => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.homeToDo;

      const res = await httpRequest2<HomeToDo>(
        url,
        'get',
        {},
        accessToken ?? ''
      );

      if (res.status) {
        setTodoList(res);
       setItem(PREF_KEYS.displayName, String(res.data?.profile?.name ?? ''));
      setItem(PREF_KEYS.connected_id, String(res.data?.connected_email?.email ?? ''));
      setItem(PREF_KEYS.connected_id_provider, String(res.data?.connected_email?.provider ?? ''));

      } else {
        Alert.alert('Notice', 'No To-Do items found.');
      }
    } catch (err) {
     // Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fcmTokenSavingAPi = async () => {
    try {
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const fcm = await getItem(PREF_KEYS.fcmToken);
      const url = Api_Url.fcmTokenAPI;

      await getFCMToken();

      const res = await httpRequest2<SimpleResponse>(
        url,
        'post',
        { fcmToken: fcm },
        accessToken ?? '',
        true
      );

    } catch (err) {
       
    }
  };

  const buildCardData = (): CardItem[] => [
    {
      id: '1',
      title: 'TO-DO',
      icon: <Ionicons name="checkmark-done-circle" size={20} color="#14532D" />,
      items: todoList?.data?.todo_items?.map((item) => item.notification) ?? [],
      todoItems: todoList?.data?.todo_items ?? [],
    },
    // Add more cards here if needed
  ];

  const handleTodoClick = (item: todo_items) => {
    if (item.redirect_type === 'dashboard_school' && item.school_id) {
      navigation.navigate('EmailCommunication', {
        id: item.school_id,
        type: item.notification,
      });
    } else if (item.redirect_type === 'explorer') {
      onRedirect('Explore');
    } else {
      Alert.alert('Info', 'No action available for this item.');
    }
  };

 const renderCard = ({ item }: { item: CardItem }) => (
  <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
    <View className="flex-row items-center">
      {item.icon}
      <TitleText className="ml-2">{item.title}</TitleText>
    </View>

    {item.todoItems && item.todoItems.length > 0 ? (
      item.items.map((text, idx) => {
        const todoItem = item.todoItems?.[idx];

        const content = (
          <View key={idx} className="flex-row items-start">
            <AppText className="ml-5">•</AppText>
            <AppText className="ml-5">{text}</AppText>
          </View>
        );

        return item.id === '1' && todoItem ? (
          <TouchableOpacity key={idx} onPress={() => handleTodoClick(todoItem)}>
            {content}
          </TouchableOpacity>
        ) : (
          content
        );
      })
    ) : (
      <AppText className="ml-5 mt-2 text-gray-500 italic">
        No data available
      </AppText>
    )}
  </View>
);


  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
     year: 'numeric',   // 2025
  }).format(today);


  const requestNotificationPermission = async () => {
  if (Platform.OS === "ios") {
    // iOS flow
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
     // Alert.alert("✅ Notifications Enabled (iOS)");
    } else {
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
    // Android flow
    const { status } = await checkNotifications();

    if (status === "granted") {
      // Alert.alert("✅ Notifications already allowed (Android)");
      return;
    }

    const { status: newStatus } = await requestNotifications([
      "alert",
      "sound",
      "badge",
    ]);

    if (newStatus === "granted") {
      // Alert.alert("✅ Notifications Enabled (Android)");
    } else {
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
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        checkPermissionOnLoad();
      }
    });
    return () => {
      sub.remove();
    };
  }, [])
);

  return (
    <View className="flex-1 bg-background pt-14 px-4">
      <View className="px-4 mb-6">
        <TitleText size="text-24">
          Hi, {todoList?.data?.profile?.name ?? 'User'} 👋
        </TitleText>
        <AppText className="-mt-4">{formattedDate}</AppText>
      </View>

      {/* Banner for Notifications if not allowed */}
      {notificationsAllowed === false && (
        
  <View className="bg-yellow-100 border border-yellow-50 rounded-lg p-4 flex-row items-center mb-1">
  {/* Left side with icon + text */}
  <View className="flex-1 flex-row items-start">
    <Ionicons
      name="warning-outline"
      size={22}
      color="#B45309"
      style={{ marginTop: 2, marginRight: 8 }}
    />
    <View className="flex-1">
      <TitleText className="text-yellow-800  -mt-3">
        Notifications disabled
      </TitleText>
      <AppText className="text-yellow-700 text-sm -mt-3">
        Please enable notifications to ensure you don’t miss important emails and alerts.
      </AppText>
    </View>
  </View>

  {/* Button */}
  <TouchableOpacity
    onPress={requestNotificationPermission}
    className="bg-yellow-500 px-4 py-2 rounded-lg"
  >
    <Text className="text-white font-semibold text-sm">Allow</Text>
  </TouchableOpacity>
</View>


      )}

      <FlatList
        data={buildCardData()}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        showsVerticalScrollIndicator={false}
      />

      <Loader show={loading} />
    </View>
  );
}
 


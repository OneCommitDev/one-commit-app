import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, FlatList, Platform, AppState, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TitleText from "~/components/TitleText";
import AppText from "~/components/AppText";
import SimpleListSheet from "~/components/SimpleListSheet";
import ListviewShhet from "~/components/ListviewShhet";
import { checkNotifications, requestNotifications } from "react-native-permissions";
import { getItem } from "expo-secure-store";
import { clearAllPrefs, PREF_KEYS } from "~/utils/Prefs";
import { Api_Url, httpRequest2 } from "~/services/serviceRequest";
import { SimpleResponse } from "~/services/DataModals";
import { resetFCMToken } from "~/utils/AppFunctions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { decodeAccessToken } from "~/utils/decodeAccessToken";
import { removeItem } from "~/utils/storage";
import Loader from "~/components/Loader";
import EmailAccountPopupsModal from "./EmailAccountPopupsModal";

type RootStackParamList = {
  AppWebview : {url : string , title : string};
  UserProfile: {src : string};
  ContactUs: undefined;
  ChangePassword : undefined;
  Login :undefined;
  DeleteAccount : undefined;
};

export default function AppSystemSettings() {
   // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
      const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const [showSheet, setShowSheet] = useState(false);
    const [selectedData, setSelectedData] = useState<string[]>([]);
    const [selectedtitleData, setSelectedtitleData] = useState<string>('');
    const [selected, setSelected] = useState<string | null>(null);
    const [notificationsAllowed, setNotificationsAllowed] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [fcmToken, setFcmToken] = useState('');
    const [provider, setprovider] = useState('');
  const [emailAccount, setEmailAccount] = useState(false);
  const [connectedProvider, setConnectedProvider] = useState('');
  const [connectedEmail, setConnectedEmail] = useState('');
  const [showModal, setShowModal] = useState(false);




  const handleBack = () => {
    navigation.goBack();
  };

useFocusEffect(
  useCallback(() => {
    const accessToken = getItem(PREF_KEYS.accessToken);
    const decoded = decodeAccessToken(accessToken!);
    setprovider(decoded.provider)

    return () => {
      
      console.log("Screen is unfocused");
    };
  }, [])
);

  const settings = [
    {
      key: "account",
      title: "Account",
          subtitle: provider === "oc-use"
    ? "Personal info, Passwords"
    : ["Personal info"], 
      route: "Account",
      dataIs: provider === "oc-use"
    ? ["Personal info", "Change Password"]
    : ["Personal info"],  
    },
    {
      key: "integrations",
      title: "Integrations",
      subtitle: "Gmail/Outlook connections",
      route: "Integrations",
       dataIs : emailAccount === true  ? ["View connections" , "Remove Connections"] : [],
    },
    {
      key: "notifications",
      title: "Notifications",
      subtitle: "Modify notification settings",
      route: "Notifications",
       dataIs : ["Notifications"],
    },
    {
      key: "legal",
      title: "Legal",
      subtitle: "Privacy Policy, Terms",
      route: "Legal",
       dataIs : ["Privacy Policy" , "Terms Of Service" , "Contact us"],
    },
    {
      key: "danger",
      title: "Danger Zone",
      subtitle: "Delete account, log out",
      route: "DangerZone",
      danger: true,
       dataIs : ["Delete account" , "Log out"],
    },
  ];

    const handlePress = (item: typeof settings[0]) => {
        if(item.title === 'Notifications'){
                if (Platform.OS === "ios") { 
                     Linking.openURL("app-settings:");
                }else{
                     Linking.openSettings();
                }
        }
        else  if(item.title === 'Integrations' && emailAccount == false){  
              setShowModal(true)
        }
        else{
            setSelectedData(item.dataIs);  
            setSelectedtitleData(item.title);
            setShowSheet(true);    
        }
               
  };

  const renderItem = ({ item }: { item: typeof settings[0] }) => (
    <TouchableOpacity
   onPress={() => handlePress(item)}
      className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between"
    >
      <View>
        <TitleText
          className={`text-16 ${
            item.danger ? "text-red-600" : "text-gray-900"
          }`}
        >
          {item.title}
        </TitleText>
        <AppText className="-mt-2">{item.subtitle}</AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );



 
 

    const logoutWithFCMDeletion = async () => {
         setLoading(true);
       try {
       const accessToken = await getItem(PREF_KEYS.accessToken);
       const refreshToken = await getItem(PREF_KEYS.refreshToken);
       const url = Api_Url.fcmTokenDeleteAPI;
       const res = await httpRequest2<SimpleResponse>(
         url,   'delete',    {fcmToken : fcmToken , refreshToken : refreshToken},    accessToken ?? '',     true     );
         setLoading(false);
 // console.log('logs_res', res);
       if (res?.status) {
         clearAllPrefs();
         resetFCMToken();
         navigation.replace('Login');
     }else{
        clearAllPrefs();
         resetFCMToken();
          navigation.replace('Login');
     }  
     } catch (err) {
         setLoading(false);
       Alert.alert('Error', 'Unexpected error occurred.');
     } finally {
           setLoading(false);
     }
   };

 const loadConnectedEmail = async () => {
  const connected_id_provider = await getItem(PREF_KEYS.connected_id_provider);
  const email = await getItem(PREF_KEYS.connected_id);
  setConnectedProvider(connected_id_provider ?? '');
  setConnectedEmail(email ?? '');
  if (connected_id_provider) {
    setEmailAccount(true);
  } else {
    setEmailAccount(false);
  }
};

useEffect(() => {
  loadConnectedEmail();
}, []);

const handleEmailDelete = () => {

  Alert.alert(
    'Disconnect Email Account',
  `Are you sure you want to disconnect "${connectedEmail}" email account? After this, you will no longer be able to send or receive messages from coaches or schools.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect',
        style: 'destructive',
        onPress: () => {
         // setEmailAccount(false);
          disconnectEmail();
         // console.log('Email account disconnected');
        },
      },
    ]
  );
};


    const disconnectEmail = async () => {
         setLoading(true);
       try {
        const accessToken = await getItem(PREF_KEYS.accessToken);
        const url = Api_Url.removeEmailApi;         
         const res = await httpRequest2<SimpleResponse>(
          url,   'post',    {remove_email : connectedEmail},    accessToken ?? '',     true     );
         setLoading(false);
         
       if (res?.status) {
          removeItem(PREF_KEYS.connected_id);
          removeItem(PREF_KEYS.connected_id_provider);
           Alert.alert('Disconnected', 'Your account has been successfully disconnected.');
       }  
      } catch (err) {
       
      } finally {
           setLoading(false);
            loadConnectedEmail();
      }
    };


  return (
    <View className="flex-1 bg-background h-full">
      {/* Header */}
      <View className="flex-row mt-14 items-center px-4 mb-2">
        <TouchableOpacity
          onPress={handleBack}
          className="w-11 h-11 rounded-full bg-gray-200 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#1A322E" />
        </TouchableOpacity>

        <View className="flex-1 ml-3">
          <TitleText>App & System Settings</TitleText>
        </View>
      </View>

      {/* Settings List */}
  <View className="px-2 py-2 w-full h-full">
        <FlatList
        data={settings}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
  </View>

      <ListviewShhet
        visible={showSheet}
        title={selectedtitleData}
        data={selectedData}
        onClose={() => setShowSheet(false)}
        onSelect={(item) => {
            setSelected(item);
            switch (item) {
            case "Privacy Policy":
                              navigation.navigate('AppWebview', { url: 'https://onecommit.us/privacy-policy', title : 'Privacy Policy' }) ;  

            break;
            case "Terms Of Service":
                              navigation.navigate('AppWebview', { url: 'https://onecommit.us/terms-of-service' , title : 'Terms of Service' }) ;  

            break;
            case "Contact us":
                navigation.navigate('ContactUs')
            break;
           case "View connections":
            console.log('sdfsdfsfsf');
           setShowModal(true);

                break;
            case "Remove Connections":
                handleEmailDelete();
                break;
            case "Personal info":
                navigation.navigate("UserProfile" , {src : '1'})
                break;
            case "Change Password":
                 navigation.navigate("ChangePassword");
                break;
            case "Delete account":
                navigation.navigate('DeleteAccount');
                break;
            case "Log out":
                logoutWithFCMDeletion();
                break;
            default:
                //console.warn("No action defined for", item);
            }
        }}
        />
        <Loader show={loading} />
    <EmailAccountPopupsModal
      visible={showModal}
      onClose={() => {
        loadConnectedEmail();
        setShowModal(false);
      }}
    />
    </View>
  );
}
 


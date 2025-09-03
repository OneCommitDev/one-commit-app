import React, { useEffect, useState } from 'react';
import {  View,  Text,  TouchableOpacity,  Switch,  ScrollView,  Image,  Alert,} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import { Route, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { clearAllPrefs, PREF_KEYS } from '~/utils/Prefs';
import { getItem, removeItem } from '~/utils/storage';
import Loader from '~/components/Loader';
import { getFCMToken, resetFCMToken } from '~/utils/AppFunctions';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { SimpleResponse } from '~/services/DataModals';
import EmailAccountPopupsModal from './EmailAccountPopupsModal';
import { setItem } from 'expo-secure-store';

 type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;

  EditProfileInfo: {src : string};
  EmailConnectionUI: { selectedGames: string[]; stepToEdit: number };
  ProfilePreview: { selectedGames: string[]; stepToEdit: number };
  CollegePreferences: { selectedGames: string[]; stepToEdit: number };
  Academic: { selectedGames: string[]; stepToEdit: number };
  Athletic: { selectedGames: string[]; stepToEdit: number };

  DeleteAccount: undefined;
  ContactUs: undefined;
  AppWebview: { url: string; title: string };
};


 
 
export default function ProfileSetting() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showModal, setShowModal] = useState(false);
  const [autoFollowUp, setAutoFollowUp] = useState(false);
  const [emailAccount, setEmailAccount] = useState(false);
  const [connectedProvider, setConnectedProvider] = useState('');
  const [connectedEmail, setConnectedEmail] = useState('');
  const [smartRecommendations, setSmartRecommendations] = useState(true);
  const [loading, setLoading] = useState(false);
const [fcmToken, setFcmToken] = useState('');

    useEffect(() => {
      (async () => {
        const token = await getFCMToken();
        if (token) {
          setFcmToken(token);
        } else {
         // console.log("Failed to get FCM token");
        }
      })();
    }, []);

  const handleLogout = () => {
     logoutWithFCMDeletion()
 /*   setLoading(true)
    clearAllPrefs();
        resetFCMToken();

    setTimeout(() => {
        setLoading(false);
        navigation.replace('Login');
    }, 300);
*/
  };


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
  const provider = await getItem(PREF_KEYS.connected_id_provider);
  const email = await getItem(PREF_KEYS.connected_id);
  setConnectedProvider(provider ?? '');
  setConnectedEmail(email ?? '');
  if (provider) {
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
    'Are you sure you want to disconnect this email account? After this, you will no longer be able to send or receive messages from coaches or schools.',
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
                        setEmailAccount(false);

       }  
      } catch (err) {
          setLoading(false);
        Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
           setLoading(false);
      }
    };
  


// type RouteName = keyof RootStackParamList;

// const tetsing = async (stepToEdit: number, screen: RouteName) => {
//   navigation.navigate(screen, {
//     selectedGames: [],
//     stepToEdit,
//   } as never);
// };
    


  return (
    <View className="flex-1 bg-background">
        <Loader show={loading} />
      
       <View className="px-4 mb-6 pt-14">
              <TitleText size='text-24'>Profile Settings</TitleText>
             </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-6">

<View className="flex-row  justify-between bg-white py-3 rounded-2xl mb-4">
  <View className="flex-row items-center">
    <Image
      source={{ uri: 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png' }} // Replace with actual image
      className="h-14 w-14 rounded-full ml-4"
    />
    <View className="ml-3">
     <TitleText>
      Hello, {getItem(PREF_KEYS.displayName)} ! 👋
      </TitleText>
      <View className="flex-row items-center mt-1">
        <Ionicons name="star" size={14} color="#FACC15" className="ml-1 -mt-5" />
        <AppText className="ml-1 -mt-5">Pro Member</AppText>
      </View>
    </View>
  </View>

  {/* Edit Icon */}
  {/* <TouchableOpacity className="p-2">
    <Ionicons name="create-outline" size={18} color="#6B7280" />
  </TouchableOpacity> */}
</View>

      <View>
              {/* Connected Email Account */}
               {emailAccount ? (
            <TitleText className="mb-2">Connected Email Account</TitleText>
          ) : 
           null
          }

              <View className="bg-white px-4 py-4 rounded-xl mb-6">
                {/* Top Row: Icon + Gmail + Buttons */}
 {emailAccount ? (
  <View className="flex-row justify-between items-center">
    <View className="flex-row items-center">
      <View className="h-14 w-14 rounded-full bg-gray-200 justify-center items-center">
        <Ionicons name="mail-outline" size={24} color="#6B7280" />
      </View>

      <View className="ml-4">
        <TitleText>{connectedProvider}</TitleText>
        <AppText className="-mt-3 mb-2">{connectedEmail}</AppText>
      </View>
    </View>

    {/* Right: Delete Button */}
    <TouchableOpacity onPress={handleEmailDelete} className="mr-3">
      <Ionicons name="trash-outline" size={20} color="#DC2626" />
    </TouchableOpacity>
  </View>
) : (
 <View>
  <TouchableOpacity
  onPress={() => setShowModal(true)}
  activeOpacity={0.8}
  className="flex-row items-center bg-white rounded-xl"
>
  {/* Icon */}
  <View className="h-14 w-14 rounded-full justify-center items-center -mt-1 bg-gray-100">
    <Ionicons name="mail-outline" size={26} color="#4B5563" />
  </View>

  {/* Text */}
 <View className="ml-4 flex-1 mr-6">
  <TitleText>
    Connect Your Email
  </TitleText>
  <AppText
    className="-mt-3 text-gray-600" size='text-12'
    style={{ flexWrap: 'wrap' }} 
  >
    Link Gmail or Outlook to start messaging
  </AppText>
</View>


  {/* Arrow Icon */}
  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
</TouchableOpacity>


    <EmailAccountPopupsModal
  visible={showModal}
  onClose={() => {
    loadConnectedEmail();
    setShowModal(false);
  }}
/>

  </View>
)}


              </View>


              {/* Email Preferences */}
              {/* <View className="mb-6">
                <TitleText className="mb-3">Email Preferences</TitleText>

                 <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-1 pr-4">
                    <TitleText>Auto-Send Follow-Ups</TitleText>
                    <AppText className='-mt-3'>
                      Let OneCommit send scheduled follow-ups for you
                    </AppText>
                  </View>
                  <Switch value={autoFollowUp} onValueChange={setAutoFollowUp} />
                </View>

                 <View className="flex-row justify-between items-center">
                  <View className="flex-1 pr-4">
                    <TitleText>Smart Recommendations</TitleText>
                    <AppText className='-mt-3'>
                      Use AI to prioritize schools and suggest next steps
                    </AppText>
                  </View>
                  <Switch value={smartRecommendations} onValueChange={setSmartRecommendations} />
                </View>
              </View> */}

              {/* Account Controls */}
              <View className="mb-6">
                <TitleText className="mb-3">Account Controls</TitleText>

                <SettingItem icon="person-outline" text="Edit Profile Info"
                onPress={() => navigation.navigate("EditProfileInfo" , {src : '123'})}

                   />
                <SettingItem icon="trash-outline" text="Delete Account" textClass="text-red-800" onPress={() => navigation.navigate('DeleteAccount')} />
                {/* <SettingItem icon="log-out-outline" text="Log Out" /> */}
                <SettingItem
                icon="log-out-outline"
                text="Log Out"
                 onPress={handleLogout}
            />
              </View>

              {/* Support */}
              <View>
              <TitleText className="mb-3">Support</TitleText>
                <SettingItem icon="help-circle-outline" text="Contact Support"   onPress={() => navigation.navigate('ContactUs')}
 />
                <SettingItem icon="document-text-outline" text="Terms of Service"  onPress={() => navigation.navigate('AppWebview', { url: 'https://onecommit.us/terms-of-service' , title : 'Terms of Service' })} />
                <SettingItem icon="lock-closed-outline" text="Privacy Policy"  onPress={() => navigation.navigate('AppWebview', { url: 'https://onecommit.us/privacy-policy', title : 'Privacy Policy' })} />
              </View>


  {/* <View>
  <TitleText className="mb-3">TESTING SECTION</TitleText>
  <SettingItem icon="help-circle-outline" text="Personal Record"   onPress={() => tetsing(0, "Athletic")} />
  <SettingItem icon="document-text-outline" text="Academic info"   onPress={() => tetsing(0, "Academic")} />
  <SettingItem icon="lock-closed-outline" text="CollegePreferences"   onPress={() => tetsing(0, "CollegePreferences")} />
  <SettingItem icon="lock-closed-outline" text="EmailConnectionUI"  onPress={() => tetsing(0, "EmailConnectionUI")} />
  <SettingItem icon="lock-closed-outline" text="ProfilePreview"  onPress={() => tetsing(0, "ProfilePreview")}  />

            
              </View> */}

              {/* Footer Logo */}
              <View className="items-center mt-10">
                {/* <Image
                  source={require('assets/icon.png')} 
                  className='h-24 w-24 rounded-full'
                /> */}

                <Image
                  source={require('assets/images/logo.png')}
                  className="w-[60px] h-[60px]"
                  style={{ tintColor: '#235D48' }}
                  resizeMode="contain"
                />

                <TitleText className="mt-2 text-center">
                  OneCommit
                </TitleText>
                <AppText className="-mt-2 text-center">
                  One tool. One decision. One future.
                </AppText>
              </View>
      </View>
      </ScrollView>
    </View>
  );
}
 


 function SettingItem({
  icon,
  text,
  textClass = 'text-gray-900',
  onPress,
}: {
  icon: string;
  text: string;
  textClass?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="py-2">
      <View className="flex-row items-center justify-between h-16 w-full bg-white rounded-2xl px-4 border border-gray-200">
        <View className="flex-row items-center">
          <Ionicons name={icon as any} size={20} color="#6B7280" />
          <View className="ml-3 justify-center">
            <AppText className={`${textClass}`}>{text}</AppText>
          </View>
        </View>
        <Ionicons name="arrow-forward-sharp" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}


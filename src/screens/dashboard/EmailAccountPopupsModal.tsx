import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Linking, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import AppText from '~/components/AppText';
import TitleText from '~/components/TitleText';
import { useMicrosoftEmailConnect } from '~/utils/socialAuth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Loader from '~/components/Loader';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { EmailConnectionResponse, SimpleResponse } from '~/services/DataModals';
import * as Microsoft from 'expo-auth-session/providers/google';
import { APP_CONFIG_GOOGLE, APP_CONFIG_MICROSOFT } from '~/utils/constants';
import { getItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';
import { setItem } from '~/utils/storage';

 export default function EmailAccountPopupsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<'gmail' | 'outlook' | null>(null);
  const [selectedTemp, setSelectedTemp] = useState<'gmail' | 'outlook' | null>(null);
  const [loading, setLoading] = useState(false);

  const { promptAsync: microsoftPrompt, response: microsoftResponse, handleResponse: handleMicrosoftResponse } =
    useMicrosoftEmailConnect([
      'https://graph.microsoft.com/Mail.ReadWrite',
      'https://graph.microsoft.com/Mail.Send',
    ]);

  const [request] = Microsoft.useAuthRequest({
    clientId: APP_CONFIG_MICROSOFT.CLIENT_ID,
  });

  useEffect(() => {
    (async () => {
      const microsoftData = await handleMicrosoftResponse();
      if (microsoftData?.code) {
        setTimeout(() => {
          SocialLoginRequestVerifyTokens(microsoftData.code, Api_Url.microsoft_email_connect);
        }, 300);
      }
    })();
  }, [microsoftResponse]);

  GoogleSignin.configure({
    scopes: APP_CONFIG_GOOGLE.emailScopes,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    webClientId: APP_CONFIG_GOOGLE.webClient,
    iosClientId: APP_CONFIG_GOOGLE.iosClient,
    profileImageSize: 120,
  });

  const GooglesignInApp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn() as any;
      const tokens = await GoogleSignin.getTokens();
      const serverAuthCode = userInfo.data.serverAuthCode ?? userInfo.data.user?.serverAuthCode;

      if (!tokens.accessToken || !serverAuthCode) return;

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      // const data = await res.json();
      // setItem(PREF_KEYS.connected_id , data.emailAddress)
      //  setItem(PREF_KEYS.connected_id_provider , "Gmail")


       const userEmail = userInfo?.user?.email;

      if (res.status === 200) {
        setTimeout(() => {
          SocialLoginRequestVerifyTokens(serverAuthCode, Api_Url.google_email_connect);
        }, 100);
      } else if (res.status === 403) {
        Alert.alert('Permission Required', 'Please allow email read and write permissions');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
     // console.log('Sign-in error:', error);
    }
  };

  const SocialLoginRequestVerifyTokens = async (authCode: string, api_url: string) => {
    try {
      setLoading(true);
      const requestBody = { authCodeToken: authCode };
      const token = await getItem(PREF_KEYS.accessToken);
      const res = await httpRequest2<SimpleResponse>(api_url, 'post', requestBody, token ?? '', true);

      if (res.status) {
        onClose(); 
        EmilgetApiRequest();
      } else {
        Alert.alert('Error', res.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selected === 'outlook') {
      microsoftPrompt({ useProxy: false } as any);
    } else {
      GooglesignInApp();
    }
  };


     const EmilgetApiRequest = async () => {
       try {
         setLoading(true);
         const accessToken = await getItem(PREF_KEYS.accessToken); // await required
         const res = await httpRequest2<EmailConnectionResponse>(
           Api_Url.get_email_connection,
           'get',
           {},
           accessToken ?? '',
         );
           setLoading(false);
     
         if (res.status ) {
            if(res.data.provider === 'Gmail'){
              setItem(PREF_KEYS.connected_id , res.data.email)
              setItem(PREF_KEYS.connected_id_provider , "Gmail")
            }
           else if(res.data.provider === 'Microsoft'){
                setItem(PREF_KEYS.connected_id , res.data.email)
              setItem(PREF_KEYS.connected_id_provider , "Outlook")
            } 
             onClose(); 
            
         } else {
             
         }
       } catch (err) {
         Alert.alert('Error', 'Unexpected error occurred.');
       } finally {
         setLoading(false);
       }
     };

  return (
  <Modal
  visible={visible}
  animationType="fade"
  transparent
  onRequestClose={onClose}
>
  <View className="flex-1 bg-black/50 justify-center px-5">
    <View className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TitleText size="text-20" className="font-bold">
          Connect Email Account
        </TitleText>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <AppText className="text-gray-600 mb-4">
        Select your email provider to connect your account with OneCommit’s outreach features.
      </AppText>

      {/* Gmail Option */}
      <TouchableOpacity
        onPress={() => setSelected('gmail')}
        activeOpacity={0.8}
        className={`flex-row items-center p-4 mb-3 rounded-xl shadow-sm ${
          selected === 'gmail' ? 'bg-primary/10 border-2 border-primary' : 'bg-white border border-gray-200'
        }`}
      >
        <Image
          source={{ uri: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' }}
          className="w-10 h-10 rounded-full"
        />
        <TitleText className="ml-4">
          {selectedTemp === 'gmail' ? 'Gmail Account Connected' : 'Connect Gmail Account'}
        </TitleText>
      </TouchableOpacity>

      {/* Outlook Option */}
      <TouchableOpacity
        onPress={() => setSelected('outlook')}
        activeOpacity={0.8}
        className={`flex-row items-center p-4 rounded-xl shadow-sm ${
          selected === 'outlook' ? 'bg-primary/10 border-2 border-primary' : 'bg-white border border-gray-200'
        }`}
      >
        <Image
          source={require('../../../assets/images/outlook.png')}
          className="w-10 h-10"
        />
        <TitleText className="ml-4">
          {selectedTemp === 'outlook' ? 'Outlook Account Connected' : 'Connect Outlook Account'}
        </TitleText>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View className="mt-6 flex-row justify-between">
        <TouchableOpacity
          onPress={onClose}
          className="flex-1 bg-gray-200 py-3 rounded-xl mr-2"
        >
          <AppText className="text-center font-semibold text-gray-700">
            Cancel
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!selected}
          className={`flex-1 py-3 rounded-xl ml-2 ${
            selected ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <AppText className="text-center font-semibold text-white">
            Continue
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

  );
}


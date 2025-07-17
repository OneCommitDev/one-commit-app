import React, { useEffect, useState } from 'react';
import {  View,  Text,  TouchableOpacity,  Image,  Linking, Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import AppText from '~/components/AppText';
import TitleText from '~/components/TitleText';
import { useMicrosoftEmailConnect, useMicrosoftLogin } from '~/utils/socialAuth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Loader from '~/components/Loader';
import { Api_Url, httpRequest_social_token } from '~/services/serviceRequest';
import { SocialTokenResponse } from '~/services/DataModals';
 import * as Microsoft from 'expo-auth-session/providers/google';
import { APP_CONFIG_MICROSOFT } from '~/utils/constants';

type Props = {
  onNext?: () => void;
};

export default function EmailConnectionUI({ onNext }: Props) {
  const [selected, setSelected] = useState<'gmail' | 'outlook' | null>(null);
  const [loading, setLoading] = useState(false);
  const {    promptAsync: microsoftPrompt,    response: microsoftResponse,    handleResponse: handleMicrosoftResponse,  request: microsoftRequest,} = useMicrosoftEmailConnect([
  'https://graph.microsoft.com/Mail.Read',
  'https://graph.microsoft.com/Mail.Send'
]);
  
  const [request, response, promptAsync] = Microsoft.useAuthRequest({
     clientId: APP_CONFIG_MICROSOFT.CLIENT_ID,
  });

 useEffect(() => {
  (async () => {
    const microsoftData = await handleMicrosoftResponse();

    if (microsoftData?.code) {
      console.log("🔑 Microsoft Auth Code:", microsoftData.code);
      console.log("🧾 codeVerifiercodeVerifier :", request?.codeVerifier);
   

        setTimeout(() => {
             SocialLoginRequestVerifyTokens(
            microsoftData.code,
            Api_Url.microsoft_email_connect
            );
        }, 300);


    }
  })();
}, [microsoftResponse]);





  GoogleSignin.configure({
    scopes: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/gmail.readonly',  
    'https://www.googleapis.com/auth/gmail.send',       
    'https://www.googleapis.com/auth/gmail.modify',
    // ''
  ],
    offlineAccess: true, 
    forceCodeForRefreshToken: true,
    webClientId: '156935841607-s3q4q01qhosr3bviecpnuratotulsutm.apps.googleusercontent.com', 
    iosClientId: '156935841607-6qjtusg96ddbk3u0n87l7irgh1u3mi31.apps.googleusercontent.com', 
    profileImageSize: 120, 
});

  const GooglesignInApp = async () => { 
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn() as any;
        const tokens = await GoogleSignin.getTokens(); // Get access & id token
        //console.log('FULL userInfo:', JSON.stringify(userInfo, null, 2));
        const serverAuthCode = userInfo.data.serverAuthCode ?? userInfo.data.user?.serverAuthCode;
        console.log(serverAuthCode);  
   
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const err = error as { code: string; message?: string };
        switch (err.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Sign in already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services not available or outdated');
            break;
          default:
            console.log('Unhandled error code:', err.code);
            console.log('Sign-in error full:', JSON.stringify(error, null, 2));
        }
      } else {
        console.log('Unknown error:', error);
      }
    }
  };
  

   const handleSubmit = () => {  
      if(selected === 'outlook'){
          microsoftPrompt({ useProxy: false } as any); 
      }else{
               GooglesignInApp();
      }
   }


   const SocialLoginRequestVerifyTokens = async (authCode: string, api_url : string) => {
     try {
       setLoading(true);
       const requestBody = {
        "authCodeToken" :authCode,
       };
   
      // console.log(requestBody);
   
       const res = await httpRequest_social_token<SocialTokenResponse>(
         api_url,
         'post',
         requestBody,
         undefined,
         true
       );
   
       console.log(res);
       if (res.data?.accessToken) {
 
       } else {
         Alert.alert('Error',  'Somthing went wrong failed');
       }
     } catch (err) {
       Alert.alert('Error', 'Unexpected error occurred.');
       console.log('Social Login Errors:', err);
     } finally {
       setLoading(false);
     }
   };
   

  return (
    <View className="space-y-5 pb-28">
      {/* Gmail */}
      <TouchableOpacity
        onPress={() => setSelected('gmail')}
        className={`flex-row items-center justify-between rounded-2xl px-5 py-4 h-24 mt-5 bg-white ${
          selected === 'gmail' ? 'border-2 border-primary' : 'border border-transparent'
        } shadow-sm`}
      >
                <Loader show={loading} />
        
        <View className="flex-row items-center space-x-4">
          <Image
            source={{ uri: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' }}
            className="w-10 h-10 rounded-full"
          />
          <TitleText className='ml-6'>
            Connect Gmail
          </TitleText>
        </View>
        {/* <Ionicons name="arrow-forward" size={20} color="#1A322E" /> */}
      </TouchableOpacity>

      {/* Outlook */}
      <TouchableOpacity
        onPress={() => setSelected('outlook')}
        className={`flex-row items-center justify-between rounded-2xl px-5 py-4 h-24 mt-3 bg-white ${
          selected === 'outlook' ? 'border-2 border-primary' : 'border border-transparent'
        } shadow-sm`}
      >
        <View className="flex-row items-center space-x-4">
          <Image
            source={require('../../../assets/images/outlook.png')
}
            className="w-10 h-10"
          />
          <TitleText className='ml-6'>
            Connect Outlook
          </TitleText>
        </View>
        {/* <Ionicons name="arrow-forward" size={20} color="#1A322E" /> */}
      </TouchableOpacity>

      {/* Info Box */}
      <View className="bg-background border border-border_color rounded-xl p-2 mt-4 mb-6 text-title">
        <AppText className="leading-relaxed ml-2">
          Email connection is required to use OneCommit’s outreach features. To learn more, click{' '}
          <Text
            className="underline text-black"
            onPress={() => Linking.openURL('https://onecommit.us/')}
          >
            here
          </Text>
          .
        </AppText>
      </View>

      {/* Continue Button */}
      <View className="px-2">
        <ArrowButton
          text="Continue"
          // onPress={() => onNext?.()}
          onPress={() => handleSubmit()}
          fullWidth
          disabled={!selected}  
        />

        <TouchableOpacity onPress={() => onNext?.()}>
          <AppText className='text-center mt-5'>Skip for now</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
 

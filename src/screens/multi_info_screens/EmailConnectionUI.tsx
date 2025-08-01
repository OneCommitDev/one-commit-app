import React, { useEffect, useState } from 'react';
import {  View,  Text,  TouchableOpacity,  Image,  Linking, Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import AppText from '~/components/AppText';
import TitleText from '~/components/TitleText';
import { useMicrosoftEmailConnect, useMicrosoftLogin } from '~/utils/socialAuth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Loader from '~/components/Loader';
import { Api_Url, httpRequest2, httpRequest_social_token } from '~/services/serviceRequest';
import { EmailConnectionResponse, EmailOutreach, SimpleResponse, SocialTokenResponse } from '~/services/DataModals';
 import * as Microsoft from 'expo-auth-session/providers/google';
import {  APP_CONFIG_GOOGLE, APP_CONFIG_MICROSOFT } from '~/utils/constants';
import { getItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';

type Props = {
  onNext?: () => void;
  goToLastStep?: () => void;
  stepToEdit: number | null;
};

export default function EmailConnectionUI({ onNext , goToLastStep , stepToEdit}: Props) {
  const [selected, setSelected] = useState<'gmail' | 'outlook' | null>(null);
    const [selectedTemp, setSelectedTemp] = useState<'gmail' | 'outlook' | null>(null);

  const [loading, setLoading] = useState(false);
  const {    promptAsync: microsoftPrompt,    response: microsoftResponse,    handleResponse: handleMicrosoftResponse,  request: microsoftRequest,} = useMicrosoftEmailConnect([
  'https://graph.microsoft.com/Mail.ReadWrite',
  'https://graph.microsoft.com/Mail.Send'
]);
  
  const [request, response, promptAsync] = Microsoft.useAuthRequest({
     clientId: APP_CONFIG_MICROSOFT.CLIENT_ID,
  });

 useEffect(() => {
  (async () => {
    const microsoftData = await handleMicrosoftResponse();
    if (microsoftData?.code) {
      // console.log("🔑 Microsoft Auth Code:", microsoftData.code);
      // console.log("🧾 codeVerifiercodeVerifier :", request?.codeVerifier);
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
        const tokens = await GoogleSignin.getTokens(); // Get access & id token
        //console.log('FULL userInfo:', JSON.stringify(userInfo, null, 2));
        const serverAuthCode = userInfo.data.serverAuthCode ?? userInfo.data.user?.serverAuthCode;
        console.log(serverAuthCode);  
        if (!tokens.accessToken || !serverAuthCode) {
            console.log('Missing tokens or serverAuthCode');
            return;
          }

            // Step 2: Check Gmail scope access using access token
          const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });
            if (res.status === 200) {  
              
            setTimeout(() => {
            //  checkGmailScopeAccess(serverAuthCode);
             SocialLoginRequestVerifyTokens(
                serverAuthCode,
                Api_Url.google_email_connect
            );
              }, 100);
            }
            else if (res.status === 403) {
            Alert.alert('Gmail scope not granted, please allow the eramil read and write permissions');
          }

        
      
   
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
 
const checkGmailScopeAccess = async (serverAuthCode : string) => {
  try {
    // Step 1: Sign in and get access token
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens(); // { idToken, accessToken }
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    if (res.status === 200) {
          setTimeout(() => {
             SocialLoginRequestVerifyTokens(
                serverAuthCode,
                Api_Url.google_email_connect
            );
        }, 300);
      console.log('✅ Gmail read scope granted');
    } else if (res.status === 403) {
      console.log('❌ Gmail scope not granted or token expired');
    } else {
      console.log(`❗ Unexpected response status: ${res.status}`);
    }
  } catch (err) {
    console.error('Error checking Gmail scope:', err);
  }
};

  

   const handleSubmit = () => {  
    if(stepToEdit != null){
        if(selectedTemp == selected){
            goToLastStep?.();
        }else{
        if(selected === 'outlook'){
            microsoftPrompt({ useProxy: false } as any); 
        }else{
              GooglesignInApp();
        }
        }
    }else{
      if(selectedTemp == selected){
            onNext?.();
        }else{
            if(selected === 'outlook'){
              microsoftPrompt({ useProxy: false } as any); 
            }else{
                GooglesignInApp();
            }
        }
     
    }
     
   }


     const SocialLoginRequestVerifyTokens = async (authCode: string, api_url : string) => {
      try {
        setLoading(true);
        const requestBody = {
          "authCodeToken" :authCode,
        };
    
        // console.log(requestBody);
          const token = getItem(PREF_KEYS.accessToken);
          const res = await httpRequest2<SimpleResponse>(api_url, 'post', requestBody, token ?? '' , true);
        
        console.log(res);
        if (res.status) {
          if(stepToEdit != null){
            goToLastStep?.();
          }else{
            onNext?.();
          }
        
        } else {
          Alert.alert('Error',  res.message);
        }
      } catch (err) {
        Alert.alert('Error', 'Unexpected error occurred.');
        console.log('Social Login Errors:', err);
      } finally {
        setLoading(false);
      }
   };


  
     useEffect(() => {
       EmilgetApiRequest();
     }, []);
   
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
             setSelected('gmail');
             setSelectedTemp('gmail');
          }
         else if(res.data.provider === 'Microsoft'){
             setSelected('outlook');
              setSelectedTemp('outlook');
          }else{
              
          }
          
       } else {
         
       }
     } catch (err) {
       Alert.alert('Error', 'Unexpected error occurred.');
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
   <View className='ml-5'>
  <TitleText>
    {selectedTemp === 'gmail' ? 'Gmail Account Connected' : 'Connect Gmail Account'}
  </TitleText>

  {/* {selectedTemp === 'gmail' && (
    <Text>
      abc@abc.com
    </Text>
  )} */}
</View>

        </View>
        {/* {selected === 'gmail'}{
            <Ionicons name="checkmark-circle" size={20} color="#1A322E" />
        } */}
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
       <View>
           <TitleText className='ml-6'>
              {selectedTemp == 'outlook' ? 'Connected with Outlook' : 'Connect Outlook Account'}
          </TitleText>
       </View>
        </View>
        {/* {selected === 'outlook' && (
          <Ionicons name="checkmark-circle" size={20} color="#1A322E" />
        )}  */}
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
        {stepToEdit == null && (
          <TouchableOpacity onPress={() => onNext?.()}>
            <AppText className="text-center mt-5">Skip Connection For Now</AppText>
          </TouchableOpacity>
        )}

       
      </View>
    </View>
  );
}
 

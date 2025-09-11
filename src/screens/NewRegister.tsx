import React, { useEffect, useState } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,  Keyboard,  Alert,  Platform,  InteractionManager,} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Logo from '~/components/Logo';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Api_Url, base_url, httpRequest2, httpRequest_social_token, postFormUrlEncoded, postRequest, RegisterRequest, setAuthToken } from '~/services/serviceRequest';
import Loader from '~/components/Loader';
import { CheckEmailVerifyResponse, RegisterResponse, SocialTokenResponse } from '~/services/DataModals';
import { getItem, setItem } from 'expo-secure-store';
import { PREF_KEYS, Temp_KEYS } from '~/utils/Prefs';
import axios from 'axios';
import { Applog } from '~/utils/logger';
import SocialIcons from '~/components/SocialIcons';
import {  GoogleSignin,  GoogleSigninButton,  isErrorWithCode,  isSuccessResponse,
  SignInResponse,  statusCodes,} from '@react-native-google-signin/google-signin';
 import * as Google from 'expo-auth-session/providers/google';
import { APP_CONFIG_GOOGLE } from '~/utils/constants';
import { useMicrosoftLogin } from '~/utils/socialAuth';
import { Savedetailsafterlogin } from '~/utils/decodeAccessToken';
import SocialIconsVerticall from '~/components/SocialIconsVerticall';
import TitleText from '~/components/TitleText';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';


 
 GoogleSignin.configure({
     scopes: APP_CONFIG_GOOGLE.emailLoginScopes,
       offlineAccess: true, 
       forceCodeForRefreshToken: true,
       webClientId: APP_CONFIG_GOOGLE.webClient, 
       iosClientId: APP_CONFIG_GOOGLE.iosClient, 
       profileImageSize: 120, 
 });

export default function NewRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [confirmSecure, setConfirmSecure] = useState(true);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const {
    promptAsync: microsoftPrompt,
    response: microsoftResponse,
    handleResponse: handleMicrosoftResponse,
  } = useMicrosoftLogin();

   const [result, setResult] = useState(null);
    const redirectUri = 'OneCommit://redirect';
  
  const GooglesignOutApp = async () => {
    try {
      await GoogleSignin.signOut();
     } catch (error) {
     // console.error(error);
    }
  };
  
  const GooglesignInApp = async () => {
        // await GoogleSignin.signOut(); // Force clean login
        try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn() as any;
        const tokens = await GoogleSignin.getTokens(); // Get access & id token
        //console.log('FULL userInfo:', JSON.stringify(userInfo, null, 2));
        const serverAuthCode = userInfo.data.serverAuthCode ?? userInfo.data.user?.serverAuthCode;
      // Save details
      await setItem(PREF_KEYS.login_status, 'success');
      await setItem(PREF_KEYS.accessToken, tokens.accessToken);
      await setItem(PREF_KEYS.refreshToken, tokens.idToken);
      await setItem(PREF_KEYS.userEmailID, userInfo.data?.user.email ?? '');
      await  SocialLoginRequestVerifyTokens(serverAuthCode , Api_Url.google_token );
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const err = error as { code: string; message?: string };
        switch (err.code) {
          case statusCodes.SIGN_IN_CANCELLED:
           // console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
           /// console.log('Sign in already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          //  console.log('Play services not available or outdated');
            break;
          default:
           // console.log('Unhandled error code:', err.code);
           // console.log('Sign-in error full:', JSON.stringify(error, null, 2));
        }
      } else {
       // console.log('Unknown error:', error);
      }
    }
  };
  
  
  useEffect(() => {
    (async () => {
      const microsoftData = await handleMicrosoftResponse();
      if (microsoftData?.code) {
        const codeVerifier = microsoftData;
        setItem('microsoftCode', microsoftData.code);
      await  SocialLoginRequestVerifyTokens(microsoftData.code , Api_Url.microsoft_token );
      }
    })();
  }, [microsoftResponse]);

    const handleSocialClick = (platform: any) => {
      const baseurl = base_url;
        if (platform === 'google') {
         const loginUrl = baseurl + `/auth/google?redirectUri=${encodeURIComponent(redirectUri)}`;
         GooglesignInApp();
         }
         if (platform === 'microsoft') {
            const loginUrl = baseurl + `/auth/microsoft?redirectUri=${encodeURIComponent(redirectUri)}`;
             //  handleLogin(loginUrl);
            microsoftPrompt({ useProxy: false } as any); // 👈 triggers Microsoft login
         }
        if (platform === 'apple') {
           signInWithApple();
        }
    };

     const signInWithApple = async () => {
      if (Platform.OS === "ios") {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
    
          // Extract useful fields
          const userInfo = {
            user: credential.user,                  
            email: credential.email ?? null,        
            fullName: credential.fullName
              ? `${credential.fullName.givenName ?? ""} ${credential.fullName.familyName ?? ""}`.trim()
              : null,
            identityToken: credential.identityToken ?? null, // JWT (id_token)
            authorizationCode: credential.authorizationCode ?? null, // Short-lived code
          };
           if (userInfo.fullName) {
               await  setItem(PREF_KEYS.apple_display_name , userInfo.fullName ?? "")
           }
          const Displayname_get = await getItem(PREF_KEYS.apple_display_name)
    
           if (userInfo.authorizationCode) {
        InteractionManager.runAfterInteractions(async () => {
              await SocialLoginRequestVerifyTokens(
                userInfo.authorizationCode!,
                Api_Url.apple_token,
                Displayname_get ?? ""
              );
            });
         }
     
          return userInfo;
        } catch (e: any) {
          if (e.code === "ERR_CANCELED") {
           // Alert.alert("Cancelled", "User cancelled Apple sign in.");
          } else {
             Alert.alert("Error", e?.message ?? JSON.stringify(e));
          }
          return null;
        }
      } 
    };

const SocialLoginRequestVerifyTokens = async (authCode: string, api_url : string , fullName? : string) => {
      try {
        setLoading(true);
        const requestBody = {
         "authCodeToken" :authCode,
     'fullName' : fullName
        };
        const res = await httpRequest_social_token<SocialTokenResponse>(
          api_url,
          'post',
          requestBody,
          undefined,
          true
        );
    
         setLoading(false);
        if (res.data?.accessToken) {
          await setItem(PREF_KEYS.login_status, 'success');
          await setItem(PREF_KEYS.accessToken, res.data?.accessToken);
          if (res.data.refreshToken) {
            await setItem(PREF_KEYS.refreshToken, res.data?.refreshToken);
          }
            await Savedetailsafterlogin();
            if(res.profile.complete == true){
              setItem(PREF_KEYS.profileCompleted , 'success');
              navigation.replace('Dashboard' , {onload : 'Home'});
            }else{
               navigation.navigate('UserProfile' , {src : ''});
            }
        } else {
          Alert.alert('Error',  'Login failed');
        }
      } catch (err) {
         setLoading(false);
        Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
  
  const isPasswordValid = (text: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/#^()_\-+={}[\]:;"'<>,.\\|~`]).{8,}$/;
    return regex.test(text);
  };
  const isEmailValid = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


const isFormValid =
  email.trim() !== '' &&
  isEmailValid(email);


  const handleSubmit = () => {
    if (!isFormValid) return;
    setError('');
    ValidateUserEmailFirstAPI();
  // registerUserCall();
  };




  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const delayedShowTooltip = () => {
    setTimeout(() => {
      setShowTooltip(true);
    }, 100);
  };

  useFocusEffect(
    React.useCallback(() => {
      setEmail(Temp_KEYS.email);
      setPassword(Temp_KEYS.pass);
      setConfirmPassword(Temp_KEYS.pass);
      setSecure(true);
      setLoading(false); // if applicable
      // clear validation errors if you use any
    }, [])
  );


     const ValidateUserEmailFirstAPI = async () => {
        try {
          setLoading(true);
           const res = await httpRequest2<CheckEmailVerifyResponse>(
            Api_Url.check_emailid,    'post',    {email},    undefined,   true 
          );
  
          if (res.status && res.registration_status) {
              setLoading(false);
              if(res.registration_status.status === 'not_registered'){
                   navigation.navigate('PasswordScreen' , {emailid : email})
              }else{
                  Alert.alert('Error', res.message);
              }
              } else {
                Alert.alert('Error', res.message ?? 'Login failed');
              }
            } catch (err) {
            Alert.alert('Error', 'Unexpected error occurred.');
            } finally {
              setLoading(false);
            }
      };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      scrollEnabled
      extraScrollHeight={100}
    >
      <View className="flex-1 justify-center items-center bg-background py-10">
        <View className="w-full p-6 rounded-2xl">

          {/* Logo */}
          <View className="items-center mb-6">
            <Logo size={80} />
          </View>

          {/* Heading */}
          <Text className="text-20 font-nunitoextrabold text-center text-title mb-1">Sign up with OneCommit</Text>
          <Text className="text-light text-center mb-6 font-nunitoregular text-14">
            One tool. One decision. One future.
            </Text>

          {/* Email */}
          <Text className="text-14 font-nunitosemibold text-title mb-3">Email Address</Text>
<View className={`flex-row items-center rounded-xl px-3 h-14 mb-4 bg-white ${email !== '' && !isEmailValid(email) ? 'border border-red-500' : 'border border-gray-300'}`}>
            <View className="pl-2 pr-3">
              <MaterialIcons name="email" size={24} color="#124D3A" />
            </View>
            <TextInput
              className="ml-2 flex-1 text-black font-nunitosemibold text-base"
              placeholder="Enter your email id"
              value={email}
              style={{ letterSpacing: 1 }}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
 
 
 

      

          {/* Button */}
          <View className="my-2">
            <ArrowButton
              text="Proceed"
              onPress={handleSubmit}
              fullWidth
              disabled={!isFormValid}
            />
          </View>


                      {/* Social Icons */}
                      <View className="items-center justify-center">
                                 <Text className="text-light text-center mb-2 mt-3 font-nunitoregular text-14">
                                    or Continue with
</Text>
                      </View>

                      <View className="flex-row justify-center my-2">
                        <SocialIcons onIconPress={handleSocialClick} />
                      </View>

          {/* Footer */}
          <View className="flex-row justify-center mb-2 mt-4">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text className="text-[#124D3A] font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
              <Loader show={loading} />

    </KeyboardAwareScrollView>
  );


}

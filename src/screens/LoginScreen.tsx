import React, { useState } from 'react';
import { View,  Text,  TextInput,  TouchableOpacity,  Alert,  ScrollView,  KeyboardAvoidingView,  Platform,  Button, Linking
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SocialIcons from '~/components/SocialIcons';
import ArrowButton from '~/components/ArrowButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { handleAppleLogin,  useMicrosoftLogin } from '~/utils/socialAuth';
import { logoutGoogle } from '~/utils/logoutAll';
import { setItem } from '~/utils/storage';
import Logo from '~/components/Logo';
import { Api_Url, base_url, httpRequest, httpRequest2, httpRequest_social_token, LoginRequest, postFormUrlEncoded, RegisterOTPRequest } from '~/services/serviceRequest';
import { LoginResponse, RegisterOTPResponse, SocialTokenResponse } from '~/services/DataModals';
import { PREF_KEYS, Temp_KEYS } from '~/utils/Prefs';
import Loader from '~/components/Loader';
import axios from 'axios';
import { decodeAccessToken, Savedetailsafterlogin } from '~/utils/decodeAccessToken';
import { Applog, Applogerror } from '~/utils/logger';
 import * as Google from 'expo-auth-session/providers/google';
import {  GoogleSignin,  GoogleSigninButton,  isErrorWithCode,  isSuccessResponse,
  SignInResponse,  statusCodes,} from '@react-native-google-signin/google-signin';
 import { State, City } from 'country-state-city';

 
 
 
  WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
  scopes: ['profile', 'email' ],
  offlineAccess: true, 
  forceCodeForRefreshToken: true,
  webClientId: '156935841607-s3q4q01qhosr3bviecpnuratotulsutm.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  iosClientId: '156935841607-6qjtusg96ddbk3u0n87l7irgh1u3mi31.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const isEmailValid = email.trim().length > 0 && /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.trim().length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

const {
  promptAsync: microsoftPrompt,
  response: microsoftResponse,
  handleResponse: handleMicrosoftResponse,
} = useMicrosoftLogin();

const GooglesignOutApp = async () => {
  try {
    await GoogleSignin.signOut();
   } catch (error) {
    console.error(error);
  }
};

//  const GooglesignInApp = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const user = await GoogleSignin.signIn();
//     console.log('Google SignIn success:', user);
//     const accessToken = await GoogleSignin.getTokens();
//     console.log('Access Token:', accessToken);
//       await setItem(PREF_KEYS.login_status, 'success');
//       await setItem(PREF_KEYS.accessToken, accessToken);
//       await setItem(PREF_KEYS.refreshToken, accessToken);
//        await setItem(PREF_KEYS.userEmailID, email);
      

//     // Do something with user
//   } catch (error: unknown) {
//     if (typeof error === 'object' && error !== null && 'code' in error) {
//       const err = error as { code: string; message?: string };
//       switch (err.code) {
//         case statusCodes.SIGN_IN_CANCELLED:
//           console.log('User cancelled the login flow');
//           break;
//         case statusCodes.IN_PROGRESS:
//           console.log('Sign in already in progress');
//           break;
//         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//           console.log('Play services not available or outdated');
//           break;
//         default:
//           console.log('Unhandled error code:', err.code);
//             console.log('Sign-in error full:', JSON.stringify(error, null, 2));

//       }
//     } else {
//       console.log('Unknown error:', error);
//     }
//   }
// };

const GooglesignInApp = async () => {
 // await GoogleSignin.signOut(); // Force clean login

  try {
    await GoogleSignin.hasPlayServices();
const userInfo = await GoogleSignin.signIn() as any;
    const tokens = await GoogleSignin.getTokens(); // Get access & id token

//console.log('FULL userInfo:', JSON.stringify(userInfo, null, 2));

const serverAuthCode = userInfo.data.serverAuthCode ?? userInfo.data.user?.serverAuthCode;
    console.log(serverAuthCode);

    // console.log('Google SignIn success:', userInfo);
    // console.log('Access Token:', tokens.accessToken);
  //  console.log('ID Token:', tokens.idToken);

    // Save details
    await setItem(PREF_KEYS.login_status, 'success');
    await setItem(PREF_KEYS.accessToken, tokens.accessToken);
    await setItem(PREF_KEYS.refreshToken, tokens.idToken);
    await setItem(PREF_KEYS.userEmailID, userInfo.data?.user.email ?? '');
    await  SocialLoginRequestVerifyTokens(serverAuthCode , Api_Url.google_token );

    // await setItem(PREF_KEYS.userName, userInfo.data?.user.givenName ?? '');
    // await setItem(PREF_KEYS.userPhoto, userInfo.data?.user.photo ?? '');
    // navigation.navigate('UserProfile');
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


useEffect(() => {
  (async () => {
    const microsoftData = await handleMicrosoftResponse();

    if (microsoftData?.code) {
      const codeVerifier = microsoftData;
       console.log("microsoftData.codee", microsoftData.code);
      console.log("codeVerifier", request?.codeVerifier);
      console.log('🪟 Microsoft Code:', microsoftData.code);
      setItem('microsoftCode', microsoftData.code);
    await  SocialLoginRequestVerifyTokens(microsoftData.code , Api_Url.microsoft_token );
    }
  })();
}, [microsoftResponse]);



 const [result, setResult] = useState(null);
  const redirectUri = 'OneCommit://redirect';
 const handleLogin = async (loginurls : string) => {
    const res = await WebBrowser.openAuthSessionAsync(loginurls, redirectUri);
        if (res.type === 'success' && 'url' in res && res.url) {
            const url = new URL(res.url);
            const accessToken = url.searchParams.get('accessToken');
            const refreshToken = url.searchParams.get('refreshToken');
            setItem(PREF_KEYS.accessToken, accessToken!);
            setItem(PREF_KEYS.refreshToken, refreshToken!);
            const userData = decodeAccessToken(accessToken!);
          Applog('accessToken:  ',  userData);
            
        } else if ('url' in res && res.url) {
            const url = new URL(res.url);
            const error = url.searchParams.get('error');
            const message = url.searchParams.get('message');

            Applogerror('Error Params:', { error, message });
            Alert.alert('Login Failed', `${res.type}\n${error ?? ''}\n${message ?? ''}`);
        }
        else {
           Alert.alert('Login Cancelled', `Type: ${res.type}`);
        }
  };


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
        // const appleData =  handleAppleLogin();
        // if (appleData) console.log('Apple:', appleData);
      }
  };

 

  const handleSubmit = () => {
     LoginRequestViaAPI();  

      // navigation.navigate('Success', {
      // message: 'OTP verified successfully this is testing msg!',
      // });

  };
 

const LoginRequestViaAPI = async () => {
  try {
    setLoading(true);
    const requestBody : LoginRequest = {  email : email,   password : password   };

    const res = await httpRequest2<LoginResponse>(
      Api_Url.login,    'post',    requestBody,    undefined,   true 
    );

if (res.status && res.data) {
      await setItem(PREF_KEYS.login_status, 'success');
      await setItem(PREF_KEYS.accessToken, res.data.accessToken);
      await setItem(PREF_KEYS.refreshToken, res.data.refreshToken);
       await setItem(PREF_KEYS.userEmailID, email);
                   await Savedetailsafterlogin();

      // console.log('accesss_token ', res.data.accessToken);
      // console.log('refresh_Token ', res.data.refreshToken);
        if(res.redirect == "verify"){
            navigation.navigate('OtpVerification', {
            method: 'email',
            value: '',
            typeis: 'login_verify',
        });
        }else if(res.redirect == "profile"){
          // navigation.navigate('UserProfile');
           navigation.replace('FillProfileInfoScreen');
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
      await setItem(PREF_KEYS.login_status, 'success');
      await setItem(PREF_KEYS.accessToken, res.data?.accessToken);
      if (res.data.refreshToken) {
        await setItem(PREF_KEYS.refreshToken, res.data?.refreshToken);
      }

            await Savedetailsafterlogin();
      
     // console.log('access_token:', res.access_token);
      //console.log('refresh_token:', res.refresh_token);

      // Optional: navigate or fetch user profile
       navigation.navigate('UserProfile');

    } else {
      Alert.alert('Error',  'Login failed');
    }
  } catch (err) {
    Alert.alert('Error', 'Unexpected error occurred.');
    console.log('Social Login Errors:', err);
  } finally {
    setLoading(false);
  }
};


  const handleRegister = () => {
    navigation.navigate('Register');
  };

   const handleForgot = () => {
    navigation.navigate('Forgotpassword');
  };



useFocusEffect(
  React.useCallback(() => {
    setEmail(Temp_KEYS.email);
    setPassword(Temp_KEYS.pass);
    setSecure(true);
    setLoading(false); 
  }, [])
);

 useEffect(() => {
  const handleDeepLink = ({ url }: { url: string }) => {
    console.log('📥 Deep link received:', url);
    // your logic here
  };

  const sub = Linking.addEventListener('url', handleDeepLink);
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url });
  });

  return () => sub.remove();
}, []);

const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '156935841607-s3q4q01qhosr3bviecpnuratotulsutm.apps.googleusercontent.com',
  iosClientId: '156935841607-6qjtusg96ddbk3u0n87l7irgh1u3mi31.apps.googleusercontent.com',
  androidClientId: '156935841607-ru30t91ba7r20pkdgclu1jn6rclqi9fl.apps.googleusercontent.com',
});

useEffect(() => {
  if (response?.type === 'success') {
    const { authentication } = response;
    // Use access token to get user info
  }
}, [response]);
 useEffect(() => {
  const states = State.getStatesOfCountry("US");
  const cities = City.getCitiesOfState("US", "CA"); // CA for California
//console.log('states' , states);
///console.log('cities' , cities);
}, []);

  return (
 <KeyboardAwareScrollView
   className="flex-1 bg-background"
   contentContainerStyle={{ flexGrow: 1 }}
   keyboardShouldPersistTaps="handled"
   enableOnAndroid={true}
   extraScrollHeight={100} // adjust if needed
 >
        <View className="flex-1 justify-center items-center bg-background  py-10">
            {/* <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{ width: 250, height: 44, alignSelf: 'center' }}
          onPress={handleAppleLogin}
        /> */}
        
          <View className="w-full p-6 rounded-2xl">

            {/* Logo */}
            <View className="items-center mb-6">
              <View>
              <Logo size={80} />
            </View>
            </View>

            {/* Heading */}
            <Text className="text-20 font-nunitoextrabold text-center text-title mb-1">Sign In</Text>
            <Text className="text-light text-center mb-6 font-nunitoregular">Login to your OneCommit Account</Text>

            {/* Email Input */}
            <Text className="text-14 font-nunitoextrabold  text-title mb-3">Email Address</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14 mb-4 bg-white">
                <View className="pl-2 pr-3">
                <MaterialIcons name="email" size={24} color="#124D3A" />
                </View>
                <TextInput
                className="ml-2 flex-1 text-black font-nunitosemibold text-base"
                placeholder="example@example.com|"
                value={email}
                style={{ letterSpacing: 1 }} 
                onChangeText={setEmail}
                 autoCapitalize="none"
                keyboardType="email-address"
                />
              </View>

            {/* Password Input */}
            <Text className="text-14 font-nunitoextrabold  text-title mb-3">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14 mb-4 bg-white">
                 <View className="pl-2 pr-3">
                <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
                </View>
              <TextInput
                className="ml-2 flex-1 text-black"
                  placeholder="Enter password"
                  secureTextEntry={secure}
                  value={password}
                  onChangeText={setPassword}
                  textContentType="none"       
                  importantForAutofill="no"   
                  autoCorrect={false}         
                  spellCheck={false}         
                />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <MaterialIcons
                  name={secure ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <View className="my-4">
              <ArrowButton text="Continue" onPress={handleSubmit} fullWidth disabled={!isFormValid} />
            </View>

            {/* Social Icons */}
            <View className="flex-row justify-center my-6">
              <SocialIcons onIconPress={handleSocialClick} />
            </View>

            {/* Footer Links */}
            <View className="flex-row justify-center mb-2">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegister}>
              <Text className="text-[#124D3A] font-semibold">Sign Up</Text>
              </TouchableOpacity>

            </View>
            <TouchableOpacity onPress={handleForgot}>
              <Text className="text-center text-[#124D3A] underline">Forgot your password?</Text>
            </TouchableOpacity>
        <Loader show={loading} />

          </View>
        </View>
        
    </KeyboardAwareScrollView>
  );
}
 

 

 

function setUserInfo(user: SignInResponse) {
  throw new Error('Function not implemented.');
}


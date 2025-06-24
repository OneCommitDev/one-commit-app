import React, { useState } from 'react';
import { View,  Text,  TextInput,  TouchableOpacity,  Alert,  ScrollView,  KeyboardAvoidingView,  Platform,  Button
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SocialIcons from '~/components/SocialIcons';
import ArrowButton from '~/components/ArrowButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { handleAppleLogin, useGoogleLogin, useMicrosoftLogin } from '~/utils/socialAuth';
import { logoutGoogle } from '~/utils/logoutAll';
import { setItem } from '~/utils/storage';
import Logo from '~/components/Logo';

// WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {  promptAsync: googlePrompt,  response: googleResponse,  handleResponse: handleGoogleResponse,} = useGoogleLogin();
const {
  promptAsync: microsoftPrompt,
  response: microsoftResponse,
  handleResponse: handleMicrosoftResponse,
} = useMicrosoftLogin();







    const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  const handleGoogleResponses = async () => {
    if (googleResponse?.type === 'success' && googleResponse.authentication) {
      return {
        id_token: googleResponse.authentication.idToken ?? '',
        access_token: googleResponse.authentication.accessToken ?? '',
      };
    }
    return null;
  };

useEffect(() => {
  (async () => {
    const googleData = await handleGoogleResponses();

    if (googleData?.access_token) {
      const { access_token, id_token } = googleData;

      setItem('googleAccessToken', access_token);
      if (id_token) setItem('googleIdToken', id_token);

      // 🧠 Get profile info
      const userInfo = await fetchGoogleUserInfo(access_token);
      if (userInfo) {
        console.log('Name:', userInfo.name);
        console.log('Email:', userInfo.email);
        console.log('Picture:', userInfo.picture);
      }
    }
  })();
}, [googleResponse]);

const fetchGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userInfo = await response.json();

    console.log('👤 Google User Info:', userInfo);
    return userInfo;
  } catch (error) {
    console.error('❌ Failed to fetch user info:', error);
    return null;
  }
};



useEffect(() => {
  (async () => {
    const microsoftData = await handleMicrosoftResponse();

    if (microsoftData?.code) {
      console.log('🪟 Microsoft Code:', microsoftData.code);

      // You’ll need to exchange this code with Microsoft token endpoint to get user info
      // OPTIONAL: call a backend API here to exchange the code for tokens

      // Save or use the code
      setItem('microsoftCode', microsoftData.code);
    }
  })();
}, [microsoftResponse]);






  const handleSocialClick = (platform: any) => {
   // Alert.alert(`You clicked on ${platform}`);
      if (platform === 'google') {
        googlePrompt({ useProxy: false } as any);
      }
       if (platform === 'microsoft') {
           microsoftPrompt({ useProxy: false } as any); // 👈 triggers Microsoft login
      }
      if (platform === 'apple') {
      const appleData =  handleAppleLogin();
      if (appleData) console.log('Apple:', appleData);
      }
  };

 

  const handleSubmit = () => {
    // navigation.navigate('Home');
            navigation.navigate('MultiStepSurvey');

  };

   const handleRegister = () => {
    navigation.navigate('Register');
  };

   const handleForgot = () => {
    navigation.navigate('Forgotpassword');
  };



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
              <ArrowButton text="Continue" onPress={handleSubmit} fullWidth />
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

          </View>
        </View>
    </KeyboardAwareScrollView>
  );
}

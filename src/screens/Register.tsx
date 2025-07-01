import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Logo from '~/components/Logo';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Api_Url, postFormUrlEncoded, postRequest, RegisterRequest, setAuthToken } from '~/services/serviceRequest';
import Loader from '~/components/Loader';
import { RegisterResponse } from '~/services/DataModals';
import { setItem } from 'expo-secure-store';
import { PREF_KEYS, Temp_KEYS } from '~/utils/Prefs';
import axios from 'axios';
import { Applog } from '~/utils/logger';

export default function RegisterScreen() {
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
  isEmailValid(email) &&
  password.trim() !== '' &&
  confirmPassword.trim() !== '' &&
  isPasswordValid(password) &&
  password === confirmPassword;


  const handleSubmit = () => {
    if (!isFormValid) return;
    setError('');
   registerUserCall();
  };

 const registerUserCall = async () => {
  try {
    setLoading(true);
    const requestBody: RegisterRequest = {
      email: email,
      password: confirmPassword,
    };
      Applog('Sending data:', requestBody);

const getResponse = await postFormUrlEncoded<RegisterResponse>(Api_Url.register, requestBody , undefined);
     setItem(PREF_KEYS.registerEmail , email);

       Applog('Sending email:', email);
      
       if (getResponse.data?.accessToken) {
        setItem(PREF_KEYS.registerEmail , email);
        setAuthToken(getResponse.data.accessToken);
        setItem(PREF_KEYS.accessToken , getResponse.data.accessToken);
        setItem(PREF_KEYS.refreshToken , getResponse.data.refreshToken);  
      }
  

    if (getResponse.status == true) {
      navigation.navigate('OtpVerification', {
                method: 'email',
                value: '',
                typeis: 'register_verify',
              });
    } 
   else if (getResponse.status === false) {
  if (getResponse.redirect === 'verify') {
    Alert.alert(
      'Verification Required',
      getResponse.message,
      [
        {
          text: 'Verify Now',
          onPress: () => {
            navigation.navigate('OtpVerification', {
              method: 'email',
              value: '',
              typeis: 'register_verify',
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  } else {
     Alert.alert(getResponse.message ?? 'Something went wrong.');
  }
}

    
    
    else {
       if (getResponse.data?.accessToken) {
          setItem(PREF_KEYS.accessToken, getResponse.data.accessToken);
          Applog(getResponse.data.accessToken);
        }
       navigation.navigate('OtpVerification', {
          method: 'email',
          value: '',
          typeis: 'register_verify',
        });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
    Alert.alert('Error', error.response.data.message);
  } else {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    Alert.alert('Error', errorMessage);
  }
  } finally {
    setLoading(false);
  }
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
          <Text className="text-20 font-nunitoextrabold text-center text-title mb-1">Create Account</Text>
          <Text className="text-light text-center mb-6 font-nunitoregular text-16">One tool. One decision. One future.</Text>

          {/* Email */}
          <Text className="text-14 font-nunitoextrabold text-title mb-3">Email Address</Text>
<View className={`flex-row items-center rounded-xl px-3 h-14 mb-4 bg-white ${email !== '' && !isEmailValid(email) ? 'border border-red-500' : 'border border-gray-300'}`}>
            <View className="pl-2 pr-3">
              <MaterialIcons name="email" size={24} color="#124D3A" />
            </View>
            <TextInput
              className="ml-2 flex-1 text-black font-nunitosemibold text-base"
              placeholder="example@example.com"
              value={email}
              style={{ letterSpacing: 1 }}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <Text className="text-14 font-nunitoextrabold text-title mb-3">Password</Text>
          <View className={`flex-row items-center rounded-xl px-3 h-14 mb-4 bg-white ${password && !isPasswordValid(password) ? 'border border-red-500' : 'border border-gray-300'}`}>
            <View className="pl-2 pr-3">
              <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
            </View>
            <TextInput
              className="ml-2 flex-1 text-black"
              placeholder="Enter password"
              secureTextEntry={secure}
              textContentType="oneTimeCode"
  autoComplete="off"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)} className="mx-1">
              <MaterialIcons
                name={secure ? 'visibility-off' : 'visibility'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Hint + Tooltip */}
          <View className="flex-row items-center mt-[-10px] ml-2 mb-4">
            <Text className="text-12 text-gray-600">
              Password must be at least 8 characters
            </Text>
            <Tooltip
              isVisible={showTooltip}
              content={
                <View style={{ backgroundColor: '#fff', padding: 12 }}>
                  <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
                    • At least 8 characters{'\n'}
                    • 1 uppercase & lowercase letter{'\n'}
                    • 1 number & 1 special character{'\n'}
                    • Example: Demo@123#
                  </Text>
                </View>
              }
              placement={keyboardVisible ? 'bottom' : 'top'}
              onClose={() => setShowTooltip(false)}
              showChildInTooltip={false}
              backgroundColor="rgba(0,0,0,0.3)"
            >
              <TouchableOpacity onPress={delayedShowTooltip} className="ml-1">
                <MaterialIcons name="help-outline" size={20} color="#4A4A4A" />
              </TouchableOpacity>
            </Tooltip>
          </View>

          {/* Confirm Password */}
          <Text className="text-14 font-nunitoextrabold text-title mb-3">Confirm Password</Text>
<View
  className={`flex-row items-center rounded-xl px-3 h-14 mb-4 bg-white ${
    confirmPassword && (!isPasswordValid(confirmPassword) || confirmPassword !== password)
      ? 'border border-red-500'
      : 'border border-gray-300'
  }`}
>
            <View className="pl-2 pr-3">
              <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
            </View>
            <TextInput
              className="ml-2 flex-1 text-black"
              placeholder="Confirm password"
              autoCapitalize="none"
              secureTextEntry={confirmSecure}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError('');
              }}
              textContentType="oneTimeCode"
  autoComplete="off"
            />
            <TouchableOpacity onPress={() => setConfirmSecure(!confirmSecure)}>
              <MaterialIcons
                name={confirmSecure ? 'visibility-off' : 'visibility'}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {/* Error */}
          {error !== '' && (
            <View className="flex-row items-center border border-red-500 bg-red-50 rounded-3xl px-4 py-3 mt-2 mb-4">
              <MaterialIcons name="warning" size={20} color="#B91C1C" />
              <Text className="text-black text-sm font-bold ml-2">Error: {error}</Text>
            </View>
          )}

          {/* Button */}
          <View className="my-4">
            <ArrowButton
              text="Sign Up"
              onPress={handleSubmit}
              fullWidth
              disabled={!isFormValid}
            />
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mb-2">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-[#124D3A] font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Loader show={loading} />
      </View>
    </KeyboardAwareScrollView>
  );


}

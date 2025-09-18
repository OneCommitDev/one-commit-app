import React, { useEffect, useState } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,  Keyboard,  Alert, SafeAreaView,} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Tooltip from 'react-native-walkthrough-tooltip';
import {  Api_Url,  postFormUrlEncoded,  RegisterRequest,  setAuthToken,} from '~/services/serviceRequest';
import Loader from '~/components/Loader';
import {  RegisterResponse } from '~/services/DataModals';
import { setItem } from 'expo-secure-store';
import { PREF_KEYS, Temp_KEYS } from '~/utils/Prefs';
import axios from 'axios';
import { Applog } from '~/utils/logger';
import TitleText from './TitleText';
import Logo from './Logo';


export default function PasswordScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'PasswordScreen'>>();
  const { emailid } = route.params;   // ✅ this gives you the email from navigation

  const [email, setEmail] = useState(emailid);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [confirmSecure, setConfirmSecure] = useState(true);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isPasswordValid = (text: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/#^()_+={}[\]:;"'<>,.\\|~`-]).{8,}$/;
    return regex.test(text);
  };

  const isFormValid =
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    isPasswordValid(password) &&
    password === confirmPassword;

  const handleSubmit = () => {
    if (!isFormValid) return;
    setError('');
    registerUserCall();
   };

 

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
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
      setEmail(Temp_KEYS.email ?? '');
      setPassword(Temp_KEYS.pass ?? '');
      setConfirmPassword(Temp_KEYS.pass ?? '');
      setSecure(true);
      setLoading(false);
    }, [])
  );

    const registerUserCall = async () => {
      try {
        setLoading(true);
        const requestBody: RegisterRequest = {
          email: emailid,
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
                    value: email,
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


  return (
  


    <View className="flex-1 bg-background px-6 pt-14">
    {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-12 h-12 rounded-3xl bg-[#E3E9E5] items-center justify-center mb-2"
      >
        <Ionicons name="chevron-back" size={24} color="#1A322E" />
      </TouchableOpacity>
     <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      scrollEnabled
      extraScrollHeight={100}
    >

    
      
      <View className="flex-1   bg-background py-1 mt-1">
                  {/* <View className="items-center mb-6">
                    <Logo size={80} />
                  </View> */}
        <View className="w-full p-6 rounded-2xl">
<TitleText size="text-20">{emailid}</TitleText>
            <View className='bg-gray-300 w-full h-[1px] mt-2' />

          {/* Password */}
          <Text className="text-14 font-nunitoextrabold text-title mb-3 mt-5">
            Password
          </Text>
          <View
            className={`flex-row items-center rounded-xl px-3 h-14 mb-4 bg-white ${
              password && !isPasswordValid(password)
                ? 'border border-red-500'
                : 'border border-gray-300'
            }`}
          >
            <View className="pl-2 pr-3">
              <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
            </View>
            <TextInput
              className="ml-2 flex-1 text-black"
              placeholder="Enter password"
              secureTextEntry={secure}
              textContentType="password"
              autoComplete="password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
            />
            <TouchableOpacity
              onPress={() => setSecure(!secure)}
              className="mx-1"
            >
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
                    • At least 8 characters{'\n'}• 1 uppercase & lowercase
                    letter{'\n'}• 1 number & 1 special character{'\n'}•
                    Example: Demo@123#
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
          <Text className="text-14 font-nunitoextrabold text-title mb-3">
            Confirm Password
          </Text>
          <View
            className={`flex-row items-center rounded-xl px-3 h-14 mb-4 bg-white ${
              confirmPassword &&
              (!isPasswordValid(confirmPassword) ||
                confirmPassword !== password)
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
              textContentType="password"
              autoComplete="password-new"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError('');
              }}
            />
            <TouchableOpacity
              onPress={() => setConfirmSecure(!confirmSecure)}
              className="mx-1"
            >
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
              <Text className="text-black text-sm font-bold ml-2">
                Error: {error}
              </Text>
            </View>
          )}

          {/* Button */}
          <View className="my-4">
            <ArrowButton
              text="Create Account"
              onPress={handleSubmit}
              fullWidth
              disabled={!isFormValid}
            />
          </View>
        </View>
      </View>
              <Loader show={loading} />

    </KeyboardAwareScrollView>
</View>

 
  );
}

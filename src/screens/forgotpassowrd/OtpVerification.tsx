import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {  NavigationProp,  RouteProp,  useNavigation,  useRoute,} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ArrowButton from '~/components/ArrowButton';
import OTPInput from '~/components/OTPInput';
import { Api_Url, ForgotOTPVerifyRequest, httpRequest, httpRequest2, postFormUrlEncoded, RegisterOTPRequest, RegisterRequest } from '~/services/serviceRequest';
import { LoginResponse, RegisterOTPResponse, RegisterResponse, SimpleResponse } from '~/services/DataModals';
import { logAllPrefs, PREF_KEYS } from '~/utils/Prefs';
import { removeItem } from '~/utils/storage';
import { getItem, setItem } from 'expo-secure-store';
import Loader from '~/components/Loader';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';

type RootStackParamList = {
  OtpVerification: { method: 'email' | 'mobile'; value: string; typeis: string };
  ResetPasswordScreen: { userid: any };
    Login: undefined;
UserProfile : undefined;
  Success: { message: string; title?: string };

};

type OtpVerificationRouteProp = RouteProp<RootStackParamList, 'OtpVerification'>;
type OtpVerificationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OtpVerification'
>;

export default function OtpVerification() {
  const navigation = useNavigation<OtpVerificationNavigationProp>();
  const route = useRoute<OtpVerificationRouteProp>();
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const { method, value, typeis } = route.params;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length === 6) {
      Keyboard.dismiss();
      
if (typeis === 'register_verify' || typeis === 'login_verify') {
              OTP_Verification();
         }else{
              ForgotPasswordEmailVerification();
         }
    } else {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit code');
    }
  };

  const handleResend = () => {
    setTimer(120);
    setCanResend(false);
      if (typeis === 'register_verify' || typeis === 'login_verify') {
         const requestBody: RegisterOTPRequest = {
              email: value, // 'value' should hold the email string
              code : otp
            };
            ResenedOTPcall(Api_Url.otpResend, requestBody);
      }else{
         const requestBody: ForgotOTPVerifyRequest = {
              email: value, // 'value' should hold the email string
              code : otp
            };
          ResenedOTPcall(Api_Url.resendForgotOTP, requestBody);
      }
      //  Alert.alert(`OTP resent to your ${method}`);

  };

  const formatTimer = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };


/*
 const OTP_Verification = async () => {
  try {
    setLoading(true);
    const email = await getItem(PREF_KEYS.registerEmail);  
    const accessToken = await getItem(PREF_KEYS.accessToken);
    
    const requestBody: RegisterOTPRequest = {
      email: email ?? '',
      code: otp, 
    };

    const getResponse = await postFormUrlEncoded<RegisterOTPResponse>(
      Api_Url.verifyUser,
      requestBody,
      accessToken ?? undefined
    );

    if (getResponse.status) {
      await removeItem(PREF_KEYS.register_redirect);
      await setItem(PREF_KEYS.userVerification, 'success');

       if (typeis === 'login_verify') {
        navigation.navigate('UserProfile');
      } 
     else if (typeis === 'register_verify' || typeis === 'login_verify') {
        navigation.navigate('Success', {
          message: 'User Verified Successfully!',
        });
      } else {
        navigation.navigate('ResetPasswordScreen', { userid: '' });
      }
    } else {
      Alert.alert('Error', getResponse.message || 'Verification failed.');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    Alert.alert('Error', errorMessage);
  } finally {
    setLoading(false);
  }
};
*/


  const OTP_Verification = async () => {
    try {
      setLoading(true);
    const email = await getItem(PREF_KEYS.registerEmail);  
      const accessToken = await getItem(PREF_KEYS.accessToken);
        const requestBody: RegisterOTPRequest = {
        email: email ?? value,
        code: otp, 
      };
      console.log(requestBody);
      console.log('email_', email);
      console.log('value_', value);

      const res = await httpRequest2<RegisterOTPResponse>(
        Api_Url.verifyUser,    'post',    requestBody,    accessToken ?? '' 
      );
       console.log(res);
  if (res.status) {
      setLoading(false);
        await removeItem(PREF_KEYS.register_redirect);
        await setItem(PREF_KEYS.userVerification, 'success');
          if (typeis === 'login_verify') {
          navigation.navigate('UserProfile');
        } 
      else if (typeis === 'register_verify' || typeis === 'login_verify') {
          navigation.navigate('Success', {
            message: 'User Verified Successfully!',
          });
        } else {
          navigation.navigate('ResetPasswordScreen', { userid: '' });
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
 
const ForgotPasswordEmailVerification = async () => {
  try {
    setLoading(true);
 const requestBody: ForgotOTPVerifyRequest = {
      email: value, // 'value' should hold the email string
      code : otp
    };

    const res = await httpRequest<SimpleResponse>(
      Api_Url.forgotPassverifyUser,    'post',    requestBody,    undefined,   true 
    );

    if (res.status) {
      setItem(PREF_KEYS.forgot_email, value);
       setItem(PREF_KEYS.forgot_otp, otp);
     navigation.navigate('ResetPasswordScreen', {
        userid: '',
      });
    } else {
      Alert.alert('Error', res.message ?? 'Request failed');
    }
  } catch (err) {
    Alert.alert('Error', 'Unexpected error occurred.');
  } finally {
    setLoading(false);
  }
};

const ResenedOTPcall = async (resendurl: string, requestBody: any) => {
  try {
    setLoading(true);
    const res = await httpRequest2<SimpleResponse>(
      resendurl,    'post',    requestBody,    undefined,   true // for form-url-encoded
    );

    if (res.status ) {
  
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
    <View className="flex-1 bg-background px-8 pt-14">
      {/* Back Button or empty view */}
    {!['register_verify', 'login_verify'].includes(typeis) ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-16 h-16 rounded-3xl bg-[#E3E9E5] items-center justify-center mb-6"
        >
          <Ionicons name="chevron-back" size={24} color="#1A322E" />
        </TouchableOpacity>
      ) : (
        <View className="w-16 h-16 mb-6" />
      )}

      {/* Header */}
      <View className="items-center">
        <TitleText className="text-center" size='text-20'>
          Enter Verification Code
        </TitleText>
        <AppText className=" text-center px-2">
          We've sent a 6-digit code to your{' '}
          <AppText>
            {method === 'email' ? 'email address' : 'mobile number'}
          </AppText>
        </AppText>
      </View>

      {/* OTP Boxes */}
      <View className="my-8">
        <OTPInput value={otp} setValue={setOtp} />
      </View>

      {/* Timer or Resend */}
      <View className="items-center mb-10">
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <TitleText>Resend Code</TitleText>
          </TouchableOpacity>
        ) : (
          <AppText>Resend in {formatTimer()}</AppText>
        )}
      </View>

      {/* Submit */}
      <ArrowButton
        text="Verify"
        fullWidth
        onPress={handleVerify}
        disabled={otp.length !== 6}
      />
              <Loader show={loading} />
      
    </View>
  );
}
 


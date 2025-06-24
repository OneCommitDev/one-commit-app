import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import ArrowButton from '~/components/ArrowButton';
import OTPInput from '~/components/OTPInput';

type RootStackParamList = {
  OtpVerification: { method: 'email' | 'mobile'; value: string , typeis : string};
    ResetPasswordScreen: { userid : any};
};

type OtpVerificationRouteProp = RouteProp<RootStackParamList, 'OtpVerification'>;

export default function OtpVerification() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
   const route = useRoute<OtpVerificationRouteProp>();

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const { method, value } = route.params;

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
       navigation.navigate('ResetPasswordScreen', {
      userid: '123'
    });
    } else {
      Alert.alert('Invalid OTP', 'Please enter a 5-digit code');
    }
  };

  const handleResend = () => {
    Alert.alert(`OTP resent to your ${method}`);
    setTimer(120);
    setCanResend(false);
    // Resend OTP API call
  };

  const formatTimer = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View className="flex-1 bg-background px-8 pt-14">
      {/* Back Button */}
       <TouchableOpacity
             onPress={() => navigation.goBack()}
             className="w-16 h-16 rounded-3xl bg-[#E3E9E5] items-center justify-center mb-6"
           >
             <Ionicons name="chevron-back" size={24} color="#1A322E" />
           </TouchableOpacity>

      {/* Header */}
      <View className="items-center mb-4">
        <Text className="text-black text-20 font-nunitoextrabold text-center mb-1">
          Enter Verification Code
        </Text>
        <Text className="text-light text-16 font-nunitoregular text-center px-2">
          We've sent a 5-digit code to your{' '}
          <Text className="font-nunitoextrabold">{method === 'email' ? 'email address' : 'mobile number'}</Text>
        </Text>
      </View>

      {/* OTP Boxes */}
      <View className="my-8">
        <OTPInput value={otp} setValue={setOtp} />
      </View>

      {/* Timer or Resend */}
      <View className="items-center mb-10">
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text className="text-green-700 font-nunitosemibold">Resend Code</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-gray-500 font-nunitoregular">Resend in {formatTimer()}</Text>
        )}
      </View>

      {/* Submit */}
      <ArrowButton
        text="Verify"
        fullWidth
        onPress={handleVerify}
        disabled={otp.length !== 6} 
      />
    </View>
  );
}

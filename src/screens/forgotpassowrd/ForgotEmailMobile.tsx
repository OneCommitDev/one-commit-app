import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import ArrowButton from '~/components/ArrowButton';
import { Api_Url, httpRequest } from '~/services/serviceRequest';
import { LoginResponse, SimpleResponse } from '~/services/DataModals';
import { setItem } from 'expo-secure-store';
import { PREF_KEYS, Temp_KEYS } from '~/utils/Prefs';
import Loader from '~/components/Loader';

type RootStackParamList = {
  // MobileEmailVerification: { method: 'email' | 'mobile' , value : string , maskedValue : string };
    OtpVerification: { method: 'email' | 'mobile' , value : string , typeis : string };

};


export default function ForgotEmailMobile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OtpVerification'>>();
  const selectedMethod = route.params.method;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
      if (!isFormValid) {
    Alert.alert('Please enter a valid ' + (selectedMethod === 'email' ? 'email address' : 'mobile number'));
    return;
  }
    ForgotPasswordRequest();
    /*
  if (email.trim().length > 0 && selectedMethod) {
    // const maskedValue =
    //   selectedMethod === 'email' ? '98******23' : 'par****@g****.com';

    // navigation.navigate('OtpVerification', {
    //   method: selectedMethod,
    //   value: email.trim(),
    //   typeis: maskedValue,
    // });
    ForgotPasswordRequest();
  } else {
    Alert.alert('Please enter a valid value');
  }
    */
};

// MobileEmailVerification
const ForgotPasswordRequest = async () => {
  try {
    setLoading(true);
    const requestBody = {
      email,
    };
    console.log(requestBody);

    const res = await httpRequest<SimpleResponse>(
      Api_Url.forgotpassword,    'post',    requestBody,    undefined,   true 
    );

    if (res.status) {
       navigation.navigate('OtpVerification', {
            method: selectedMethod,
            value: email.trim(),
            typeis: 'forgot_verify',
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

const isFormValid =
  selectedMethod === 'email'
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) // simple email regex
    : /^\d{10}$/.test(email); // assuming mobile number is 10 digits

useFocusEffect(
  React.useCallback(() => {
    setEmail(Temp_KEYS.email);
    setLoading(false); // if applicable
    // clear validation errors if you use any
  }, [])
);

  return (
    <View className="flex-1 bg-background px-6 pt-14">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-16 h-16 rounded-3xl bg-[#E3E9E5] items-center justify-center mb-6"
      >
        <Ionicons name="chevron-back" size={24} color="#1A322E" />
      </TouchableOpacity>

      {/* Centered Title and Subtitle */}
      <View className="items-center mb-8">
      <View className="items-center mb-4">
  <Text className="text-black text-20 font-nunitoextrabold text-center">
    {selectedMethod === 'email'
      ? 'Recover Password via Email'
      : selectedMethod === 'mobile'
      ? 'Recover Password via Mobile Number'
      : 'Forgot Password'}
  </Text>
</View>

            <Text className="text-light text-16 font-nunitoregular text-center">
            {selectedMethod === 'email'
            ? 'Provide your registered email ID to receive a password reset link.'
            : selectedMethod === 'mobile'
            ? 'Enter your mobile number to receive a password reset code.'
            : 'Select which method you’d like to use to reset your password.'}
            </Text>

      </View>
    {/* Email Input */}
         {selectedMethod && (
  <>
    <Text className="text-14 font-nunitoextrabold text-title mb-3">
      {selectedMethod === 'email' ? 'Email Address' : 'Mobile Number'}
    </Text>

    <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14 mb-4 bg-white">
      <View className="pl-2 pr-3">
        <MaterialIcons
          name={selectedMethod === 'email' ? 'email' : 'phone-android'}
          size={24}
          color="#124D3A"
        />
      </View>

      <TextInput
        className="ml-2 flex-1 text-black font-nunitosemibold text-base"
        placeholder={
          selectedMethod === 'email' ? 'example@example.com' : 'Enter mobile number'
        }
        value={email}
        style={{ letterSpacing: 1 }}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType={selectedMethod === 'email' ? 'email-address' : 'phone-pad'}
      />
    </View>
  </>
)}


               {/* Submit Button */}
                <View className="my-4">
                <ArrowButton text="Continue" onPress={handleSubmit} fullWidth disabled={!isFormValid} />
                </View>
                 <Loader show={loading} />
   
    </View>
  );
}
 


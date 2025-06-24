import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import ArrowButton from '~/components/ArrowButton';

type RootStackParamList = {
  // MobileEmailVerification: { method: 'email' | 'mobile' , value : string , maskedValue : string };
    OtpVerification: { method: 'email' | 'mobile' , value : string , typeis : string };

};


export default function ForgotEmailMobile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OtpVerification'>>();
  const selectedMethod = route.params.method;
  const [email, setEmail] = useState('');

    const handleSubmit = () => {
  if (email.trim().length > 0 && selectedMethod) {
    const maskedValue =
      selectedMethod === 'email' ? '98******23' : 'par****@g****.com';

    navigation.navigate('OtpVerification', {
      method: selectedMethod,
      value: email.trim(),
      typeis: maskedValue,
    });
  } else {
    Alert.alert('Please enter a valid value');
  }
};

// MobileEmailVerification



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
        keyboardType={selectedMethod === 'email' ? 'email-address' : 'phone-pad'}
      />
    </View>
  </>
)}


               {/* Submit Button */}
                <View className="my-4">
                <ArrowButton text="Continue" onPress={handleSubmit} fullWidth />
                </View>
   
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import ArrowButton from '~/components/ArrowButton';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';

type RootStackParamList = {
  ForgotPassword: undefined;
  ForgotEmailMobile: { method: 'email' | 'mobile' }; // if passing selected method
};

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'mobile' | null>(null);

const handleSubmit = () => {
  if (selectedMethod) {
    navigation.navigate('ForgotEmailMobile', { method: selectedMethod });
  }
};


  const methods = [
    {
      id: 'email',
      title: 'Email Address',
      subtitle: 'Send via email address securely.',
      icon: 'email',
    },
    {
      id: 'mobile',
      title: 'Mobile Number',
      subtitle: 'Send via mobile number securely.',
      icon: 'phone-android',
    },
  ];

  return (
    
   <View
      className={`flex-1 bg-background px-6 ${
        Platform.OS === "ios" ? "pt-14" : "pt-5"
      }`}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-12 h-12 rounded-3xl bg-[#E3E9E5] items-center justify-center mb-6"
      >
        <Ionicons name="chevron-back" size={24} color="#1A322E" />
      </TouchableOpacity>
    <ScrollView 
             contentContainerStyle={{ flexGrow: 1,  paddingHorizontal: 4 }}
             showsVerticalScrollIndicator={false}
             >
      {/* Centered Title and Subtitle */}
      <View className="items-center mb-8 -mt-3">
        <TitleText  size='text-20'>Forgot Password</TitleText>
        <AppText className="text-center -mt-2">
          Select which method you’d like to reset.
        </AppText>
      </View>

      {/* Method Options */}
      {methods.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            onPress={() => setSelectedMethod(method.id as 'email' | 'mobile')}
            className={`flex-row items-center px-4 py-5 rounded-full mb-4 bg-white ${
              isSelected ? 'border-2 border-green-600' : 'border border-transparent'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 6, // for Android
            }}
          >
            <View className="w-20 h-20 bg-[#E3E9E5] rounded-full items-center justify-center mr-4">
              <MaterialIcons name={method.icon as any} size={24} color="#124D3A" />
            </View>
            <View>
              <TitleText className="mb-1">{method.title}</TitleText>
              <AppText>{method.subtitle}</AppText>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Continue Button */}
      <View className="mt-6">
        <ArrowButton
          text="Continue"
          fullWidth
          onPress={handleSubmit}
          disabled={selectedMethod === null}
        />
      </View>
      </ScrollView>
    </View>
   );
}

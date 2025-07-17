// screens/FillProfileInfoScreen.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import ArrowButton from '~/components/ArrowButton';
import { Ionicons } from '@expo/vector-icons';
import { setItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';

export default function FillProfileInfoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGetStarted = () => {
    setItem(PREF_KEYS.hasSeenProfileIntro , "1");
     navigation.navigate('UserProfile');
};


  return (
    <View className="flex-1 justify-center items-center px-6 bg-background">
      {/* <Image
        source={require('~/assets/profile-info.png')} // optional image
        style={{ width: 200, height: 200, marginBottom: 24 }}
        resizeMode="contain"
      /> */}
        <Ionicons
        name="person-circle-outline"
        size={150}
        color="#6B7280"
        style={{ marginBottom: 10 }}
        />


      <TitleText className="text-20 text-center mb-0 ">Complete Your Profile</TitleText>
      <AppText className=" text-center mb-8">
        To continue, please fill in your profile details. This helps us personalize your experience.
      </AppText>

      <ArrowButton
        text="Get Started"
        onPress={handleGetStarted}
        fullWidth
      />
      
    </View>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import ArrowButton from '~/components/ArrowButton';
import LottieView from 'lottie-react-native';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';

type RootStackParamList = {
  Dashboard: undefined;
  SuccessProfileScreen: undefined;
};

type SuccessProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SuccessProfileScreen'
>;

const SuccessProfileScreen = () => {
  const navigation = useNavigation<SuccessProfileScreenNavigationProp>();

  return (
    <View className="flex-1 bg-background items-center justify-center px-5 ml-5 mr-5">
      {/* <Ionicons
        name="checkmark-circle"
        size={100}
        color="#4BB543"
        style={{ marginBottom: 20 }}
      /> */}
         <LottieView
              source={require('../../assets/animations/check_success.json')}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }} 
            />

      <TitleText className="mb-2 text-center" size='text-24'>
        Profile Saved Successfully!
      </TitleText>

      <AppText className="text-center mb-5">
        Your profile has been successfully updated. You’re all set to continue!
      </AppText>

   <View className='w-full'>
      {/* <ArrowButton text={'Continue'}  
      onPress={() => navigation.replace('Dashboard')}
      fullWidth ></ArrowButton> */}
      <ArrowButton
  text="Continue"
  onPress={() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      })
    );
  }}
  fullWidth
/>
   </View>
    </View>
  );
};

export default SuccessProfileScreen;

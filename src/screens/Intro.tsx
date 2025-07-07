import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types'; // update the path based on your structure
import Loader from '~/components/Loader';
import { getRequest, postRequest, setAuthToken } from '../services/serviceRequest';
import ArrowButton from '~/components/ArrowButton';
import Logo from '~/components/Logo';

const IntroScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleSubmit = () => {
        navigation.navigate('Register');
     };

     const handleSubmit_demo = () => {
                navigation.navigate('Login');

     };

     

 
 

  const fetchUsers = async () => {
    try {
      const users = await getRequest('/users');
      console.log(users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const login = async () => {
    const data = await postRequest('/login', { username: 'admin', password: '1234' });
    setAuthToken(data.token);
  };

  return (
    <View className="flex-1 bg-background justify-center items-center px-6 space-y-6">


      <View className="items-center mb-6">
      <View>
        <Logo size={80} />
      </View>
      </View>

      <Text className="text-introWelcomtitle font-nunitoextrabold text-introTtilecolor text-center mt-10">
        Welcome to OneCommit
      </Text>
      <Text className="text-16 text-center text-introContentcolor font-nunitoregular mt-4">
        Track your recruiting journey, connect with coaches, and find your perfect college match.
      </Text>

      {/* ✅ Fix: Typed navigation */}
      {/* <TouchableOpacity
        className="bg-black px-6 py-3 rounded-full mt-4"
        onPress={() => navigation.navigate('Login')}
      >
        
        <Text className="text-white text-base font-semibold">Get Started →</Text>
      </TouchableOpacity> */}
      <View className=" mt-50">
      <ArrowButton text="Get Started"  width={180}  height={56} onPress={handleSubmit} />
      </View>



      <Text className="text-gray-500 mt-50 font-nunitosemibold text-base">
        Already have an account?{' '}
        <Text className="text-black font-semibold underline" onPress={handleSubmit_demo}>Sign In</Text>
      </Text>

      {/* <Button title="Start Loading" onPress={simulateApiCall} />
      <Loader show={loading} /> */}
    </View>
  );
};

export default IntroScreen;

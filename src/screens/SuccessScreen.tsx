import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ArrowButton from '~/components/ArrowButton';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';

type SuccessScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Success'>;
type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'Success'>;



export default function SuccessScreen() {
  const navigation = useNavigation<SuccessScreenNavProp>();
  const route = useRoute<SuccessScreenRouteProp>();
  const { message, title = 'Success!' } = route.params;

  const handleContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-5">
      <Animated.View
        entering={FadeInUp}
        className=" w-full max-w-md rounded-2xl items-center p-8"
        style={{ elevation: 6 }}
      >
        <Ionicons name="checkmark-circle-outline" size={80} color="#4CAF50" />

        <Text className="text-3xl font-bold text-[#124D3A] mt-6">
          {title}
        </Text>

        <Text className="text-base text-center text-gray-600 mt-4 mb-6">
          {message}
        </Text>

        <ArrowButton onPress={handleContinue} text="Back To Home" fullWidth />
      </Animated.View>
    </View>
  );
}

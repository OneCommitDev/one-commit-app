import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';

import ArrowButton from '~/components/ArrowButton';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
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
<SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
      {/* Lottie Animation */}
      <LottieView
        source={require('../../assets/animations/check_success.json')}
        autoPlay
        loop={false}
        style={{ width: 150, height: 150 }}
      />

      {/* Title */}
      <TitleText size="text-24" >
        {title}
      </TitleText>

      {/* Message */}
      <AppText className="text-center -mt-3 mb-8">
        {message}
      </AppText>

      {/* Button */}
      <View className="w-full px-5">
        <ArrowButton onPress={handleContinue} text="Back To Login" fullWidth />
      </View>
    </SafeAreaView>
  );
}



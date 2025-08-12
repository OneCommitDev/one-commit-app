// DeleteAccountSuccess.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import AppText from '~/components/AppText';
import TitleText from '~/components/TitleText';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { clearAllPrefs, PREF_KEYS } from '~/utils/Prefs';
import Loader from '~/components/Loader';

export type RootStackParamList = {
    Splash : undefined;
  Login: undefined;
  Home: undefined;
  DeleteAccountSuccess: undefined;
};
type DeleteAccountSuccessNavProp = NativeStackNavigationProp<RootStackParamList, 'DeleteAccountSuccess'>;


export default function DeleteAccountSuccess() {
  const navigation = useNavigation<DeleteAccountSuccessNavProp>();
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
     clearAllPrefs();
    navigation.replace('Splash');  
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      <LottieView
        source={require('assets/animations/dele_success.json')}
        autoPlay
        loop={false}
        style={{ width: 150, height: 150 }}
      />

      <TitleText size="text-24" className="mt-6">
        Account Deleted
      </TitleText>

      <AppText className="text-center text-gray-600 mt-3 mb-8">
Your account has been successfully deleted. We’ve sent you a confirmation email. If you have any questions or need help, our support team is here for you.      </AppText>

      <TouchableOpacity
        onPress={handleContinue}
        className="bg-primary px-6 py-3 rounded-lg w-[50%] items-center"
      >
        <AppText className="text-white" size='text-16'>
          Proceed
        </AppText>
      </TouchableOpacity>
                  <Loader show={loading} />
      
    </View>
  );
}

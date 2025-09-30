import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, Image, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import Logo from '~/components/Logo';
import { getItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import { clearKeychainOnFirstRun, removeItem } from '~/utils/storage';

export default function Splashscreen() {
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
/*
 useEffect(() => {
  const checkAndNavigate = async () => {
    const token = await getItem(PREF_KEYS.accessToken);
    const register_redirect = await getItem(PREF_KEYS.register_redirect);
    const login_status = await getItem(PREF_KEYS.login_status);
    const profileCompleted = await getItem(PREF_KEYS.profileCompleted);
     setTimeout(() => {
       if ( profileCompleted === 'success') {
        navigation.replace('Dashboard' , {onload : 'Home'});
      }
     else  if (login_status === 'success' ) {
              navigation.replace('UserProfile' , {src : ''});
      }    
      else {
        navigation.replace('Intro');
      }
    }, 3000);
  };

  checkAndNavigate();
}, []);
*/
useEffect(() => {
  const init = async () => {
    // ✅ Wait for clearing keychain to finish
    await clearKeychainOnFirstRun();

    // Now check navigation
    const token = await getItem(PREF_KEYS.accessToken);
    const register_redirect = await getItem(PREF_KEYS.register_redirect);
    const login_status = await getItem(PREF_KEYS.login_status);
    const profileCompleted = await getItem(PREF_KEYS.profileCompleted);

    setTimeout(() => {
      if (profileCompleted === 'success') {
        navigation.replace('Dashboard', { onload: 'Home' });
      } else if (login_status === 'success') {
        navigation.replace('UserProfile', { src: '' });
      } else {
        navigation.replace('Intro');
      }
    }, 3000);
  };

  init(); // ✅ call the init function once
}, []);


  return (
    <View className="flex-1 bg-primary justify-between py-10">
           <StatusBar backgroundColor="#235D48" barStyle="light-content" />

      <View className="flex-1 justify-center items-center">
             <View className="items-center mb-6">
        <View className="mt-img-lg">
          <Logo size={110} />
        </View>
        </View>
      </View>

      <View className="items-center mb-30">
        <Text className="text-white text-splashtitle font-nunitoextrabold mb-4">OneCommit</Text>
        <Text className="text-white text-splashSubTitle font-nunitoregular text-center">
          One tool, One decision, One future
        </Text>
      </View>
    </View>
  );
}

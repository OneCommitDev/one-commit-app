// storage.ts (new)
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREF_KEYS } from '~/utils/Prefs';
import { resetToLogin } from '~/navigation/NavigationService';


export const setItem = async (key: string, value: string | number | boolean | object) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  await SecureStore.setItemAsync(key, stringValue);
}; 


export const getItem = async (key: string): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};
export const removeItem = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

 // utils/clearKeychain.ts

 
 const FIRST_RUN_FLAG = 'first_run_done'; // stored in AsyncStorage
export const clearAllPrefss = async () => {
  const fcmToken = await getItem(PREF_KEYS.fcmToken);

  const keys = Object.values(PREF_KEYS);
  for (const key of keys) {
    await removeItem(key);  
  }

  // if (fcmToken) {
  //   await setItem(PREF_KEYS.fcmToken, fcmToken);
  // }
};
/*
export async function clearKeychainOnFirstRun() {
  try {
    const firstRun = await AsyncStorage.getItem(FIRST_RUN_FLAG);

    if (!firstRun) {
     console.log('🆕 Fresh install detected → clearing SecureStore');
       await clearAllPrefss();
       resetToLogin();

      await AsyncStorage.setItem(FIRST_RUN_FLAG, 'true');
    }
  } catch (error) {
     await clearAllPrefss();
       resetToLogin();
    console.error('❌ Error in clearKeychainOnFirstRun:', error);
  }
}
  */
 export async function clearKeychainOnFirstRun() {
  try {
    const firstRun = await AsyncStorage.getItem(FIRST_RUN_FLAG);

    if (!firstRun) {
      console.log('🆕 Fresh install detected → clearing SecureStore');

      try {
       // resetToLogin();
        await clearAllPrefss();
      } catch (err) {
        console.error('❌ Failed to clear preferences:', err);
      }

     // resetToLogin();

      try {
        await AsyncStorage.setItem(FIRST_RUN_FLAG, 'true');
      } catch (err) {
        console.error('❌ Failed to set FIRST_RUN_FLAG:', err);
      }
    }
  } catch (error) {
    console.error('❌ Error in clearKeychainOnFirstRun:', error);

    try {
      await clearAllPrefss();
    } catch (err) {
      console.error('❌ Failed to clear preferences in catch block:', err);
    }

    resetToLogin();
  }
}

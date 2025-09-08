// storage.ts (new)
import * as SecureStore from 'expo-secure-store';
import { clearAllPrefs } from './Prefs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREF_KEYS } from '~/utils/Prefs';


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
    await removeItem(key); // should be SecureStore.removeItemAsync under the hood
  }

  if (fcmToken) {
    await setItem(PREF_KEYS.fcmToken, fcmToken);
  }
};
export async function clearKeychainOnFirstRun() {
  try {
    const firstRun = await AsyncStorage.getItem(FIRST_RUN_FLAG);

    if (!firstRun) {
      console.log('🆕 Fresh install detected → clearing SecureStore');
       await clearAllPrefss();

      await AsyncStorage.setItem(FIRST_RUN_FLAG, 'true');
    }
  } catch (error) {
    console.error('❌ Error in clearKeychainOnFirstRun:', error);
  }
}
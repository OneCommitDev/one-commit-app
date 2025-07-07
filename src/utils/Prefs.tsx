import * as SecureStore from 'expo-secure-store';
import { removeItem } from './storage';
import { Alert } from 'react-native';

export const PREF_KEYS = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
    registerEmail: 'REGISTER_EMAIL',
    userId: 'USER_ID',
    register_redirect : 'register_redirect',
    login_status : 'login_status',     // success
    userVerification : 'user_Verification',
    forgot_email : 'FORGOT_EMAIL',
    forgot_otp : 'FORGOT_OTP',
    userEmailID : 'USER_EMIAL_ID',
    hasSeenProfileIntro : 'hasSeenProfileIntro',
}as const;

export const logAllPrefs = async () => {
  const keys = Object.values(PREF_KEYS);

  for (const key of keys) {
    const value = await SecureStore.getItemAsync(key);
    console.log(`${key}:`, value);
  }
};

// below func are for development purpose only

export const clearAllPrefs = async () => {
  const keys = Object.values(PREF_KEYS); 
  for (const key of keys) {
    await removeItem(key);
  }
  Alert.alert("All PREF_KEYS cleared"); 
};


export const Temp_KEYS = {  
  pass: 'Dnd@12345',
  email: 'Pardeep.Kumar@agilite.tech',
  newpass : 'Dnd@123456',
}as const;
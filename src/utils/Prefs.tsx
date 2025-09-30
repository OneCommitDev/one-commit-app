import * as SecureStore from 'expo-secure-store';
// import { getItem, removeItem, setItem } from './storage';
import { Alert } from 'react-native';

export const PREF_KEYS = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
    registerEmail: 'REGISTER_EMAIL',
    userId: 'USER_ID',
    register_redirect : 'register_redirect',
    login_status : 'login_status',     // success
    profileCompleted : 'profileCompleted',     // success

    userVerification : 'user_Verification',
    forgot_email : 'FORGOT_EMAIL',
    forgot_otp : 'FORGOT_OTP',
    userEmailID : 'USER_EMIAL_ID',
    hasSeenProfileIntro : 'hasSeenProfileIntro',
    displayName : 'displayName',
    fcmToken : 'fcm_token',
    connected_id : 'connected_email_id',
    connected_id_provider : 'connected_email_id_provider',
    apple_display_name : 'apple_display_name',

}as const;

export const logAllPrefs = async () => {
  const keys = Object.values(PREF_KEYS);
  for (const key of keys) {
    const value = await SecureStore.getItemAsync(key);
   // console.log(`${key}:`, value);
  }
};

// below func are for development purpose only
/*
export const clearAllPrefs = async () => {
  const fcmToken = getItem(PREF_KEYS.fcmToken);
  const keys = Object.values(PREF_KEYS); 
  for (const key of keys) {
    await removeItem(key);
  }

   if (fcmToken) {
    await setItem(PREF_KEYS.fcmToken, fcmToken);
  }
  // Alert.alert("All PREF_KEYS cleared"); 
};
*/

export const MessagesText ={
  School_Size_MSG :     '• Small: 100 – 20,000 students\n• Medium: 20,001 – 40,000 students\n• Large: 40,001 – 60,000+ students',
  Academic_Rigor_MSG : '',

}

 

// export const Temp_KEYS = {  
//   pass: 'Test@234',
//   email: 'onecommitapp@gmail.com',
//   newpass : 'Test@234',
// }as const;
export const Temp_KEYS = {  
  pass: '',
  email: '',
  newpass : '',
}as const;
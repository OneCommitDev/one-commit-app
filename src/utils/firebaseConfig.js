// src/firebase/firebaseConfig.js
import { initializeApp } from '@react-native-firebase/app';

// Optional if using Analytics or other services
// import analytics from '@react-native-firebase/analytics';

import Constants from 'expo-constants';
const { fcm_apiKey, fcm_authDomain , fcm_projectId , fcm_storageBucket, fcm_messagingSenderId , fcm_appId , fcm_measurementId} = Constants.expoConfig?.extra ?? {};


export const firebaseConfig = {

  // apiKey: "AIzaSyDvPcP77wTfw2DjaiLcz9lra7HP7rGsqVI",
  // authDomain: "onecommit.firebaseapp.com",
  // projectId: "onecommit",
  // storageBucket: "onecommit.firebasestorage.app",
  // messagingSenderId: "429115153068",
  // appId: "1:429115153068:web:bf3ddb7b230dce9844dd09",
  // measurementId: "G-6PFWFC5JHC"
    apiKey: fcm_apiKey,
  authDomain: fcm_authDomain,
  projectId: fcm_projectId,
  storageBucket: fcm_storageBucket,
  messagingSenderId: fcm_messagingSenderId,
  appId: fcm_appId,
  measurementId: fcm_measurementId
};

// Only initialize if no app is initialized
export function initFirebase() {
  if (getApps().length === 0) {
    initializeApp(firebaseConfig);
  } else {
  }
}

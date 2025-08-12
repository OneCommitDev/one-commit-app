// src/firebase/firebaseConfig.js
import { initializeApp } from '@react-native-firebase/app';

// Optional if using Analytics or other services
// import analytics from '@react-native-firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyDvPcP77wTfw2DjaiLcz9lra7HP7rGsqVI",
  authDomain: "onecommit.firebaseapp.com",
  projectId: "onecommit",
  storageBucket: "onecommit.firebasestorage.app",
  messagingSenderId: "429115153068",
  appId: "1:429115153068:web:bf3ddb7b230dce9844dd09",
  measurementId: "G-6PFWFC5JHC"
};

// Only initialize if no app is initialized
export function initFirebase() {
  if (getApps().length === 0) {
    console.log('✅ Initializing Firebase');
    initializeApp(firebaseConfig);
  } else {
    console.log('✅ Firebase already initialized');
  }
}

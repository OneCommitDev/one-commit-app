import './global.css';
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { Alert, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging, { AuthorizationStatus, firebase, getMessaging, getToken, onMessage, requestPermission } from '@react-native-firebase/messaging';
import { getFCMToken } from '~/utils/AppFunctions';
import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { firebaseConfig } from './src/utils/firebaseConfig';
import { setItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';
import { PermissionsAndroid, Platform } from 'react-native';
import { useNavigationContainerRef } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native'; // assuming you're using it
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
const navigationRef = createNavigationContainerRef<RootStackParamList>();


export async function requestAndroidNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('✅ Notification permission granted');
      return true;
    } else {
      console.log('🚫 Notification permission denied');
      return false;
    }
  }
  return true; // On Android < 13 or iOS
}

 
export async function askNotificationPermissionWithPrompt() {
  try {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Notification permission granted:', authStatus);
    } else {
      console.warn('🚫 Notification permission denied');
    }
  } catch (error) {
    console.error('❌ Failed to request notification permission:', error);
  }
}


export function initFirebase() {
  try {
    if (getApps().length === 0) {
      // firebase.initializeApp(firebaseConfig);
      initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized');
    }
  } catch (e) {
    console.log('🔥 Firebase init error:', e);
  }
}


// ✅ Register background handler at the top level
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📬 Background message received:', remoteMessage);
  // You can trigger local notifications or handle data here
});

 async function setupNotifications() {

   useEffect(() => {
  const setup = async () => {
    await requestAndroidNotificationPermission(); //  this for android
    await askNotificationPermissionWithPrompt();  //   this for ios
  };
  setup();
}, []);

  const app = getApp();
  const messaging = getMessaging(app);

  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('🔐 Notification permission granted');
    const token = await getToken(messaging);
    console.log('📱 FCM Token app.tsx:', token);
    setItem(PREF_KEYS.fcmToken, token);
  } else {
    Alert.alert('Permission Denied', 'Notifications will not be shown');
  }
}

function handleNotificationNavigation(remoteMessage : any) {
  if (!remoteMessage?.data?.screen) return;

  const { screen, id } = remoteMessage.data;

  if (navigationRef.isReady()) {
    navigationRef.navigate(screen, { id });
  }
}


export default function App() {
  const navigationRef = useNavigationContainerRef();

 askNotificationPermissionWithPrompt();
  useEffect(() => {
    initFirebase();
    setupNotifications();
 
    // Foreground handler
    const unsubscribe = onMessage(getMessaging(getApp()), async remoteMessage => {
      console.log('📢 Foreground message:', remoteMessage);
    });

     // Background tap
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('📲 App opened from background:', remoteMessage);
      
      handleNotificationNavigation(remoteMessage);
    });

       messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('📲 App opened from quit state:', remoteMessage);
          handleNotificationNavigation(remoteMessage);
        }
      });

    return unsubscribe;
  }, []);

 

 

 

  const [fontsLoaded] = useFonts({
    'Nunito-ExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <>
      {/* ✅ Global StatusBar */}
      <StatusBar backgroundColor="#235D48" barStyle="light-content" />
      
     <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
         <NavigationContainer ref={navigationRef}>
        <AppNavigator  />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
    </>
  );
}
 


// App.tsx
import './global.css';
import React, { useContext, useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { StatusBar, PermissionsAndroid, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging, { AuthorizationStatus, getMessaging, getToken, onMessage, requestPermission } from '@react-native-firebase/messaging';
import { getFCMToken } from '~/utils/AppFunctions';
import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { setItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import * as Sentry from '@sentry/react-native';
import { clearKeychainOnFirstRun, getItem } from '~/utils/storage';
import NetworkProvider, { NetworkContext } from '~/utils/NetworkProvider';
import OfflineScreen from '~/components/OfflineScreen';
import { GlobalErrorBoundary } from '~/services/GlobalErrorBoundary';

// ✅ Global navigation ref (use only once)
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// ✅ Sentry setup
Sentry.init({
  dsn: 'https://8cf1cc2321c3876b50ee5e39ed4b8fa8@o4509863657144320.ingest.us.sentry.io/4509863663632384',
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  debug: true,
  tracesSampleRate: 1.0,
  enableAutoPerformanceTracing: true,
  enableAppHangTracking: true,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

export async function requestAndroidNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

export async function askNotificationPermissionWithPrompt() {
  try {
    const messagingInstance = getMessaging();
    const authStatus = await requestPermission(messagingInstance);
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch {
    return false;
  }
}

export function initFirebase() {
  try {
    if (getApps().length === 0) {
      initializeApp(require('./src/utils/firebaseConfig').firebaseConfig);
    }
  } catch (e) {}
}

// ✅ Background handler
messaging().setBackgroundMessageHandler(async () => {});

async function setupNotifications() {
  const app = getApp();
  const messagingInstance = getMessaging(app);
  const authStatus = await requestPermission(messagingInstance);

  if (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  ) {
    const token = await getToken(messagingInstance);
    console.log(token);
    await setItem(PREF_KEYS.fcmToken, token);
  }
}

async function handleNotificationNavigation(remoteMessage: any) {
  if (!remoteMessage?.data?.screen) return;
  const { screen, ...params } = remoteMessage.data;

  const validator = allowedScreens[screen];
  if (!validator || !validator(params)) return;

  if (navigationRef.isReady()) {
    const profileCompleted = await getItem(PREF_KEYS.profileCompleted);
    const login_status = await getItem(PREF_KEYS.login_status);

    if (profileCompleted === 'success') {
      (navigationRef.navigate as any)('Dashboard', { onload: 'Home' });
    } else if (login_status === 'success') {
      (navigationRef.navigate as any)('UserProfile', { src: '' });
    } else {
      (navigationRef.navigate as any)('Intro');
    }
  }
}

const allowedScreens: Record<string, (params: Record<string, any>) => boolean> = {
  Dashboard: (params) => typeof params.onload === 'string',
  UserProfile: (params) => typeof params.src === 'string',
  Intro: () => true,
};

// ✅ App entry point
export default Sentry.wrap(function App() {
  if (__DEV__) {
    // dev logging allowed
  } else {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  const [reloadKey, setReloadKey] = useState(0);
  const handleRetry = () => setReloadKey((prev) => prev + 1);

  useEffect(() => {
    clearKeychainOnFirstRun();
    initFirebase();
    setupNotifications();

    const unsubscribe = onMessage(getMessaging(getApp()), async () => {});

    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(
      handleNotificationNavigation
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) handleNotificationNavigation(remoteMessage);
      });

    return () => {
      unsubscribe();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  const [fontsLoaded] = useFonts({
    'Nunito-ExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <GlobalErrorBoundary>
    <NetworkProvider>
      <AppContent reloadKey={reloadKey} onRetry={handleRetry} />
    </NetworkProvider>
    </GlobalErrorBoundary>
  );
});

// ✅ Separated child that consumes context
function AppContent({ reloadKey, onRetry }: { reloadKey: number; onRetry: () => void }) {
  const { isConnected } = useContext(NetworkContext);

  if (!isConnected) {
    return <OfflineScreen onRetry={onRetry} />;
  }

  function OfflineScreenOverlay({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "white", // full cover
      zIndex: 100,
      justifyContent: "center",
      alignItems: "center"
    }}>
      <OfflineScreen onRetry={onRetry} />
    </View>
  );
}


  return (
    <>
      <StatusBar backgroundColor="#235D48" barStyle="light-content" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer  ref={navigationRef}>
            <AppNavigator />
            {/* {!isConnected && (
              <OfflineScreenOverlay onRetry={onRetry} />
            )} */}
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </>
  );
}

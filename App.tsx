// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
// import IntroScreen from '~/screens/Intro';
// import SplashScreen from '~/screens/Splashscreen';

// export default function App() {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 3000); // 3 seconds

//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return <SplashScreen />;
//   }

//   return (
//     <IntroScreen />
//   );
// }


// import './global.css';

// import React from 'react';
// import AppNavigator from './src/navigation/AppNavigator';
// import { useFonts } from 'expo-font';

// export default function App() {
//    const [fontsLoaded] = useFonts({
//     'Nunito-ExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
//     'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
//     'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
//   });
//    if (!fontsLoaded) return null;
//   return <AppNavigator />;
// }

 


import './global.css';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
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
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
    </>
  );
}

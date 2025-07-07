import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import SplashScreen from '~/screens/Splashscreen';
import IntroScreen from '~/screens/Intro';
import LoginScreen from '~/screens/LoginScreen';
import RegisterScreen from '~/screens/Register';
import ForgotPassword from '~/screens/forgotpassowrd/ForgotPassword';
import ForgotEmailMobile from '~/screens/forgotpassowrd/ForgotEmailMobile';
import OtpVerification from '~/screens/forgotpassowrd/OtpVerification';
import { RootStackParamList } from './types';
import ResetPasswordScreen from '~/screens/forgotpassowrd/ResetPassword';
import MultiStepSurvey from '~/screens/multi_info_screens/MultiStepSurvey';
import GamesGrid from '~/screens/multi_info_screens/GamesGrid';
import UserProfile from '~/screens/UserProfile';
import SuccessScreen from '~/screens/SuccessScreen';
import FillProfileInfoScreen from '~/screens/intoroScreeens/FillProfileInfoScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false ,  animation: 'slide_from_left' }} 
        />
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{ headerShown: false ,  animation: 'slide_from_right'}} 
        />
        <Stack.Screen name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false ,  animation: 'slide_from_right'}} />

         <Stack.Screen name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: false ,  animation: 'slide_from_left'}} />

         <Stack.Screen name="Forgotpassword" 
        component={ForgotPassword} 
        options={{ headerShown: false ,  animation: 'slide_from_right'}} />

      <Stack.Screen name="ForgotEmailMobile" 
        component={ForgotEmailMobile} 
        options={{ headerShown: false ,  animation: 'slide_from_right'}} />

     <Stack.Screen name="OtpVerification" 
        component={OtpVerification} 
        options={{ headerShown: false ,  animation: 'slide_from_right'}} />
        
  

        <Stack.Screen name="ResetPasswordScreen" 
          component={ResetPasswordScreen} 
          options={{ headerShown: false ,  animation: 'slide_from_right'}} />
        
           <Stack.Screen name="MultiStepSurvey" 
          component={MultiStepSurvey} 
          options={{ headerShown: false,  animation: 'slide_from_right' }} />

            <Stack.Screen name="GamesGrid" 
          component={GamesGrid} 
          options={{ headerShown: false,  animation: 'slide_from_right' }} />

   <Stack.Screen name="UserProfile" 
          component={UserProfile} 
          options={{ headerShown: false,  animation: 'slide_from_right' }} />


   <Stack.Screen name="Success" 
          component={SuccessScreen} 
          options={{ headerShown: false,  animation: 'slide_from_right' }} />

<Stack.Screen name="FillProfileInfoScreen" component={FillProfileInfoScreen}
options={{ headerShown: false,  animation: 'slide_from_right' }} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
import CollegePreferences from '~/screens/multi_info_screens/CollegePreferences';
import Splashscreen from '~/screens/Splashscreen';
import EmailConnectionUI from '~/screens/multi_info_screens/EmailConnectionUI';
import Dashboard from '~/screens/dashboard/Dashboard';
import CollegeMatchDetails from '~/screens/multi_info_screens/CollageMatchDeatils';
import AppWebview from '~/components/AppWebview';
import DeleteAccount from '~/screens/dashboard/DeleteAccount';
import ProfilePreview from '~/screens/multi_info_screens/ProfilePreview';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splashscreen}
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

{/* <Stack.Screen name="CollegePreferences" component={CollegePreferences}
options={{ headerShown: false,  animation: 'slide_from_right' }} />

<Stack.Screen name="EmailConnectionUI" component={EmailConnectionUI}
options={{ headerShown: false,  animation: 'slide_from_right' }} /> */}


<Stack.Screen name="Dashboard" component={Dashboard}
options={{ headerShown: false,  animation: 'slide_from_right' , headerBackVisible: false ,  gestureEnabled: false,}} />

<Stack.Screen
options={{ headerShown: false,  animation: 'slide_from_bottom' , animationDuration : 600  }}
  name="CollegeMatchDetails"  
  component={CollegeMatchDetails}  
  
/>

<Stack.Screen
  options={{ headerShown: false,  animation: 'slide_from_right' , animationDuration : 600  }}
  name="AppWebview"  
  component={AppWebview}  
/>

<Stack.Screen
  options={{ headerShown: false,  animation: 'slide_from_right' , animationDuration : 600  }}
  name="DeleteAccount"  
  component={DeleteAccount}  
/>

<Stack.Screen name="ProfilePreview" component={ProfilePreview}
options={{ headerShown: false,  animation: 'slide_from_right' , headerBackVisible: false ,  gestureEnabled: false,}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

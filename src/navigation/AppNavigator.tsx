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
import Splashscreen from '~/screens/Splashscreen';
import EmailConnectionUI from '~/screens/multi_info_screens/EmailConnectionUI';
import Dashboard from '~/screens/dashboard/Dashboard';
import CollegeMatchDetails from '~/screens/multi_info_screens/CollageMatchDeatils';
import AppWebview from '~/components/AppWebview';
import DeleteAccount from '~/screens/dashboard/DeleteAccount';
import ProfilePreview from '~/screens/multi_info_screens/ProfilePreview';
import EmailCommunication from '~/screens/dashboard/EmailCommunication';
import DeleteAccountSuccess from '~/screens/dashboard/DeleteAccountSuccess';
import SuccessProfileScreen from '~/components/SuccessProfileScreen';
import NewRegister from '~/screens/NewRegister';
import PasswordScreen from '~/components/PasswordScreen';
import CollegePreferences from '~/screens/multi_info_screens/CollegePreferences';
import Athletic from '~/screens/multi_info_screens/Athletic';
import Academic from '~/screens/multi_info_screens/Academic';
import ContactUs from '~/screens/dashboard/ContactUs';
import EditProfileInfo from '~/screens/dashboard/EditProfileinfo';
import AppSystemSettings from '~/screens/dashboard/AppSystemSettings';
import AppPreferences from '~/screens/dashboard/AppPreferences';
import ChangePassword from '~/screens/dashboard/ChangePassword';
 
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    // <NavigationContainer>
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

  <Stack.Screen name="NewRegister" 
        component={NewRegister} 
        options={{ headerShown: false ,  animation: 'slide_from_left'}} />

          <Stack.Screen name="PasswordScreen" 
        component={PasswordScreen} 
        options={{ headerShown: false , title : '' ,  animation: 'slide_from_left'}} />

              <Stack.Screen name="ContactUs" 
        component={ContactUs} 
        options={{ headerShown: false ,  animation: 'slide_from_right'}} />
        

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


   <Stack.Screen name="SuccessScreen" 
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


<Stack.Screen name="EmailCommunication" component={EmailCommunication}
options={{ headerShown: false,  animation: 'slide_from_right' , headerBackVisible: false ,  gestureEnabled: false,}} />


<Stack.Screen
  options={{ headerShown: false,  animation: 'slide_from_right' , animationDuration : 600  }}
  name="DeleteAccountSuccess"  
  component={DeleteAccountSuccess}  
/>



<Stack.Screen name="SuccessProfileScreen" component={SuccessProfileScreen}
options={{ headerShown: false,  animation: 'slide_from_right' , headerBackVisible: false ,  gestureEnabled: false,}} />


<Stack.Screen name="EditProfileInfo" component={EditProfileInfo}
options={{ headerShown: false,  animation: 'slide_from_right' , headerBackVisible: false ,  gestureEnabled: false,}} />

<Stack.Screen name="AppSystemSettings" component={AppSystemSettings}
options={{ headerShown: false,  animation: 'slide_from_right' , headerBackVisible: false ,  gestureEnabled: false,}} />

<Stack.Screen name="AppPreferences" component={AppPreferences}
options={{ headerShown: false,  animation: 'slide_from_right' , headerBackVisible: false ,  gestureEnabled: false,}} />

<Stack.Screen name="ChangePassword" component={ChangePassword}
options={{ headerShown: false,  animation: 'slide_from_right' , headerBackVisible: false ,  gestureEnabled: false,}} />



{/* <Stack.Screen name="ProfilePreview" component={ProfilePreview}
options={{ headerShown: false,   animation: 'slide_from_right' , headerBackVisible: true ,  gestureEnabled: false,}} /> */}
<Stack.Screen
  options={{
    headerShown: false,
    animation: "slide_from_right",
    animationDuration: 600,
  }}
  name="ProfilePreview"
>
  {(props) => {
    const { selectedGames,  stepToEdit, currentSteps } = props.route.params || {};
    return (
      <ProfilePreview
        {...props}
        selectedGames={selectedGames}
        currentSteps={currentSteps}
        stepToEdit={stepToEdit}
        onNext={() => console.log("Next clicked")}
        goToLastStep={() => console.log("Go to last step")}
      />
    );
  }}
</Stack.Screen>

 
 {/* <Stack.Screen
  options={{
    headerShown: false,
    animation: 'slide_from_right',
    animationDuration: 600,
  }}
  name="EmailConnectionUI"   
>
  {(props) => (
    <EmailConnectionUI
      {...props}
      onNext={() => console.log("Next clicked")}
      goToLastStep={() => console.log("Go to last step")}
      stepToEdit={null}
    />
  )}
</Stack.Screen> */}


<Stack.Screen
  options={{
    headerShown: false,
    animation: "slide_from_right",
    animationDuration: 600,
  }}
  name="EmailConnectionUI"
>
  {(props) => {
    const { selectedGames,  stepToEdit, currentSteps } = props.route.params || {};
    return (
      <EmailConnectionUI
        {...props}
        selectedGames={selectedGames}
        currentSteps={currentSteps}
        stepToEdit={stepToEdit}
        onNext={() => console.log("Next clicked")}
        goToLastStep={() => console.log("Go to last step")}
      />
    );
  }}
</Stack.Screen>

 {/* <Stack.Screen
  options={{
    headerShown: false,
    animation: 'slide_from_right',
    animationDuration: 600,
  }}
  name="CollegePreferences"   
>
  {(props) => (
    <CollegePreferences
      {...props}
      onNext={() => console.log("Next clicked")}
      goToLastStep={() => console.log("Go to last step")}
      stepToEdit={0}
    />
  )}
</Stack.Screen> */}

<Stack.Screen
  options={{
    headerShown: false,
    animation: "slide_from_right",
    animationDuration: 600,
  }}
  name="CollegePreferences"
>
  {(props) => {
    const { selectedGames,  stepToEdit, currentSteps } = props.route.params || {};
    return (
      <CollegePreferences
        {...props}
        selectedGames={selectedGames}
        currentSteps={currentSteps}
        stepToEdit={stepToEdit}
        onNext={() => console.log("Next clicked")}
        goToLastStep={() => console.log("Go to last step")}
      />
    );
  }}
</Stack.Screen>

 {/* <Stack.Screen
  options={{
    headerShown: false,
    animation: 'slide_from_right',
    animationDuration: 600,
  }}
  name="Athletic"   
>
  {(props) => (
    <Athletic
          selectedGames={[]} currentSteps={0} {...props}
          onNext={() => console.log("Next clicked")}
          goToLastStep={() => console.log("Go to last step")}    />
  )}
</Stack.Screen> */}
<Stack.Screen
  options={{
    headerShown: false,
    animation: "slide_from_right",
    animationDuration: 600,
  }}
  name="Athletic"
>
  {(props) => {
    const { selectedGames,  stepToEdit, currentSteps } = props.route.params || {};
    return (
      <Athletic
        {...props}
        selectedGames={selectedGames}
        currentSteps={currentSteps}
        stepToEdit={stepToEdit}
        onNext={() => console.log("Next clicked")}
        goToLastStep={() => console.log("Go to last step")}
      />
    );
  }}
</Stack.Screen>



 {/* <Stack.Screen
  options={{
    headerShown: false,
    animation: 'slide_from_right',
    animationDuration: 600,
    
  }}
  name="Academic"   
>
  {(props) => (
    <Academic
      {...props}
      onNext={() => console.log("Next clicked")}
      goToLastStep={() => console.log("Go to last step")}
      stepToEdit={0}
    />
  )}
</Stack.Screen> */}


<Stack.Screen
  options={{
    headerShown: false,
    animation: "slide_from_right",
    animationDuration: 600,
  }}
  name="Academic"
>
  {(props) => {
    const { selectedGames,  stepToEdit, currentSteps } = props.route.params || {};
    return (
      <Academic
        {...props}
        selectedGames={selectedGames}
        currentSteps={currentSteps}
        stepToEdit={stepToEdit}
        onNext={() => console.log("Next clicked")}
        goToLastStep={() => console.log("Go to last step")}
      />
    );
  }}
</Stack.Screen>

      </Stack.Navigator>
    // </NavigationContainer>
  );
}

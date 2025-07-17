import React, { useState } from 'react';
import {  View,  Text,  TouchableOpacity,  TextInput,  Alert,} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {  useNavigation,  NavigationProp,  useRoute,  RouteProp, useFocusEffect,} from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ArrowButton from '~/components/ArrowButton';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Api_Url, httpRequest, ResetPasswordRequest } from '~/services/serviceRequest';
import { LoginResponse, ResetPasswordResponse, SimpleResponse } from '~/services/DataModals';
import { getItem, setItem } from 'expo-secure-store';
import { PREF_KEYS, Temp_KEYS } from '~/utils/Prefs';
import Loader from '~/components/Loader';
import { removeItem } from '~/utils/storage';
import AppText from '~/components/AppText';
import TitleText from '~/components/TitleText';

type RootStackParamList = {
  ResetPasswordScreen: { userid: any };
  Login: undefined;
  Success: { message: string; title?: string };
};

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ResetPasswordScreen'>>();
  const userid = route.params.userid;
  const [showTooltip, setShowTooltip] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid =
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword;

      const isPasswordValid = (text: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/#^()_\-+={}[\]:;"'<>,.\\|~`]).{8,}$/;
    return regex.test(text);
  };

  const handleSubmit = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
    } else if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 9 characters long');
    } else if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
    } else {
    ResetPasswordRequestCall();
    }
  };

    const delayedShowTooltip = () => {
    setTimeout(() => {
      setShowTooltip(true);
    }, 100);
  };

 const ResetPasswordRequestCall = async () => {
   try {
     setLoading(true);

   const emailID = await getItem(PREF_KEYS.forgot_email);
const OTP = await getItem(PREF_KEYS.forgot_otp);

  const requestBody: ResetPasswordRequest = {
       email: emailID ?? '',  
       code : OTP ?? '',
       pass : confirmPassword
     };
     console.log(requestBody);
 
     const res = await httpRequest<SimpleResponse>(
       Api_Url.resetPassword,    'post',    requestBody,    undefined,   true 
     );
 console.log(res);
     if (res.status) {
        removeItem(PREF_KEYS.forgot_email);
        removeItem(PREF_KEYS.forgot_otp);
        // navigation.reset({ index: 0, routes: [{ name: 'Login' }], });
       navigation.navigate('Success', {
          message: 'Password Reset successfully!',
        });
     } else {
       Alert.alert('Error', res.message ?? 'Request failed');
     }
   } catch (err) {
     Alert.alert('Error', 'Unexpected error occurred.');
   } finally {
     setLoading(false);
   }
 };

   useFocusEffect(
     React.useCallback(() => {
      setNewPassword(Temp_KEYS.newpass);
       setConfirmPassword(Temp_KEYS.newpass);
       setLoading(false); // if applicable
       // clear validation errors if you use any
     }, [])
   );

  return (
    <View className="flex-1 bg-background px-6 pt-14">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-16 h-16 rounded-3xl bg-[#E3E9E5] items-center justify-center mb-6"
      >
        <Ionicons name="chevron-back" size={24} color="#1A322E" />
      </TouchableOpacity>

      <KeyboardAwareScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
        {/* Title */}
        <View className="items-center mb-8">
          <TitleText size='text-20'>
            Change Your Password
          </TitleText>
          <AppText className="text-center">
            Please enter and confirm your new password.
          </AppText>
        </View>

        {/* New Password Field */}
        <TitleText className="mb-2">New Password</TitleText>
      <View
        className={`flex-row items-center rounded-xl px-3 h-14 mb-4 bg-white ${
          newPassword && !isPasswordValid(newPassword)
            ? 'border border-red-500'  : 'border border-gray-300'  }`} >      
    <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
          <TextInput
            className="ml-3 flex-1 text-black font-nunitosemibold text-base"
            placeholder="Enter new password"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <MaterialIcons
              name={showNewPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#124D3A"
            />
          </TouchableOpacity>
        </View>
        {/* Password Requirements Label */}
         {/* Hint + Tooltip */}
          <View className="flex-row items-center  ml-2 mb-4 mt-1">
            <AppText>
              Password must be at least 8 characters
            </AppText>
            <Tooltip
              isVisible={showTooltip}
              content={
                <View style={{ backgroundColor: '#fff', padding: 12 }}>
                  <AppText style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
                    • At least 8 characters{'\n'}
                    • 1 uppercase & lowercase letter{'\n'}
                    • 1 number & 1 special character{'\n'}
                    • Example: Demo@123#
                  </AppText>
                </View>
              }
              placement={keyboardVisible ? 'bottom' : 'top'}
              onClose={() => setShowTooltip(false)}
              showChildInTooltip={false}
              backgroundColor="rgba(0,0,0,0.3)"
            >
              <TouchableOpacity onPress={delayedShowTooltip} className="ml-1">
                <MaterialIcons name="help-outline" size={20} color="#4A4A4A" />
              </TouchableOpacity>
            </Tooltip>
          </View>

        {/* Confirm Password Field */}
        <TitleText className="mb-2">Confirm Password</TitleText>
<View
  className={`flex-row items-center rounded-xl px-3 h-14 mb-4 bg-white ${
    confirmPassword && (!isPasswordValid(confirmPassword) || confirmPassword !== newPassword)
      ? 'border border-red-500'   : 'border border-gray-300'  }`} >
        <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
          <TextInput
            className="ml-3 flex-1 text-black font-nunitosemibold text-base"
            placeholder="Re-enter new password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <MaterialIcons
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#124D3A"
            />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View className="my-4 opacity-100">
          <ArrowButton
            text="Continue"
            onPress={handleSubmit}
            fullWidth
            disabled={!isFormValid}
          />
        </View>
                <Loader show={loading} />
        
      </KeyboardAwareScrollView>
    </View>
  );
}


 

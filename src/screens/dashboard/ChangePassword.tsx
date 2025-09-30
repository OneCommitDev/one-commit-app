import React, { useState } from 'react';
import {  View,  Text,  TouchableOpacity,  TextInput,  Alert, Platform,} from 'react-native';
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
import { clearAllPrefss, removeItem } from '~/utils/storage';
import AppText from '~/components/AppText';
import TitleText from '~/components/TitleText';

type RootStackParamList = {
  Success: { message: string; title?: string };
};

export default function ChangePassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showTooltip, setShowTooltip] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

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

    const payload = {
        old_pass: oldPassword,
        new_pass: confirmPassword,
      };
 
     const res = await httpRequest<SimpleResponse>(
       Api_Url.changePassword,    'post',    payload,    undefined,   true 
     );
     if (res.status) {
        removeItem(PREF_KEYS.forgot_email);
        removeItem(PREF_KEYS.forgot_otp);
        // navigation.reset({ index: 0, routes: [{ name: 'Login' }], });
        clearAllPrefss();
       navigation.navigate('Success', {
          message: 'Password Reset successfully! Please login again',
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

    const handleBack = () => {
    navigation.goBack();
  };

  return (
    // <View className="flex-1 bg-background h-full">
     <View
                  className={`flex-1 bg-background px-4 ${
                    Platform.OS === "ios" ? "pt-14" : "pt-1"
                  }`}
                >
        {/* Header */}
      <View className="flex-row  items-center  mb-2">
              <TouchableOpacity
                onPress={handleBack}
                className="w-11 h-11 rounded-full bg-gray-200 items-center justify-center"
              >
                <Ionicons name="chevron-back" size={24} color="#1A322E" />
              </TouchableOpacity>
      
              <View className="flex-1 ml-3">
                <TitleText>Change Password</TitleText>
              </View>
            </View>
    

      <KeyboardAwareScrollView
        className="flex-1 bg-background px-6 py-6"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
      >
    
            {/* old Password Field */}
        <TitleText className="mb-2">Current Password</TitleText>
      <View
        className={`flex-row items-center rounded-xl px-3 h-14 bg-white ${
          newPassword && !isPasswordValid(newPassword)
            ? 'border border-red-500'  : 'border border-gray-300'  }`} >      
    <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
          <TextInput
            className="ml-3 flex-1 text-black font-nunitosemibold text-base"
            placeholder="Enter current password"
            secureTextEntry={!showCurrentPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
            <MaterialIcons
              name={showNewPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#124D3A"
            />
          </TouchableOpacity>
        </View>

        {/* New Password Field */}
        <TitleText className="mb-2">New Password</TitleText>
      <View
        className={`flex-row items-center rounded-xl px-3 h-14 bg-white ${
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
         {/* Hint + Tooltip */}
          <View className="flex-row items-center  ml-2">
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
        <TitleText className="mb-2 mt-2">Confirm Password</TitleText>
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


 

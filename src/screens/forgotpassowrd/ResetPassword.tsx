import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ArrowButton from '~/components/ArrowButton';

type RootStackParamList = {
  ResetPasswordScreen: { userid: any };
  Login: undefined;
};

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ResetPasswordScreen'>>();
  const userid = route.params.userid;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid =
    newPassword.length >= 9 &&
    confirmPassword.length >= 9 &&
    newPassword === confirmPassword;

  const handleSubmit = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
    } else if (newPassword.length < 9) {
      Alert.alert('Error', 'Password must be at least 9 characters long');
    } else if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
    } else {
      Alert.alert('Success', 'Password has been reset');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Login' }],
      // });
    }
  };

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
          <Text className="text-black text-20 font-nunitoextrabold mb-2">
            Change Your Password
          </Text>
          <Text className="text-light text-16 font-nunitoregular text-center">
            Please enter and confirm your new password.
          </Text>
        </View>

        {/* New Password Field */}
        <Text className="text-14 font-nunitoextrabold text-title mb-2">New Password</Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14 bg-white">
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
        <Text className="text-xs text-gray-500 mt-1 mb-4">
          Password must be at least 9 characters long
        </Text>

        {/* Confirm Password Field */}
        <Text className="text-14 font-nunitoextrabold text-title mb-2">Confirm Password</Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14 mb-4 bg-white">
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
      </KeyboardAwareScrollView>
    </View>
  );
}

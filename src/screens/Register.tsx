import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Logo from '~/components/Logo';


export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [confirmSecure, setConfirmSecure] = useState(true);
  const [error, setError] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSubmit = () => {
  /*  if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    */
    navigation.navigate('UserProfile');
  };

  return (
<KeyboardAwareScrollView
  className="flex-1 bg-background"
  contentContainerStyle={{ flexGrow: 1 }}
  keyboardShouldPersistTaps="handled"
  enableOnAndroid={true}
  extraScrollHeight={100} // adjust if needed
>

        <View className="flex-1 justify-center items-center bg-background  py-10">
          <View className="w-full p-6 rounded-2xl">

            {/* Logo */}
                       <View className="items-center mb-6">
                         <View>
                         <Logo size={80} />
                       </View>
                       </View>

            {/* Heading */}
          <Text className="text-20 font-nunitoextrabold text-center text-title mb-1">Create Account</Text>
          <Text className="text-light text-center mb-6 font-nunitoregular text-16">One tool. One decision. One future.</Text>

          {/* Email Input */}
                   <Text className="text-14 font-nunitoextrabold  text-title mb-3">Email Address</Text>
                       <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14 mb-4 bg-white">
                       <View className="pl-2 pr-3">
                       <MaterialIcons name="email" size={24} color="#124D3A" />
                       </View>
                      <TextInput
                      className="ml-2 flex-1 text-black font-nunitosemibold text-base"
                      placeholder="example@example.com"
                      value={email}
                      style={{ letterSpacing: 1 }} 
                      onChangeText={setEmail}
                      keyboardType="email-address"
                    />

                     </View>


                  {/* Password Input */}
            <Text className="text-14 font-nunitoextrabold text-title mb-3">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14 mb-4 bg-white">
              <View className="pl-2 pr-3">
                <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
              </View>
              <TextInput
                className="ml-2 flex-1 text-black"
                placeholder="Enter password"
                secureTextEntry={secure}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError('');
                }}
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <MaterialIcons
                  name={secure ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>


            {/* Confirm Password Input */}
                        <Text className="text-14 font-nunitoextrabold  text-title mb-3">Confirm Password</Text>

            <View className="flex-row items-center border border-gray-300 rounded-xl px-3 h-14 mb-4 bg-white">
            <View className="pl-2 pr-3">
            <MaterialIcons name="lock-outline" size={24} color="#124D3A" />
            </View>
            <TextInput
            className="ml-2 flex-1 text-black"
            placeholder="Confirm password"
            secureTextEntry={confirmSecure}
            value={confirmPassword}
            onChangeText={text => {
            setConfirmPassword(text);
            if (error) setError('');
            }}
            />
            <TouchableOpacity onPress={() => setConfirmSecure(!confirmSecure)}>
            <MaterialIcons
            name={confirmSecure ? 'visibility-off' : 'visibility'}
            size={20}
            color="gray"
            />
            </TouchableOpacity>
            </View>

            {/* Error Message Section with Fixed Height */}
            {error && (
            <View className="flex-row items-center border border-red-500 bg-red-50 rounded-3xl px-4 py-3 mt-2 mb-4">
            <MaterialIcons name="warning" size={20} color="#B91C1C" />
            <Text className="text-black text-sm font-bold ml-2">Error: {error}</Text>
            </View>
            )}









            {/* Submit Button */}
            <View className="my-4">
              <ArrowButton text="Sign Up" onPress={handleSubmit} fullWidth />
            </View>

            {/* Footer Links */}
            <View className="flex-row justify-center mb-2">
              <Text className="text-gray-500">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-[#124D3A] font-semibold">Sign In</Text>
                </TouchableOpacity>

            </View>

          </View>
        </View>
    </KeyboardAwareScrollView>
  );
}

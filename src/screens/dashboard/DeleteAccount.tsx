import React, { useState } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import TitleText from '~/components/TitleText';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppText from '~/components/AppText';
import { getItem } from 'expo-secure-store';
import {  PREF_KEYS } from '~/utils/Prefs';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { SimpleResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
import { clearAllPrefss } from '~/utils/storage';

export default function DeleteAccount() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Are you absolutely sure?',
      'This action is irreversible. Your profile, history, and all stored data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {           
              deactivateAPIRequest();
          },
        },
      ]
    );
  };

      const deactivateAPIRequest = async () => {
        try {
             setLoading(true);
    
          const accessToken = getItem(PREF_KEYS.accessToken);
          const url = Api_Url.deactivateAPI;
          const res = await httpRequest2<SimpleResponse>(
            url,  'delete',   {},   accessToken ?? ''  );
          if (res.status) {
                clearAllPrefss();
                navigation.navigate('DeleteAccountSuccess');
          }
        } catch (err) {
           Alert.alert('Error', 'Unexpected error occurred.');
        } finally {
             setLoading(false);
        }
      };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-[#F9FAFB] pt-14">
      {/* Header */}
      <View className="flex-row items-center px-4 mb-4">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-[#E3E9E5] items-center justify-center"
        >
          <Ionicons name="chevron-back" size={22} color="#1A322E" />
        </TouchableOpacity>

        <TitleText className="ml-4 text-xl">Delete Account</TitleText>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View className="bg-white rounded-2xl p-6 shadow shadow-black/10">
          {/* Warning Icon */}
          <View className="items-center justify-center mb-4">
            <MaterialIcons name="warning" size={48} color="#DC2626" />
          </View>

          {/* Title */}
          <TitleText className="text-center text-18 mb-2 text-title">
            Are you sure you want to delete your account?
          </TitleText>

          {/* Description */}
          <AppText className="text-center text-[15px] text-gray-600 leading-relaxed mb-6">
            Deleting your account is permanent and cannot be undone.{"\n\n"}
            All your data, including your profile, saved preferences, history, and any linked content will be permanently removed from our servers.{"\n\n"}
            You will lose access to all features and services. This action is irreversible and we won't be able to recover your data.{"\n\n"}
            If you're sure you want to proceed, please confirm below.
          </AppText>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-600 py-3 rounded-xl items-center mb-4"
          >
            <TitleText className="text-white text-base">Yes, Delete My Account</TitleText>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={handleBack}
            className="items-center"
          >
            <AppText className="text-blue-600 font-semibold text-[15px]">No, Keep My Account</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
            <Loader show={loading} />
      
    </View>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmailConnectionUI() {
  return (
    <View className="space-y-5">

      {/* Connect Gmail */}
   <TouchableOpacity
  className="flex-row items-center justify-between bg-white rounded-2xl px-5 py-4 active:opacity-80 h-20"
  style={{
    shadowColor: '#111A14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4, // Android shadow
  }}
>
  <View className="flex-row items-center space-x-4">
    <Image
      source={{ uri: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' }}
      className="w-10 h-10 rounded-full"
    />
    <Text className="text-18 font-nunitosemibold text-title ml-4">Connect Gmail</Text>
  </View>
  <Ionicons name="arrow-forward" size={20} color="#1A322E" />
</TouchableOpacity>


      {/* Connect Outlook */}
 <TouchableOpacity
  className="mt-3 flex-row items-center justify-between bg-white rounded-2xl px-5 py-4 active:opacity-80 h-20"
  style={{
    shadowColor: '#111A14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4, 
  }}
>
  <View className="flex-row items-center space-x-4">
   <Image
         source={require('assets/images/outlook.png')}
          className="w-10 h-10"
       />
    <Text className="text-18 font-nunitosemibold text-title ml-4">Connect Outlook</Text>
  </View>
  <Ionicons name="arrow-forward" size={20} color="#1A322E" />
</TouchableOpacity>


      {/* Info Box */}
      <View className="bg-background border border-border_color rounded-xl p-2 mt-4 mb-6 text-title">
        <Text className="text-base text-gray-700 leading-relaxed font-nunitosemibold ml-2">
          Email connection is required to use OneCommit’s outreach features. To learn more, click{''}
          <Text className="underline text-black" onPress={() => Linking.openURL('https://onecommit.us/')}>here</Text>.
        </Text>
      </View>
    </View>
  );
}

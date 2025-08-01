import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { clearAllPrefs, PREF_KEYS } from '~/utils/Prefs';
import { getItem } from '~/utils/storage';
import Loader from '~/components/Loader';

export default function ProfileSetting() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [autoFollowUp, setAutoFollowUp] = useState(false);
  const [smartRecommendations, setSmartRecommendations] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    clearAllPrefs();
    setTimeout(() => {
      setLoading(false); // Optional, in case you show loader only before navigation
      navigation.replace('Login');
    }, 3000);
  };


  return (
    <View className="flex-1 bg-background">
        <Loader show={loading} />
      
       <View className="px-4 mb-6 pt-14">
              <TitleText size='text-24'>Profile Settings</TitleText>
             </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-6">

<View className="flex-row  justify-between bg-white py-3 rounded-2xl mb-4">
  <View className="flex-row items-center">
    <Image
      source={{ uri: 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png' }} // Replace with actual image
      className="h-14 w-14 rounded-full ml-4"
    />
    <View className="ml-3">
     <TitleText>
      Hello, {getItem(PREF_KEYS.displayName)} ! 👋
      </TitleText>
      <View className="flex-row items-center mt-1">
        <Ionicons name="star" size={14} color="#FACC15" className="ml-1 -mt-5" />
        <AppText className="ml-1 -mt-5">Pro Member</AppText>
      </View>
    </View>
  </View>

  {/* Edit Icon */}
  {/* <TouchableOpacity className="p-2">
    <Ionicons name="create-outline" size={18} color="#6B7280" />
  </TouchableOpacity> */}
</View>

      <View>
              {/* Connected Email Account */}
              <TitleText className="mb-2">Connected Email Account</TitleText>

              <View className="bg-white px-4 py-4 rounded-xl mb-6">
                {/* Top Row: Icon + Gmail + Buttons */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                      <View className="h-14 w-14 rounded-full bg-gray-200 justify-center items-center">
                      <Ionicons name="mail-outline" size={24} color="#6B7280" />
                      </View>

                    <View className="ml-4">
                      <TitleText>Gmail</TitleText>
                      <AppText className="-mt-4">example@example.com</AppText>
                    </View>
                  </View>

                  {/* Right: Delete & Reload Buttons */}
                  <View className="flex-row space-x-4">
                 <View className='mr-5'>
                     <TouchableOpacity>
                      <Ionicons name="trash-outline" size={20} color="#DC2626" />
                    </TouchableOpacity>
                 </View>
                    <TouchableOpacity>
                      <Ionicons name="refresh-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>


              {/* Email Preferences */}
              <View className="mb-6">
                <TitleText className="mb-3">Email Preferences</TitleText>

                {/* Auto-Send Follow-Ups */}
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-1 pr-4">
                    <TitleText>Auto-Send Follow-Ups</TitleText>
                    <AppText className='-mt-3'>
                      Let OneCommit send scheduled follow-ups for you
                    </AppText>
                  </View>
                  <Switch value={autoFollowUp} onValueChange={setAutoFollowUp} />
                </View>

                {/* Smart Recommendations */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 pr-4">
                    <TitleText>Smart Recommendations</TitleText>
                    <AppText className='-mt-3'>
                      Use AI to prioritize schools and suggest next steps
                    </AppText>
                  </View>
                  <Switch value={smartRecommendations} onValueChange={setSmartRecommendations} />
                </View>
              </View>

              {/* Account Controls */}
              <View className="mb-6">
                <TitleText className="mb-3">Account Controls</TitleText>

                <SettingItem icon="person-outline" text="Edit Profile Info"
                  // onPress={() =>
                  //   navigation.navigate('ProfilePreview', {
                  //     selectedGames: [], // or the actual list of games if available
                  //     stepToEdit: 6, // go to last step (ProfilePreview)
                  //   })
                  // }
                  onPress={() => navigation.navigate('UserProfile', {src : 'profileSettings'})}

                   />
                <SettingItem icon="trash-outline" text="Delete Account" textClass="text-red-800" onPress={() => navigation.navigate('DeleteAccount')} />
                {/* <SettingItem icon="log-out-outline" text="Log Out" /> */}
                <SettingItem
                icon="log-out-outline"
                text="Log Out"
                 onPress={handleLogout}
            />
              </View>

              {/* Support */}
              <View>
              <TitleText className="mb-3">Support</TitleText>
                <SettingItem icon="help-circle-outline" text="Contact Support"   onPress={() => navigation.navigate('AppWebview', { url: 'https://onecommit.us/#' , title : 'Contact Support' })}
 />
                <SettingItem icon="document-text-outline" text="Terms of Service"  onPress={() => navigation.navigate('AppWebview', { url: 'https://onecommit.us/#' , title : 'Terms of Service' })} />
                <SettingItem icon="lock-closed-outline" text="Privacy Policy"  onPress={() => navigation.navigate('AppWebview', { url: 'https://onecommit.us/#', title : 'Privacy Policy' })} />
              </View>

              {/* Footer Logo */}
              <View className="items-center mt-10">
                {/* <Image
                  source={require('assets/icon.png')} 
                  className='h-24 w-24 rounded-full'
                /> */}

                <Image
                  source={require('assets/images/logo.png')}
                  className="w-[60px] h-[60px]"
                  style={{ tintColor: '#235D48' }}
                  resizeMode="contain"
                />

                <TitleText className="mt-2 text-center">
                  OneCommit
                </TitleText>
                <AppText className="-mt-2 text-center">
                  One tool. One decision. One future.
                </AppText>
              </View>
      </View>
      </ScrollView>
    </View>
  );
}
 


 function SettingItem({
  icon,
  text,
  textClass = 'text-gray-900',
  onPress,
}: {
  icon: string;
  text: string;
  textClass?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="py-2">
      <View className="flex-row items-center justify-between h-16 w-full bg-white rounded-2xl px-4 border border-gray-200">
        <View className="flex-row items-center">
          <Ionicons name={icon as any} size={20} color="#6B7280" />
          <View className="ml-3 justify-center">
            <AppText className={`${textClass}`}>{text}</AppText>
          </View>
        </View>
        <Ionicons name="arrow-forward-sharp" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}


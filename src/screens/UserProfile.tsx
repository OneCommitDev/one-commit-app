import React, { useEffect, useState } from 'react';
import {  View,  Text,  TouchableOpacity,  ScrollView,  Platform,  Modal,  Alert,} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '~/components/AppInput';
import AppText from '~/components/AppText';
import ArrowButton from '~/components/ArrowButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { removeItem } from '~/utils/storage';
import { clearAllPrefs, PREF_KEYS } from '~/utils/Prefs';
import { Api_Url, CreateProfileRequest, getRequest, httpRequest2 } from '~/services/serviceRequest';
import { CreateProfileResponse, SimpleResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import { Applog } from '~/utils/logger';
import TestTypeToggle from './multi_info_screens/TestTypeToggle';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const [showAndroidPicker, setShowAndroidPicker] = useState(false); // ✅ For Android
  const [genderType, setGenderType] = useState<'Male' | 'Female'>('Male');

  const [form, setForm] = useState({
    fullName: '',
    preferredName: '',
    email: '',
    phone: '',
    dob: new Date(),
    city: "",
    states: "",
    zip: '',
    gender: '',
     weightis: '',
    heightis : '',
  });

  const [dobTemp, setDobTemp] = useState(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm({ ...form, [key]: value });
  };

    const handleBack = () => {
           // navigation.goBack();
           navigation.replace('Login');
      clearAllPrefs();
       // ProfileApiRequest();
    }

const ProfileApiRequest = async () => {
  try {
   setLoading(true);

    const email = 'Pardeep.Kumar@agilite.tech';
    const accessToken = await getItem(PREF_KEYS.accessToken);
     console.log(accessToken);

    const res = await httpRequest2<CreateProfileResponse>(
      Api_Url.userProfile,  
      'get',
      { email },           
      accessToken ?? '',
    );

    console.log(res);

    if (res.status) {
      console.log('Profile:', res.message);
      // handle success
    } else {
      Alert.alert('Error', res.message ?? 'Login failed');
    }
  } catch (err) {
    console.error('ProfileApiRequest failed:', err);
    Alert.alert('Error', 'Unexpected error occurred.');
  } finally {
   setLoading(false);
  }

 
};



 useEffect(() => {
  console.log('useEffect triggered on mount');
  const fetchProfile = async () => {
    console.log('Calling ProfileApiRequest...');
    await ProfileApiRequest();
  };
  fetchProfile();
}, []);


 

 useEffect(() => {
   form.email = getItem(PREF_KEYS.userEmailID) ?? '';
}, []);

  return (
        <View className="flex-1 px-2 pt-7">
    
    <View className="flex-row mt-5">
  <TouchableOpacity 
    onPress={handleBack}
    className="w-12 h-12 rounded-full bg-[#E3E9E5] items-center justify-center">
    <Ionicons name="chevron-back" size={24} color="#1A322E" />
  </TouchableOpacity>

  <View className="flex-1 justify-center ml-3">
    <Text className="text-16 font-nunitoextrabold text-title">
      Create Profile
    </Text>
  </View>
</View>

  <KeyboardAwareScrollView
    className="flex-1 bg-background"
    contentContainerStyle={{ flexGrow: 1 }}
    keyboardShouldPersistTaps="handled"
    enableOnAndroid={true}
    extraScrollHeight={100} // adjust if needed
  >
            <Loader show={loading} />
    
            <View className="bg-background ml-5 mr-5">
          
    
      

      <AppText text="Full Name" size="text-base" />
      <AppInput
        value={form.fullName}
        leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
        onChangeValue={(text) => handleChange('fullName', text)}
        placeholder="Enter full name"
      />

      <AppText text="Preferred Name" size="text-base" />
      <AppInput
        value={form.preferredName}
        leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
        onChangeValue={(text) => handleChange('preferredName', text)}
        placeholder="Enter preferred name"
      />

      <AppText text="Email" size="text-base" />
   <AppInput
  value={form.email}
  editable={false}
  className="bg-gray-100"
  leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
  onChangeValue={(text) => handleChange('email', text)}
  placeholder="Enter email"
  keyboardType="email-address"
/>


      <AppText text="Phone Number" size="text-base" />
      <AppInput
        value={form.phone}
                leftIcon={<Ionicons name="phone-portrait-sharp" size={20} color="#6B7280" />}
        onChangeValue={(text) => handleChange('phone', text)}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <AppText text="Date of Birth" size="text-base" />
         <View className='bg-white px-1 py-1 rounded-full mt-2 mb-2'>
       <TouchableOpacity
        onPress={() => {
          if (Platform.OS === 'ios') {
            setDobTemp(form.dob);
            setShowDatePickerModal(true);
          } else {
            setShowAndroidPicker(true);
          }
        }}
        className="px-4 py-3"
      >
  <Text className="text-black">
    {form.dob ? format(form.dob, 'MMM dd, yyyy') : 'Select date'}
  </Text>
</TouchableOpacity>


         </View>

         <View>
              <View className="flex-row space-x-4">
                  {/* City */}
                  <View className="flex-1">
                    <AppText text="City" size="text-base" className="mb-1" />
                    <AppInput
                        value={form.city}
                        onChangeValue={(text) => handleChange('city', text)}
                        placeholder="Enter City"
                      />
                  </View>

                  {/* State */}
                  <View className="flex-1 ml-5">
                    <AppText text="State" size="text-base" className="mb-1" />
                    <AppInput
                      value={form.states}
                      onChangeValue={(text) => handleChange('states', text)}
                      placeholder="Enter State"
                      className="h-12"
                    />
                  </View>
                </View>

                  
                      <AppText text="Zip Code" size="text-base" />
                      <AppInput
                        value={form.zip}
                        keyboardType='number-pad'
                        onChangeValue={(text) => handleChange('zip', text)}
                        placeholder="Zip Code"
                      />
         </View>

 
 <AppText text="Gender" size="text-base" className="mb-1" />
 <View className="mb-2">
       <TestTypeToggle
        options={['Male', 'Female']}
        initialValue="Male"
        onSelect={(selected) => {
          setGenderType(selected as 'Male' | 'Female');
          setForm((prev) => ({ ...prev, gender: selected }));
        }}
      />

       

      </View>
 



    <View>
                   <View className="flex-row space-x-4">
                       {/* Weight */}
                       <View className="flex-1">
                         <AppText text="Weight" size="text-base" className="mb-1" />
                         <AppInput
                             value={form.weightis}
                             onChangeValue={(text) => handleChange('weightis', text)}
                             placeholder="Enter Weight"
                           />
                       </View>
     
                       {/* Height */}
                       <View className="flex-1 ml-5">
                         <AppText text="Height" size="text-base" className="mb-1" />
                         <AppInput
                           value={form.heightis}
                           onChangeValue={(text) => handleChange('heightis', text)}
                           placeholder="Enter Height"
                           className="h-12"
                         />
                       </View>
                     </View>
      
              </View>



    

  <View className='mb-24 mt-10'>
  <ArrowButton
  text="Save Changes"
  onPress={() => {
    console.log('Saved:', form);
    navigation.navigate('GamesGrid'); // Replace 'Home' with your actual route name
  }}
  fullWidth
/>
  </View>

      {/* Date Picker Modal */}
      {/* iOS Modal (custom modal works only for iOS) */}
{Platform.OS === 'ios' && (
  <Modal visible={showDatePickerModal} transparent animationType="slide">
    <View className="flex-1 justify-end bg-black/30">
      <View className="bg-white p-4 rounded-t-2xl">
        <Text className="text-lg font-semibold text-center mb-2 text-black">
          Select Date of Birth
        </Text>
        <DateTimePicker
          value={dobTemp}
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          onChange={(_, date) => {
            if (date) setDobTemp(date);
          }}
        />
        <ArrowButton
          text="Proceed"
          onPress={() => {
            handleChange('dob', dobTemp);
            setShowDatePickerModal(false);
          }}
          fullWidth
        />
        <TouchableOpacity
          className="mt-3 py-2"
          onPress={() => setShowDatePickerModal(false)}
        >
          <Text className="text-center text-gray-600">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

{/* Android Inline Picker (native popup) */}
{showAndroidPicker && Platform.OS === 'android' && (
  <DateTimePicker
    value={form.dob}
    mode="date"
    display="default"
    maximumDate={new Date()}
    onChange={(_, date) => {
      setShowAndroidPicker(false);
      if (date) handleChange('dob', date);
    }}
  />
)}
      </View>
    </KeyboardAwareScrollView>
    </View>
  );
}
 


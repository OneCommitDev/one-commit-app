import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '~/components/AppInput';
import AppText from '~/components/AppText';
import ArrowButton from '~/components/ArrowButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { clearAllPrefs, PREF_KEYS } from '~/utils/Prefs';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { CreateProfileResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import TestTypeToggle from './multi_info_screens/TestTypeToggle';
import WeightRuler from '~/components/WeightRuler';
import WhiteCustomButton from '~/components/WhiteCustomButton';
import HeightRuler from '~/components/HeightRuler';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const [genderType, setGenderType] = useState<'Male' | 'Female'>('Male');
  const [loading, setLoading] = useState(false);
              const [showWeightModal, setShowWeightModal] = useState(false);
              const [showHeightModal, setShowHeightModal] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    preferredName: '',
    email: '',
    phone: '',
  dob: null as Date | null, // 👈 updated here
    city: '',
    states: '',
    zip: '',
    gender: '',
    weightis: '',
    heightis: '',
  });

  const [dobTemp, setDobTemp] = useState(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleBack = () => {
    navigation.replace('Login');
    clearAllPrefs();
  };

  const ProfileApiRequest = async () => {
    try {
      setLoading(true);
            const email = await getItem(PREF_KEYS.userEmailID);

      const accessToken = await getItem(PREF_KEYS.accessToken);

      const res = await httpRequest2<CreateProfileResponse>(
        Api_Url.userProfile,
        'get',
        { email },
        accessToken ?? '',
      );

      console.log('resresresresres', res);
      if (res.status) {
        console.log('Profile:', res.message);
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
    const fetchProfile = async () => {
      await ProfileApiRequest();
    };
   // fetchProfile();
  }, []);

 


  const isFormValid =
  form.fullName.trim() !== '' &&
  form.preferredName.trim() !== '' &&
  form.email.trim() !== '' &&
  form.phone.trim() !== '' &&
  form.dob !== null && // 👈 changed from instanceof Date
  form.city.trim() !== '' &&
  form.states.trim() !== '' &&
  form.zip.trim() !== '' &&
  form.gender.trim() !== '' &&
  form.weightis.trim() !== '' &&
  form.heightis.trim() !== '';

useEffect(() => {
  const fillFormDefaults = async () => {
    const email = await getItem(PREF_KEYS.userEmailID);

    setForm((prev) => ({
      ...prev,
      preferredName: 'Demo',
      fullName: 'Jhon Doe',
      email: email || '',
      phone: '9876543210',
      weightis: '80',
      heightis: '5.8',
      gender: 'Male',
    }));
  };

  fillFormDefaults();
}, []);



type CityState = { city: string; state: string } | null;

const fetchCityStateFromZip = async (zip: string): Promise<CityState> => {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!response.ok) throw new Error('Invalid ZIP code');

    const data = await response.json();
    const place = data?.places?.[0];

    if (!place) throw new Error('No location data found');

    console.log('ZIP API Result:', place);

    const city = place['place name'] || place['city'] || '';
    const state = place['state'] || place['abbreviation'] || '';

    if (!city || !state) throw new Error('Missing city/state data');

    return { city, state };
  } catch (error) {
    console.error('ZIP lookup failed:', (error as Error).message);
    return null;
  }
};



const formatUSPhoneNumber = (text: string): string => {
  const cleaned = text.replace(/\D/g, ''); // Remove non-digits
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return cleaned;

  const [, area, prefix, line] = match;
  if (prefix) {
    if (line) {
      return `(${area}) ${prefix}-${line}`;
    }
    return `(${area}) ${prefix}`;
  }
  if (area) return `(${area}`;
  return '';
};

const isAtLeast13YearsOld = (date: Date): boolean => {
  const today = new Date();
  const thirteenYearsAgo = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );
  return date <= thirteenYearsAgo;
};



  return (
    <View className="flex-1 px-2 pt-7">
      <View className="flex-row mt-5">
        <TouchableOpacity
          onPress={handleBack}
          className="w-12 h-12 rounded-full bg-[#E3E9E5] items-center justify-center"
        >
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
        extraScrollHeight={100}
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
            className="text-gray-600"
            leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
            onChangeValue={(text) => handleChange('email', text)}
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <AppText text="Phone Number" size="text-base" />
          <AppInput
            value={form.phone}
            leftIcon={<Ionicons name="phone-portrait-sharp" size={20} color="#6B7280" />}
            placeholder="(123) 456-7890"
            keyboardType="phone-pad"
            maxLength={14} // (XXX) XXX-XXXX
            onChangeValue={(text) => {
              const formatted = formatUSPhoneNumber(text);
              handleChange('phone', formatted);
            }}
          />

          <AppText text="Date of Birth" size="text-base" />
          <View className="bg-white px-1 py-1 rounded-full mt-2 mb-2">
            <TouchableOpacity
             onPress={() => {
                if (Platform.OS === 'ios') {
                  setDobTemp(form.dob || new Date(2000, 0, 1)); // fallback if null
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
              <View className="flex-1">
                <AppText text="ZipCode" size="text-base" />
                <AppInput
                  value={form.zip}
                  keyboardType="number-pad"
                  maxLength={5}
                  onChangeValue={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    // Don't allow more than 5 digits
                    if (cleaned.length > 5) return;
                    // Always update ZIP first
                    handleChange('zip', cleaned);

                    // When 5 digits are entered, fetch city/state
                    if (cleaned.length === 5) {
                            Keyboard.dismiss(); 
                      fetchCityStateFromZip(cleaned).then((result) => {
                        if (result) {
                          console.log(`Auto-filled: ${result.city}, ${result.state}`);
                          setForm((prev) => ({
                            ...prev,
                            city: result.city,
                            states: result.state,
                          }));
                        } else {
                          Alert.alert('Invalid ZIP code');
                             setForm((prev) => ({
                            ...prev,
                            city: '',
                            states: '',
                          }));
                        }
                      });
                    }
                  }}
                  placeholder="Zip Code"
                />
               
              </View>

              <View className="flex-1 ml-5">
                <AppText text="State" size="text-base" />
                <AppInput
                  value={form.states}
                    editable={false}
                  onChangeValue={(text) => handleChange('states', text)}
                  placeholder="Enter State"
                />
              </View>
            </View>

            <AppText text="City" size="text-base" />
                   <AppInput
                  value={form.city}
                    editable={false}
                  onChangeValue={(text) => handleChange('city', text)}
                  placeholder="Enter City"
                />
          </View>

          <AppText text="Gender" size="text-base" />
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

          <View className="flex-row space-x-4">
            <View className="flex-1">

              <AppText text="Weight" size="text-base" />
              <AppInput
                value={form.weightis}
                onPress={() => setShowWeightModal(true)}
                editable={false}
                onChangeValue={(text) => handleChange('weightis', text)}
                placeholder="Enter Weight"
              />
            </View>



            <View className="flex-1 ml-5">
              <AppText text="Height" size="text-base" />
              
              <AppInput
              onPress={() => setShowHeightModal(true)}
                value={form.heightis}
                editable={false}
                onChangeValue={(text) => handleChange('heightis', text)}
                placeholder="Enter Height"
              />
            </View>
          </View>

          <View className="mb-24 mt-10">
            <ArrowButton
              text="Save Changes"
              onPress={() => {
                console.log('Saved:', form);
                navigation.navigate('GamesGrid');
              }}
              fullWidth
              disabled={!isFormValid}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* iOS Date Picker Modal */}
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
                  if (isAtLeast13YearsOld(dobTemp)) {
                    handleChange('dob', dobTemp);
                    setShowDatePickerModal(false);
                  } else {
                    Alert.alert('Invalid Date', 'You must be at least 13 years old.');
                  }
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

      {/* Android Date Picker */}
    {showAndroidPicker && Platform.OS === 'android' && (
  <DateTimePicker
    value={form.dob || new Date(2000, 0, 1)} // fallback if dob is null
    mode="date"
    display="default"
    maximumDate={new Date()}
    onChange={(_, date) => {
      setShowAndroidPicker(false);
      if (date) {
        if (isAtLeast13YearsOld(date)) {
          handleChange('dob', date);
        } else {
          Alert.alert('Invalid Date', 'You must be at least 13 years old.');
        }
      }
    }}
  />
)}
 
<Modal
  visible={showWeightModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowWeightModal(false)}
>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    className="flex-1 justify-end bg-black/40"
  >
    <View className="bg-white rounded-t-2xl pt-2">
      {/* Top Header Row */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        {/* Close Icon */}
        <TouchableOpacity onPress={() => setShowWeightModal(false)}>
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Title */}
        <AppText className="text-center text-base font-nunitoextrabold">
          Weight
        </AppText>

        {/* Save / Done Icon */}
        <TouchableOpacity onPress={() => setShowWeightModal(false)}>
          <Ionicons name="checkmark" size={26} color="#235D48" />
        </TouchableOpacity>
      </View>

      {/* Ruler */}
      <View style={{ height: 250 }}>
        <WeightRuler
          initialUnit="lb"
          primaryColor="#235D48"
          secondaryColor="#647067"
          backgroundColor="#eaeded"
          initialValue={Number(form.weightis) || 160}
          onWeightChange={(value, unit) => {
            const formatted = `${value.toFixed(1)} ${unit}`;
            handleChange('weightis', formatted);
          }}
        />
      </View>
    </View>
  </KeyboardAvoidingView>
</Modal>


<Modal
  visible={showHeightModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowHeightModal(false)}
>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    className="flex-1 justify-end bg-black/40"
  >
    <View className="bg-white rounded-t-2xl pt-2">
      {/* Top Header Row */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        {/* Close Icon */}
        <TouchableOpacity onPress={() => setShowHeightModal(false)}>
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Title */}
        <AppText className="text-center text-base font-nunitoextrabold">
          Height
        </AppText>

        {/* Save / Done Icon */}
        <TouchableOpacity onPress={() => setShowHeightModal(false)}>
          <Ionicons name="checkmark" size={26} color="#235D48" />
        </TouchableOpacity>
      </View>

      {/* Ruler */}
      <View style={{ height: 250 }}>
        <HeightRuler
          primaryColor="#235D48"
          secondaryColor="#647067"
          backgroundColor="#eaeded"
          initialValue={Number(form.heightis) || 65} // fallback: 5'5"
          onHeightChange={(inches, formatted) => {
            handleChange('heightis', inches);
            handleChange('heightis', formatted); // optional: for displaying 5'5"
          }}
        />
      </View>
    </View>
  </KeyboardAvoidingView>
</Modal>

    </View>
  );
}

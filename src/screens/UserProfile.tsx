import React, { useEffect, useState } from 'react';
import {  View,  Text,  TouchableOpacity,  ScrollView,  Platform,  Modal,  Alert,  Keyboard,  KeyboardAvoidingView,
  Dimensions,  Pressable,
  Button,} from 'react-native';
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
import { Api_Url, CreateProfileRequest, httpRequest2 } from '~/services/serviceRequest';
import { ProfileResponse, ProfileSaveResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import TestTypeToggle from './multi_info_screens/TestTypeToggle';
import WeightRuler from '~/components/WeightRuler';
import WhiteCustomButton from '~/components/WhiteCustomButton';
import HeightRuler from '~/components/HeightRuler';
 import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { autoformatUSPhoneNumber, cleanPhoneNumber, formatInchesToFeetAndInches, formatUSPhoneNumber, isAtLeast13YearsOld, parseHeightToInches } from '~/utils/AppFunctions';
import CustomDualPicker, { weightValues_kg, weightValues_lb } from '~/components/CustomDualPicker';
import { CustomDualPickerModal } from '~/components/CustomDualPickerModal';
import { HeightPickerModal2 } from '~/components/HeightPickerModal2';
import TitleText from '~/components/TitleText';

 

export default function ProfileScreen() {
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const [showAndroidPicker, setShowAndroidPicker] = useState(false);
const [genderType, setGenderType] = useState<'Male' | 'Female'>('Male');
const [loading, setLoading] = useState(false);
const [showWeightModal, setShowWeightModal] = useState(false);
const [showHeightModal, setShowHeightModal] = useState(false);
type CityState = { city: string; state: string } | null;

  const handleBack = () => {
    navigation.replace('Login');
    clearAllPrefs();
  };

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
      weight_unit: '',  
      height_unit: '',  
  });

  const [dobTemp, setDobTemp] = useState(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm({ ...form, [key]: value });
  };

   const isFormValid =
  (form.fullName || '').trim() !== '' &&
  (form.preferredName || '').trim() !== '' &&
  (form.email || '').trim() !== '' &&
  (form.phone || '').trim() !== '' &&
  form.dob !== null &&
  (form.city || '').trim() !== '' &&
  (form.states || '').trim() !== '' &&
  (form.zip || '').trim() !== '' &&
  (form.gender || '').trim() !== '' &&
  (form.weightis || '').toString().trim() !== '' &&
  (form.heightis || '').toString().trim() !== '';

  


  useEffect(() => {
    const fetchProfile = async () => {
      await ProfileApiRequest();
    };
   fetchProfile();
  }, []);

  const ProfileApiRequest = async () => {
    try {
      setLoading(true);
        const email = await getItem(PREF_KEYS.userEmailID);
        const userId = await getItem(PREF_KEYS.userId);
        const accessToken = await getItem(PREF_KEYS.accessToken);

console.log('accessToken ' , accessToken);

        const profileUrl = Api_Url.userProfile(userId ?? '', email ?? '');
        const res = await httpRequest2<ProfileResponse>(
          profileUrl,
          'get',
          { email },
          accessToken ?? '',
        );

      console.log('resresresresres', res);
      if (res.status) {
        const genderFromAPI = res.data?.gender?.toLowerCase() === 'female' ? 'Female' : 'Male';
          setForm((form) => ({
            ...form,
            fullName: res.data?.full_name ?? '',
            preferredName: res.data?.preferred_name ?? '',
            phone: autoformatUSPhoneNumber(res.data?.phone ?? ''), // 👈 Format here
            dob: res.data?.dob ? new Date(res.data.dob) : null,
            city: res.data?.city ?? '',
            states: res.data?.state ?? '',
            zip: res.data?.zipcode ?? '',
            gender: genderFromAPI,
            //  weightis: res.data?.weight && res.data?.weight_unit  ? `${res.data.weight} ${res.data.weight_unit}`  : '',
             weightis:
  res.data?.weight && res.data?.weight_unit
    ? `${parseFloat(res.data.weight).toFixed(1)} ${res.data.weight_unit}`
    : '',

            heightis: res.data?.height  ? formatInchesToFeetAndInches(Number(res.data.height)) : '',
            height_unit: res.data?.height_unit ?? 'inch',
            weight_unit: res.data?.weight_unit ?? 'lbs',
          }));
          
          console.log('heightheight ',res.data?.height);
      } else {
        Alert.alert('Error', res.message ?? 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const SaveProfileRequest = async () => {
    try {
      setLoading(true);
      const email = await getItem(PREF_KEYS.userEmailID);
      const userId = await getItem(PREF_KEYS.userId);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const profileUrl = Api_Url.userProfile(userId ?? '', email ?? '');

    const requestBody: CreateProfileRequest = {
        full_name: form.fullName,
        preferred_name: form.preferredName,
        phone: cleanPhoneNumber(form.phone),
         dob: form.dob ? format(form.dob, 'yyyy-MM-dd') : '', // ✅ ISO format
        city: form.city,
        state: form.states,
        zipcode: form.zip,
        gender: form.gender,
        weight: form.weightis?.toString().replace(/[^0-9.]/g, '') ?? '',
        weight_unit: form.weight_unit ?? '',
        height: form.heightis ? parseHeightToInches(form.heightis).toString() : '',  // 👈
        height_unit: form.height_unit ?? '',
      };


      console.log('requestBody ', requestBody);

      const res = await httpRequest2<ProfileSaveResponse>(
        profileUrl,
        'post',
        requestBody,
        accessToken ?? '',
        true
      );

      console.log('resresresresres', res);
      if (res.status) {
         navigation.navigate('GamesGrid');
      } else {
        Alert.alert('Error', res.message ?? 'Request failed');
                //  navigation.navigate('GamesGrid');

      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const fillFormDefaults = async () => {
    const email = await getItem(PREF_KEYS.userEmailID);

    setForm((prev) => ({
      ...prev,
      email: email || '',
      gender: 'Male',
    }));
  };

  fillFormDefaults();
}, []);

const fetchCityStateFromZip = async (zip: string): Promise<CityState> => {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!response.ok) throw new Error('Invalid ZIP code');

    const data = await response.json();
    const place = data?.places?.[0];

    if (!place) throw new Error('No location data found');

    console.log('ZIP API Result:', place);

    const city = place['place name'] || place['city'] || '';
    // const state = place['state'] || place['abbreviation'] || '';
    const state =  place['state abbreviation'] || '';

    if (!city || !state) throw new Error('Missing city/state data');

    return { city, state };
  } catch (error) {
    console.error('ZIP lookup failed:', (error as Error).message);
    return null;
  }
};

const screenWidth = Dimensions.get('window').width;
/*
const weightValues_kg = Array.from({ length: 2001 }, (_, i) => ({
  label: (i * 0.1).toFixed(1), // '0.0', '0.1', ..., '200.0'
  value: i * 0.1,
}));

const weightValues_lb = Array.from({ length: 401 }, (_, i) => ({
  label: `${i}`,
  value: i,
}));

const units: ('kg' | 'lb')[] = ['kg', 'lb'];
const [selectedUnit, setSelectedUnit] = useState<'kg' | 'lb'>('lb');

// ⬇️ default indexes
const defaultKgValue = 50;   // in kg
const defaultLbValue = 90;   // in lb

const defaultKgIndex = weightValues_kg.findIndex(
  (item) => item.value === defaultKgValue
);

const defaultLbIndex = weightValues_lb.findIndex(
  (item) => item.value === defaultLbValue
);
 const [tempIndex, setTempIndex] = useState(
  selectedUnit === 'kg' ? defaultKgIndex : defaultLbIndex
);

// If unit changes, reset temporary index
useEffect(() => {
  setTempIndex(selectedUnit === 'kg' ? defaultKgIndex : defaultLbIndex);
}, [selectedUnit]);

*/

 const [selectedUnit, setSelectedUnit] = useState<'kg' | 'lbs'>('lbs');
  const [highlightedKgIndex, setHighlightedKgIndex] = useState(50);
  const [highlightedLbIndex, setHighlightedLbIndex] = useState(90);
  const [tempWeightValue, setTempWeightValue] = useState('');
const [tempWeightUnit, setTempWeightUnit] = useState<'kg' | 'lbs'>('lbs');

  const getSelectedValue = () => {
    return selectedUnit === 'kg'
      ? `${weightValues_kg[highlightedKgIndex]} kg`
      : `${weightValues_lb[highlightedLbIndex]} lbs`;
  };


  const [pickerVisible, setPickerVisible] = useState(false);
const [unit, setUnit] = useState<'kg' | 'lbs'>('lbs'); // ✅ default is lbs

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
          <TitleText text="Full Name"  />
          <AppInput
            value={form.fullName}
            leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
            onChangeValue={(text) => handleChange('fullName', text)}
            placeholder="Enter full name"
          />

          <TitleText text="Preferred Name"  />
          <AppInput
            value={form.preferredName}
            leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
            onChangeValue={(text) => handleChange('preferredName', text)}
            placeholder="Enter preferred name"
          />

          <TitleText text="Email"  />
          <AppInput
            value={form.email}
            editable={false}
            className="text-gray-600"
            leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
            onChangeValue={(text) => handleChange('email', text)}
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <TitleText text="Phone Number"  />
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

          <TitleText text="Date of Birth"  />
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
                <TitleText text="ZipCode"  />
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
                <TitleText text="State"  />
                <AppInput
                  value={form.states}
                    editable={false}
                  onChangeValue={(text) => handleChange('states', text)}
                  placeholder="Enter State"
                />
              </View>
            </View>

            <TitleText text="City"  />
                   <AppInput
                  value={form.city}
                    editable={false}
                  onChangeValue={(text) => handleChange('city', text)}
                  placeholder="Enter City"
                />
          </View>

          <TitleText text="Gender"  />
          <View className="mb-2">
            <TestTypeToggle
              options={['Male', 'Female']}
              initialValue={genderType}
              onSelect={(selected) => {
                setGenderType(selected as 'Male' | 'Female');
                setForm((prev) => ({ ...prev, gender: selected }));
              }}
            />
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">

              <TitleText text="Weight"  />
            <TouchableOpacity onPress={() => setShowWeightModal(true)} activeOpacity={1}>
            <AppInput
              value={form.weightis}
              editable={false}
              placeholder="Enter Weight"
              onChangeValue={(text) => handleChange('weightis', text)}
              onPress={() => setShowWeightModal(true)}
            />
          </TouchableOpacity>


            </View>



            <View className="flex-1 ml-5">
              <TitleText text="Height"  />
              
              {/* <AppInput
              onPress={() => setShowHeightModal(true)}
                value={form.heightis}
                editable={false}
                onChangeValue={(text) => handleChange('heightis', text)}
                placeholder="Enter Height"
              /> */}
             <TouchableOpacity onPress={() => setShowHeightModal(true)} activeOpacity={1}>
            <AppInput
              value={form.heightis}
              editable={false}
              placeholder="Enter Height"
              onChangeValue={(text) => handleChange('heightis', text)}
              onPress={() => setShowHeightModal(true)}
            />
          </TouchableOpacity>

 



            </View>
          </View>

          <View className="mb-24 mt-10">
            <ArrowButton
              text="Save Changes"
              onPress={() => {
                SaveProfileRequest();
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
 


            <CustomDualPickerModal
              visible={showWeightModal}
              onClose={() => setShowWeightModal(false)}
              selectedUnit={selectedUnit}
              onUnitChange={(newUnit) => {
                setSelectedUnit(newUnit);
              }}
              onSave={(main, decimal, unit) => {
                const selectedWeight = `${main}.${decimal} ${unit}`;

                handleChange('weightis', selectedWeight);
                handleChange('weight_unit', unit);

                setForm((prev) => ({
                  ...prev,
                  weightis: selectedWeight,
                  weight_unit: unit,
                }));

                setShowWeightModal(false); // close after save
              }}
            />

          <HeightPickerModal2
            visible={showHeightModal}
            onClose={() => setShowHeightModal(false)}
            onSave={(feet, inches) => {
              const formatted = `${feet}'${inches}"`;

              // Save height as formatted string (e.g., 5'6") and unit as "inch"
              setForm((prev) => ({
                ...prev,
                heightis: formatted,
                height_unit: 'feet_inches',
              }));

              // Close modal after a small delay to ensure state is applied
              setTimeout(() => setShowHeightModal(false), 50);
            }}
          />




          {/* <HeightPickerModal
            visible={showHeightModal}
            onClose={() => setShowHeightModal(false)}
            form={form}
            handleChange={handleChange}
          /> */}



    </View>
  );
}



// <Modal
//   visible={showWeightModal}
//   transparent
//   animationType="slide"
//   onRequestClose={() => setShowWeightModal(false)}
// >
//   <KeyboardAvoidingView
//     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     className="flex-1 justify-end bg-black/40"
//   >
//     <View className="bg-white rounded-t-2xl pt-2">
//       {/* Top Header Row */}
//       <View className="flex-row items-center justify-between mb-4 px-2">
//         {/* Close Icon */}
//         <TouchableOpacity onPress={() => setShowWeightModal(false)}>
//           <Ionicons name="close" size={24} color="#111827" />
//         </TouchableOpacity>

//         {/* Title */}
//         <AppText className="text-center text-base font-nunitoextrabold">
//           Weight
//         </AppText>

//         {/* Save / Done Icon */}
//         <TouchableOpacity onPress={() => setShowWeightModal(false)}>
//           <Ionicons name="checkmark" size={26} color="#235D48" />
//         </TouchableOpacity>
//       </View>

//       {/* Ruler */}
//       <View style={{ height: 250 }}>
//         <WeightRuler
//           initialUnit="lb"
//           primaryColor="#235D48"
//           secondaryColor="#647067"
//           backgroundColor="#eaeded"
//           initialValue={Number(form.weightis) || 160}
//           onWeightChange={(value, unit) => {
//             const formatted = `${value.toFixed(1)} ${unit}`;
//             handleChange('weightis', formatted);
//           }}
//         />
//       </View>
//     </View>
//   </KeyboardAvoidingView>
// </Modal>






{/* <Modal
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
      <View className="flex-row items-center justify-between mb-4 px-2">
        <TouchableOpacity onPress={() => setShowHeightModal(false)}>
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>

        <AppText className="text-center text-base font-nunitoextrabold">
          Height
        </AppText>

        <TouchableOpacity onPress={() => setShowHeightModal(false)}>
          <Ionicons name="checkmark" size={26} color="#235D48" />
        </TouchableOpacity>
      </View>

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
</Modal> */}

 
 {/* <WheelPickerExpo
        key={selectedUnit}
        height={250}
        width={screenWidth}
        items={selectedUnit === 'kg' ? weightValues_kg : weightValues_lb}
        initialSelectedIndex={tempIndex}
        onChange={({ index }) => setTempIndex(index)} // just store temp value
        backgroundColor="#eaeded"
        selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
      /> */}
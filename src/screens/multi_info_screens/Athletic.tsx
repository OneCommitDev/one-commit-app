import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';
import { Ionicons } from '@expo/vector-icons';
import TestTypeToggle from './TestTypeToggle';
import { CustomPickerModal } from '~/components/CustomPickerModal';
import { TimePickerModal } from '~/components/TimePickerModal';
import { getItem } from 'expo-secure-store';
import { Api_Url, base_url_images, httpRequest2 } from '~/services/serviceRequest';
import { AcademicResponse, GetSportsAlldata } from '~/services/DataModals';
import Loader from '~/components/Loader';
import { PREF_KEYS } from '~/utils/Prefs';

type Props = {
  onNext?: () => void;
};

type InputItem = {
  key: string;
  label: string;
  placeholder: string;
  type: string;
};

type Section = {
  title: string;
  img : string;
  inputs: InputItem[];
};

 

const MAX_CHARS = 500;

const Athletic: React.FC<Props> = ({ onNext }) => {
  const [form, setForm] = useState<Record<string, {
    feet: undefined;
    inches: undefined; input: string; selected?: string 
}>>({});
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [activePickerKey, setActivePickerKey] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
const [sections, setSections] = useState<Section[]>([]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], input: value },
    }));
  };

  const handleSelect = (key: string, selected: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], selected },
    }));
  };

  const isFormValid = sections.every((section) =>
    section.inputs.every((input) => form[input.key]?.input?.trim().length)
  );

  const handleSubmit = () => {
    const charCount = form['additional']?.input?.length || 0;
    if (charCount > MAX_CHARS) {
      Alert.alert('Character Limit Exceeded', `Please limit your response to ${MAX_CHARS} characters.`);
      return;
    }
    onNext?.();
  };

  const metricOptions = ['Metric', 'Imperial'];
  const pickerDataMap: Record<string, { key: string; label: string; value: string }[]> = sections.reduce(
    (acc, section) => {
      section.inputs.forEach((input) => {
        if (input.type !== 'time') {
          acc[input.key] = metricOptions.map((val) => ({
            key: val.toLowerCase(),
            label: val,
            value: val,
          }));
        }
      });
      return acc;
    },
    {} as Record<string, { key: string; label: string; value: string }[]>
  );



  useEffect(() => {
    const fetchAthletic = async () => {
      await AthleticApiRequest();
    };
    fetchAthletic();
  }, []);

 const AthleticApiRequest = async () => {
  try {
    setLoading(true);
    const accessToken = await getItem(PREF_KEYS.accessToken);
    const profileUrl = Api_Url.save_sports;

    const res = await httpRequest2<GetSportsAlldata>(
      profileUrl,
      'get',
      {},
      accessToken ?? ''
    );

     

    const img_url = base_url_images;
    if (res.status && res.sportUserData) {
      const transformedSections: Section[] = res.sportUserData.map((sport) => ({
        title: sport.display_name,
        img: `${base_url_images}${sport.img_path?.startsWith('/') ? sport.img_path.slice(1) : sport.img_path}`,
        inputs: (sport.events || []).map((event) => ({
          key: event.event_name,
          label: event.display_name,
          placeholder: `Enter value in ${event.measurement_unit || ''}`,
          type: event.measurement_type || '',
        })),
      }));

      setSections(transformedSections);
    } else {
      Alert.alert('Error', res.message ?? 'Something went wrong');
    }
  } catch (err) {
    Alert.alert('Error', 'Unexpected error occurred.');
  } finally {
    setLoading(false);
  }
};




 

  return (
    <KeyboardAvoidingView
      className="bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
            <Loader show={loading} />
      
      {activePickerKey && (
        <CustomPickerModal
          visible={showCustomPicker}
          title={`Select ${sections
            .flatMap((s) => s.inputs)
            .find((input) => input.key === activePickerKey)?.label || ''}`}
          data={pickerDataMap[activePickerKey] || []}
          initialValue={form[activePickerKey]?.selected || ''}
          onClose={() => {
            setShowCustomPicker(false);
            setActivePickerKey(null);
          }}
          onSave={(selected) => {
            if (activePickerKey) {
              handleSelect(activePickerKey, selected.value);
              setShowCustomPicker(false);
              setActivePickerKey(null);
            }
          }}
        />
      )}

      <TimePickerModal
        visible={showTimePicker}
        initialValue={{ minutes: 0, seconds: 0, milliseconds: 0 }}
        onClose={() => setShowTimePicker(false)}
        onSave={(selected) => {
          const formatted = `${selected.minutes.toString().padStart(2, '0')}:${selected.seconds
            .toString()
            .padStart(2, '0')}:${selected.milliseconds.toString().padStart(2, '0')}`;
          if (activePickerKey) {
            handleSelect(activePickerKey, formatted);
            setShowTimePicker(false);
            setActivePickerKey(null);
          }
        }}
      />

      <FlatList
        data={sections}
        keyExtractor={(section) => section.title}
        ListFooterComponent={
          <View className="px-4">
            <View className="mb-5 -mt-3">
              <AppText>Meet Highlight Link (optional)</AppText>
              <AppInput
                value={form['videoLink']?.input || ''}
                keyboardType="default"
                multiline
                numberOfLines={4}
                onChangeValue={(text) => handleChange('videoLink', text)}
                placeholder="Meet Highlight Link"
                className="h-24"
                textAlignVertical="top"
                onFocus={() => setFocusedKey('videoLink')}
                onBlur={() => setFocusedKey(null)}
              />
            </View>

            <View className="mb-5 -mt-3">
              <AppText>Any additional information</AppText>
              <AppInput
                value={form['additional']?.input || ''}
                keyboardType="default"
                multiline
                numberOfLines={4}
                onChangeValue={(text) => handleChange('additional', text)}
                placeholder="Any additional information..."
                className="h-24"
                textAlignVertical="top"
                onFocus={() => setFocusedKey('additional')}
                onBlur={() => setFocusedKey(null)}
              />
              <View className="flex-row justify-end mt-1">
                <Text
                  className={`text-xs text-right ${
                    (form['additional']?.input?.length || 0) > MAX_CHARS
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {(form['additional']?.input?.length || 0)}/{MAX_CHARS}
                </Text>
              </View>
            </View>

            <ArrowButton text="Continue" onPress={handleSubmit} fullWidth disabled={!isFormValid} />
          </View>
        }
        renderItem={({ item: section }) => (
          <View className="mb-8 bg-[#f7f9f9] rounded-2xl px-5 py-5 border border-gray-300">
               <View className="flex-row items-center mb-2 px-1">
            <View className='h-14 w-14 mr-3 rounded-full mt-2 -ml-1'>
              <Image
              source={{ uri: section.img }}
              className="h-12 w-12 mr-2 rounded-full"
              resizeMode="cover"
            />



            </View>
              <AppText
                text={section.title}
                size="text-20"
                color="text-primary"
                fontFamily="font-nunitoextrabold"
              />
            </View>
                  <View className="border-t border-gray-300 mx-2 mb-4" />

            {/* {section.inputs.map(({ key, label, placeholder, type }, idx) => (
              <View key={key}>
                <View className="mb-4 px-2">
                  <View className="flex-row items-center justify-between mb-2">
                    <AppText>{label}</AppText>
                    <TouchableOpacity
                      onPress={() => {
                        setActivePickerKey(key);
                        if (type === 'time') {
                          setShowTimePicker(true);
                        } 
                       else  if (type === 'distance') {
                         } 
                       else  if (type === 'height') {
                           setShowTimePicker(true);
                        } 
                        else {
                          setShowCustomPicker(true);
                        }
                      }}
                      className="px-4 py-2 rounded-full"
                    >
                      <View className="flex-row items-center border border-gray-300 px-2 py-1 rounded-md -mr-3 mt-2">
                      <Text className="text-light font-semibold text-sm mr-1">
                          {form[key]?.selected ||
                     (type === 'distance' ? 'Distance' :  type === 'height' ? 'Height' : type === 'time' ? '00:00:00' : 'Select')}
                      </Text>
                     
                    </View>
                    </TouchableOpacity>
                  </View>
                 <View className='-mt-3'> 
                   <AppInput
                    value={form[key]?.input || ''}
                    onPressIn={() => {
                      setActivePickerKey(key);
                    }}
                    placeholder={placeholder}
                    onChangeValue={(text) => handleChange(key, text)}
                  />
                 </View>
                </View>

                {idx < section.inputs.length - 1 && (
                  <View className="border-t border-gray-300 mx-2 mb-4" />
                )}
              </View>
            ))} */}

 {section.inputs.map(({ key, label, placeholder, type }, idx) => (
  <View key={key}>
    <View className="mb-4 px-2">
      <View className="flex-row items-center justify-between mb-2">
        <AppText className='mr-5'>{label}</AppText>

        {/* Buttons based on type */}
        {type === 'distance' || type === 'height' ? (
          <View className="flex-row mt-2 w-[50%] border border-gray-300 rounded-full overflow-hidden">
            {/* Feet Button */}
            <TouchableOpacity
              onPress={() => {
                setActivePickerKey(`${key}_feet`);
                //setShowHeightPicker(true); // Opens feet picker
              }}
              className="flex-1 px-4 py-2"
              style={{
                backgroundColor: form[key]?.feet ? '#D1FAE5' : '#fff',
                borderRightWidth: 1,
                borderColor: '#ccc',
              }}
            >
              <Text className="text-center text-sm font-semibold">
                {form[key]?.feet !== undefined ? `${form[key].feet} ft` : 'Feet'}
              </Text>
            </TouchableOpacity>

            {/* Inches Button */}
            <TouchableOpacity
              onPress={() => {
                setActivePickerKey(`${key}_inches`);
               // setShowHeightPicker(true); // Opens inches picker
              }}
              className="flex-1 px-4 py-2"
              style={{
                backgroundColor: form[key]?.inches ? '#D1FAE5' : '#fff',
              }}
            >
              <Text className="text-center text-sm font-semibold">
                {form[key]?.inches !== undefined ? `${form[key].inches} in` : 'Inches'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : type === 'time' ? (
          <TouchableOpacity
            onPress={() => {
              setActivePickerKey(key);
              setShowTimePicker(true);
            }}
            className="px-4 py-2 border border-gray-300 rounded-full mt-2"
          >
            <Text className="text-sm font-semibold">
              {form[key]?.selected || '00:00:00'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setActivePickerKey(key);
              setShowCustomPicker(true);
            }}
            className="px-4 py-2 border border-gray-300 rounded-full mt-2"
          >
            <Text className="text-sm font-semibold">
              {form[key]?.selected || 'Select'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Optional text input if needed */}
      <View className="-mt-3">
        <AppInput
          value={form[key]?.input || ''}
          onPressIn={() => {
            setActivePickerKey(key);
          }}
          placeholder={placeholder}
          onChangeValue={(text) => handleChange(key, text)}
        />
      </View>
    </View>

    {idx < section.inputs.length - 1 && (
      <View className="border-t border-gray-300 mx-2 mb-4" />
    )}
  </View>
))}



            
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
};

export default Athletic;
// --- Your imports and types remain unchanged ---
import React, { useEffect, useState } from 'react';
import {  View,  Image,  FlatList,  Text,  Alert,  KeyboardAvoidingView,  Platform,  TouchableOpacity, InteractionManager,} from 'react-native';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';
import { CustomPickerModal } from '~/components/CustomPickerModal';
import { TimePickerModal } from '~/components/TimePickerModal';
import { getItem } from 'expo-secure-store';
import { Api_Url, base_url_images, httpRequest2 } from '~/services/serviceRequest';
import { GetSportsAlldata, HoldSportsdata, SavedSportResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
import { PREF_KEYS } from '~/utils/Prefs';
import { HeightPickerModal2 } from '~/components/HeightPickerModal2';
import { NumberPickerModal } from '~/components/NumberPickerModal';
import { Applog } from '~/utils/logger';
import TitleText from '~/components/TitleText';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  onNext?: () => void;
  stepToEdit?: any;
    goToLastStep?: () => void;
};

type InputItem = {
  key: string;
  label: string;
  placeholder: string;
  type: string;
  value : string;
};

type Section = {
  title: string;
  img: string;
  inputs: InputItem[];
};

const MAX_CHARS = 500;

const Athletic: React.FC<Props> = ({ onNext , stepToEdit , goToLastStep}) => {
  const [form, setForm] = useState<
    Record<
      string,
      {
        feet?: any;
        meters?: any;
        input: string;
        selected?: string;
        selectedUnit?: 'feet_inches' | 'meters';
      }
    >
  >({});

  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [activePickerKey, setActivePickerKey] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [heightInputKey, setHeightInputKey] = useState<string | null>(null);
  const [showMeterModal, setShowMeterModal] = useState(false);
  const [meterInputKey, setMeterInputKey] = useState<string | null>(null);
// const [rawSportData, setRawSportData] = useState<GetSportsAlldata['sportUserData']>([]);
const [rawSportData, setRawSportData] = useState<
  GetSportsAlldata['data']['sportUserFormattedData']
>([]);

  const [events, setEvents] = useState<HoldSportsdata[]>([]);

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

  // const handleSubmit = () => {
  //   const charCount = form['additional']?.input?.length || 0;
  //   if (charCount > MAX_CHARS) {
  //     Alert.alert('Character Limit Exceeded', `Please limit your response to ${MAX_CHARS} characters.`);
  //     return;
  //   }
  //   // onNext?.();
  //   const temp_data = sections;
  //  // SaveApiRequest(temp_data);
  //  console.log(temp_data);
  // };







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
/*
 useEffect(() => {
  let mounted = true;

  const fetchAthletic = async () => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const res = await httpRequest2<GetSportsAlldata>(
        Api_Url.save_sports,
        'get',
        {},
        accessToken ?? ''
      );

      if (mounted && res.status && res.data.sportUserFormattedData) {
        // 1. Save raw data
        setRawSportData(res.data.sportUserFormattedData);

        // 2. Transform to FlatList-friendly format
        const transformedSections: Section[] = res.data.sportUserFormattedData.map((sport) => ({
          title: sport.display_name,
          img: `${base_url_images}${sport.img_path?.startsWith('/') ? sport.img_path.slice(1) : sport.img_path}`,
          inputs: (sport.events || []).map((event) => ({
            key: event.event_name,
            label: event.display_name,
            placeholder: `Enter value in ${event.measurement_unit || ''}`,
            type: event.measurement_type || '',
            value : event.eventValue || '',
          })),
        }));
        setSections(transformedSections);

        // 3. Initialize form state
        const initialForm: typeof form = {};
        res.data.sportUserFormattedData.forEach((sport) => {
          sport.events?.forEach((event) => {
            const key = event.event_name;
            const type = event.measurement_type;
            const eventValue = event.eventValue;

            initialForm[key] = {
              input: eventValue,  
              selected: '',
              selectedUnit: (type === 'height' || type === 'distance') ? undefined : undefined,
              feet: '',
              meters: '',
            };
          });
        });

        

        // // Additional keys (videoLink and additional info)
        // initialForm['videoLink'] = { input: '' };
        // initialForm['additional'] = { input: '' };

        // Additional keys (videoLink and additional info)
          initialForm['videoLink'] = { input: res.data.media_links || '' };
          initialForm['additional'] = { input: res.data.additional_links || '' };


        setForm(initialForm);
      }
    } catch (err) {
      console.log('Error fetching athletic data', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      if (mounted) setLoading(false);
    }
  };

   //fetchAthletic();


  return () => {
    mounted = false;
  };
}, []);
*/
  
/*
useFocusEffect(
  React.useCallback(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchAthletic();
    });

    return () => task.cancel();
  }, [])
);
*/
useFocusEffect(
  React.useCallback(() => {
    fetchAthletic();
    return () => {};
  }, [])
);
/*
useFocusEffect(
  React.useCallback(() => {
 const task = InteractionManager.runAfterInteractions(() => {
  try {
    fetchAthletic();
  } catch (e) {
    console.log('InteractionManager error:', e);
  }
});


    return () => task.cancel();
  }, [])
);
*/

  const fetchAthletic = async () => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const res = await httpRequest2<GetSportsAlldata>(
        Api_Url.save_sports,
        'get',
        {},
        accessToken ?? ''
      );

      if (res.status && res.data.sportUserFormattedData) {
        // 1. Save raw data
        setRawSportData(res.data.sportUserFormattedData);

        // 2. Transform to FlatList-friendly format
        const transformedSections: Section[] = res.data.sportUserFormattedData.map((sport) => ({
          title: sport.display_name,
          // img: `${base_url_images}${sport.img_path?.startsWith('/') ? sport.img_path.slice(1) : sport.img_path}`,
          img: `${base_url_images}${
  (sport.img_path?.startsWith('/') 
    ? sport.img_path.slice(1) 
    : sport.img_path
  )?.replace(/^v1\//, '') // remove v1/ at the start if present
}`,

          inputs: (sport.events || []).map((event) => ({
            key: event.event_name,
            label: event.display_name,
            placeholder: `Enter value in ${event.measurement_unit || ''}`,
            type: event.measurement_type || '',
            value : event.eventValue || '',
          })),
        }));
        setSections(transformedSections);

        // 3. Initialize form state
        const initialForm: typeof form = {};
        res.data.sportUserFormattedData.forEach((sport) => {
          sport.events?.forEach((event) => {
            const key = event.event_name;
            const type = event.measurement_type;
            const eventValue = event.eventValue;

            initialForm[key] = {
              input: eventValue,  
              selected: '',
              selectedUnit: (type === 'height' || type === 'distance') ? undefined : undefined,
              feet: '',
              meters: '',
            };
          });
        });

        

        // // Additional keys (videoLink and additional info)
        // initialForm['videoLink'] = { input: '' };
        // initialForm['additional'] = { input: '' };

        // Additional keys (videoLink and additional info)
          initialForm['videoLink'] = { input: res.data.media_links || '' };
          initialForm['additional'] = { input: res.data.additional_links || '' };


        setForm(initialForm);
      }
    } catch (err) {
      console.log('Error fetching athletic data', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };


const handleSubmit = () => {
  const charCount = form['additional']?.input?.length || 0;
  if (charCount > MAX_CHARS) {
    Alert.alert('Character Limit Exceeded', `Please limit your response to ${MAX_CHARS} characters.`);
    return;
  }

  // Build the payload
  const sportsDataToSave: {
    sport_id: number;
    event_id: number;
    eventValue: string;
    eventUnit: string;
  }[] = [];


  rawSportData.forEach((sport) => {
    sport.events?.forEach((event) => {
      const userEntry = form[event.event_name];
      if (userEntry?.input) {
        sportsDataToSave.push({
          sport_id: sport.sport_id,
          event_id: event.event_id,
          eventValue: userEntry.input,
          eventUnit:
            event.measurement_type === 'time'
              ? 'seconds' :  event.measurement_type === 'points'
              ? 'points'
              : userEntry.selectedUnit === 'meters'
              ? 'meters'
              : 'feet_inches',
        });
      }
    });
  });


  const payload = {
    sports_profile: JSON.stringify(sportsDataToSave),
    additional_info: form['additional']?.input || '',
    media_links: form['videoLink']?.input || '',
      ...(stepToEdit != null && { ui_flow: 'profile_edit' })  
  };

 

  SaveApiRequest(payload);  
};
  const SaveApiRequest = async (allData: any) => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      if (allData.length === 0) {
        Alert.alert('Error', 'No valid events selected.');
        return;
      }

      

      const payload = JSON.stringify(allData);

      

      const res = await httpRequest2<SavedSportResponse>(
        Api_Url.save_sports,
        'post',
        allData,
        accessToken ?? '',
        true
      );

      console.log('reseseeses' , res);

      if (res.status) {
         setTimeout(() => {
          if(stepToEdit != null){
            goToLastStep?.();
          }else{
            onNext?.();
          }
        }, 300);
      } else {
        Alert.alert('Error', res.message ?? 'Failed to submit.');
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

      <HeightPickerModal2
        title="Select Feet"
        visible={showHeightModal}
        onClose={() => setShowHeightModal(false)}
        onSave={(feet, inches) => {
          const formatted = `${feet}'${inches}"`;
          if (heightInputKey) {
            setForm((prev) => ({
              ...prev,
              [heightInputKey]: {
                ...prev[heightInputKey],
                input: formatted,
                feet: `${feet}'${inches}"`,
              },
            }));
          }
          setTimeout(() => setShowHeightModal(false), 50);
        }}
      />

    <NumberPickerModal  title="Select Meters"
        visible={showMeterModal}
        onClose={() => setShowMeterModal(false)}
        onSave={(meters, decimal) => {
          const formatted = `${meters}.${decimal}`;
          if (meterInputKey) {
            setForm((prev) => ({
              ...prev,
              [meterInputKey]: {
                ...prev[meterInputKey],
                input: formatted,
                meters: `${meters}.${decimal}`,
              },
            }));
          }
          setTimeout(() => setShowMeterModal(false), 50);
        }}
        />


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
            setForm((prev) => ({
              ...prev,
              [activePickerKey]: {
                ...(prev[activePickerKey] || {}),
                input: formatted,
              },
            }));
            setShowTimePicker(false);
            setActivePickerKey(null);
          }
        }}
      />

      <FlatList
        data={sections}
          scrollIndicatorInsets={{ right: 1 }}  
           /* ---- SCROLLBAR FIX / OPTIONS ---- */
        //  showsVerticalScrollIndicator={false}   
        automaticallyAdjustsScrollIndicatorInsets={false}
        keyExtractor={(section) => section.title}
        ListFooterComponent={
  <View className="px-4">
    <View className="mb-5 -mt-3">
      <TitleText>Meet Highlight Link (optional)</TitleText>
      <AppInput
        value={form['videoLink']?.input || ''}
        keyboardType="default"
        multiline
        numberOfLines={4}
        onChangeValue={(text) => handleChange('videoLink', text)}
        placeholder="Meet Highlight Link"
        className="h-24"
        textAlignVertical="top"
      />
    </View>

    <View className="mb-5 -mt-3">
      <TitleText>Any additional information</TitleText>
      <AppInput
        value={form['additional']?.input || ''}
        keyboardType="default"
        multiline
        numberOfLines={4}
        onChangeValue={(text) => handleChange('additional', text)}
        placeholder="Any additional information..."
        className="h-24"
        textAlignVertical="top"
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
              <Image
                source={{ uri: section.img }}
                className="h-12 w-12 mr-2 rounded-1 xl"
                resizeMode="cover"
              />
              <TitleText
                text={section.title}
              />
            </View>
            <View className="border-t border-gray-300 mx-2 mb-4" />

            {section.inputs.map(({ key, label, placeholder, type , value }, idx) => (
              <View key={key}>
                <View className="mb-4 px-2">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className='flex-1'>
                       <AppText className="mr-5">{label} </AppText>

                      </View>

                    {type === 'distance' || type === 'height' ? (
                      <View className="flex-row mt-2 w-[50%] border border-gray-300 rounded-full overflow-hidden">
                        <TouchableOpacity
                          onPress={() => {
                            setForm((prev) => ({
                              ...prev,
                              [key]: {
                                ...prev[key],
                                selectedUnit: 'feet_inches',
                              },
                            }));
                            setHeightInputKey(key);
                            setShowHeightModal(true);
                          }}
                          className="flex-1 px-4 py-2"
                          style={{
                            backgroundColor: form[key]?.selectedUnit === 'feet_inches' ? '#D1FAE5' : '#fff',
                            borderRightWidth: 1,
                            borderColor: '#ccc',
                          }}
                        >
                          <AppText>Feet</AppText>
                        </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setForm((prev) => ({
                            ...prev,
                            [key]: {
                              ...prev[key],
                              selectedUnit: 'meters',
                            },
                          }));
                          setMeterInputKey(key); // <-- this MUST be set before opening modal
                          setShowMeterModal(true); // <-- this opens the meter picker
                         }}
                        className="flex-1 px-4 py-2"
                        style={{
                          backgroundColor: form[key]?.selectedUnit === 'meters' ? '#D1FAE5' : '#fff',
                        }}
                      >
                        <AppText className="text-center">Meters</AppText>
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
                        <Text className="text-sm font-semibold">00:00:00</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setActivePickerKey(key);
                          setShowCustomPicker(true);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-full mt-2"
                      >
                        <AppText>
                          {form[key]?.selected || 'Points'}
                        </AppText>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View className="-mt-3">
                  {(type === 'time' || type === 'height' || type === 'distance') ? (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => {
      if (type === 'time') {
        setActivePickerKey(key);
        setShowTimePicker(true);
      } else if (type === 'height' || type === 'distance') {
        const selectedUnit = form[key]?.selectedUnit;

        if (selectedUnit === 'feet_inches') {
          setHeightInputKey(key);
          setShowHeightModal(true);
        } else if (selectedUnit === 'meters') {
          setMeterInputKey(key);
          setShowMeterModal(true);
        } else {
          Alert.alert('Select Unit', 'Please select Feet or Meters before entering value.');
        }
      }
    }}
  >
    <AppInput
                          value={form[key]?.input || value}
                          placeholder={placeholder}
                          editable={false} 
                          pointerEvents="none" 
                          onChangeValue={function (val: string): void {
                             
                          } }    />
  </TouchableOpacity>
) : (
  <AppInput
    value={form[key]?.input || value}
    placeholder={placeholder}
    editable={type === 'points'}
    onChangeValue={(text) => handleChange(key, text)}
  />
)}

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
 


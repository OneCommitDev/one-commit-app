import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import {
  Api_Url,
  httpRequest2,
} from '~/services/serviceRequest';
import { PREF_KEYS } from '~/utils/Prefs';
import { EventsResponse, SavedSportResponse } from '~/services/DataModals';
import AppText from '~/components/AppText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './MultiStepSurvey';
import LoaderModal from '~/components/LoaderModal';

export type HoldSportsdata = {
  event_id: any;
  sport_id: string;
  display_name: string;
  event_category: string;
  gender: string;
  measurement_type: string;
  measurement_unit: string;
  user_selected: string;
  event_value: string;
  event_unit: string;
  selected: boolean;
};

type Props = {
  sportName: string;
  sportId: string;
  searchText: string;
  setSearchText: (text: string) => void;
  step: number;
  onNext?: () => void;
  selectedGames: { sportName: string; sportId: string }[];
  goToLastStep?: () => void;
  stepToEdit?: any;
  gotToPersonalRecordForcefully?: () => void;
    navigation?: NativeStackNavigationProp<RootStackParamList>  
};

export default function SelectedGames({
  sportName,
  sportId,
  searchText,
  setSearchText,
  step,
  onNext,
  selectedGames,
  goToLastStep,
  stepToEdit,
  gotToPersonalRecordForcefully,
  navigation,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<HoldSportsdata[]>([]);

  const cachedSportsData = useRef<{ [sportId: string]: any[] }>({});

  useEffect(() => {
    setSearchText('');
    const fetchAPIRequest = async () => {
      try {
        setLoading(true);
        setEvents([]);
        const accessToken = await getItem(PREF_KEYS.accessToken);

        const res = await httpRequest2<EventsResponse>(
          Api_Url.sportsEvents(sportId),
          'get',
          {},
          accessToken ?? '',
        );

        if (res.status && res.data) {
          const parsedEvents: HoldSportsdata[] = res.data.map((event) => ({
            event_id: event.event_id,
            sport_id: sportId,
            display_name: event.display_name,
            event_category: event.event_category,
            gender: event.gender,
            measurement_type: event.measurement_type,
            measurement_unit: event.measurement_unit,
            user_selected: event.user_selected,
            event_value: event.event_value,
            event_unit: event.event_unit,
            selected: event.user_selected === '1',
          }));
          setEvents(parsedEvents);
            setLoading(false);
        } else {
            setLoading(false);
          Alert.alert('Error', res.message ?? 'Something went wrong');
        }
      } catch (err) {
        Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchAPIRequest();
  }, [sportName]);

  const toggleSelection = (displayName: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.display_name === displayName ? { ...e, selected: !e.selected } : e
      )
    );
  };

  const handleSubmit = async (allData: any[]) => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);

      if (allData.length === 0) {
        Alert.alert('Error', 'No valid events selected.');
        return;
      }

      const payload = {
        sports_profile: JSON.stringify(allData),
        additional_info: '',
        media_links: '',
          ...(stepToEdit != null && { ui_flow: 'profile_edit' , ui_flow_data : sportId })  
      };

      const res = await httpRequest2<SavedSportResponse>(
        Api_Url.save_sports,
        'post',
        payload,
        accessToken ?? '',
        true
      );

      if (res.status) {
             setLoading(false);
         setTimeout(() => {
          // if( stepToEdit != null || stepToEdit != 0){
          //  gotToPersonalRecordForcefully?.();
          // }else{
          //     //  onNext?.();
          //      navigation?.navigate('Athletic' , {selectedGames : selectedGames, stepToEdit : null , currentSteps : 5});
          //  }
          if( stepToEdit != null || stepToEdit != undefined){
            navigation?.navigate('Athletic' , {selectedGames : selectedGames, stepToEdit : 1 , currentSteps : 5});
          }else{
            navigation?.navigate('Athletic' , {selectedGames : selectedGames, stepToEdit : null , currentSteps : 5});
          }
          
        }, 500);
        
      } else {
        Alert.alert('Error', res.message ?? 'Failed to submit.');
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const selectedEvents = events.filter((e) => e.selected);
    if (selectedEvents.length === 0) {
      Alert.alert('Error', 'Please select at least one event.');
      return;
    }

    const mappedData = selectedEvents.map((e) => ({
      sport_id: e.sport_id,
      event_id: e.event_id,
      eventValue: e.event_value,
      eventUnit: e.event_unit,
    }));

    // Save current step's selected sport data
    cachedSportsData.current[sportId] = mappedData;

    // if (step === selectedGames.length - 1) {
    //   const allCached = Object.values(cachedSportsData.current).flat();
    //  await handleSubmit(allCached);
    // } else {
    //   onNext?.();
    // }

 
        if( stepToEdit != null){
            const allCached = Object.values(cachedSportsData.current).flat();
            await handleSubmit(allCached);
        }else{
          if (step === selectedGames.length - 1) {
           const allCached = Object.values(cachedSportsData.current).flat();
           await handleSubmit(allCached);
          } else {
           onNext?.();
          }
        }
  };

  const filtered = events.filter((opt) =>
    opt.display_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <View className="flex-row items-center bg-white h-14 rounded-full px-4 mb-2">
        <LoaderModal show={loading} />
        <TextInput
          className="flex-1 py-2 text-black"
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color="gray" />
      </View>

      {filtered.length === 0 && !loading ? (
        <Text className="text-center text-gray-500 mt-4">No events found</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.event_id.toString()}
          renderItem={({ item }) => {
            const isChecked = item.selected;
            return (
              <TouchableOpacity
                onPress={() => toggleSelection(item.display_name)}
                className="flex-row justify-between items-center px-4 py-3 mb-2"
              >
               <View className='flex-1 mr-10'>
                 <AppText>{item.display_name}</AppText>
               </View>
                <View
                  className={`w-6 h-6 rounded-lg items-center justify-center border ${
                    isChecked
                      ? 'bg-green-900 border-green-600'
                      : 'bg-white border-gray-400'
                  } shadow-sm`}
                >
                  {isChecked && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {events.filter((e) => e.selected).length > 0 && (
        <View className="mt-1 px-1 py-1">
          <AppText className=" mb-2">Selected:</AppText>
          <View className="flex-row flex-wrap gap-1">
            {events
              .filter((e) => e.selected)
              .map((item) => (
                <TouchableOpacity
                  key={item.event_id}
                  onPress={() => toggleSelection(item.display_name)}
                  className="flex-row items-center px-4 py-2 bg-gray-200 rounded-full"
                >
                  <AppText className="text-pretty mr-1">{item.display_name}</AppText>
                  <Ionicons name="close" size={14} color="#065F46" />
                </TouchableOpacity>
              ))}
          </View>
        </View>
      )}

      {!loading && (
        <View className="px-2 py-4 mb-20">
          <ArrowButton
            text="Continue"
            fullWidth
            disabled={events.filter((e) => e.selected).length === 0}
            onPress={handleContinue}
          />
        </View>
      )}
    </>
  );
}
 
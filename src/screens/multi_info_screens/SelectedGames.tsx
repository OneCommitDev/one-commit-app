import React, { useEffect, useState } from 'react';
import {  View,  Text,  TextInput,  FlatList,  TouchableOpacity,  Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import { AcademicRequest, Api_Url, httpRequest2, profilData, SaveSportsRequest } from '~/services/serviceRequest';
import { PREF_KEYS } from '~/utils/Prefs';
import { AcademicResponse, EventsResponse, SimpleResponse } from '~/services/DataModals';

// type SelectedGame = {
//   sportName: string;
//   sportId: number;
// };


// type Props = {
//   sportName: string;
//   sportId: number;
//   searchText: string;
//   setSearchText: (text: string) => void;
//   selectedItems: string[][];
//   setSelectedItems: React.Dispatch<React.SetStateAction<string[][]>>;
//   step: number;
//   onNext?: () => void;
// };

type Props = {
  sportName: string;
  sportId: number;
  searchText: string;
  setSearchText: (text: string) => void;
  selectedItems: string[][];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[][]>>;
  step: number;
  onNext?: () => void;
  selectedGames: { sportName: string; sportId: any }[]; // ✅ Add this
};


 

export default function SelectedGames({
  sportName,
  sportId,
  searchText,
  setSearchText,
  selectedItems,
  setSelectedItems,
  step,
  onNext,
  selectedGames, // ✅ You must include this!

}: Props) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
const [eventList, setEventList] = useState<{ id: number; display_name: string }[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      console.log('selectedGames', selectedGames);
            console.log('selectedItems', selectedItems);

      try {
        setLoading(true);
        const accessToken = await getItem(PREF_KEYS.accessToken);

 

        const res = await httpRequest2<EventsResponse>(
          Api_Url.sportsEvents(sportId),
          'get',
          {},
          accessToken ?? '',
        );

        if (res.status && res.eventMergedData) {
          const eventList =
            res.eventMergedData.map((event) => event.display_name).filter(Boolean);

          setOptions(eventList);
          console.log('Fetched Events:', eventList);
        } else {
          Alert.alert('Error', res.message ?? 'Something went wrong');
        }
      } catch (err) {
        Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [sportName]);

 const SaveEventRequest = async () => {
  try {
    setLoading(true);

    const email = await getItem(PREF_KEYS.userEmailID);
    const userId = await getItem(PREF_KEYS.userId);
    const accessToken = await getItem(PREF_KEYS.accessToken);
    const soprtsUrl = Api_Url.save_sports;

    // 🔄 Build allEvents safely in memory
    const allEvents: profilData[] = [];

    for (let i = 0; i < selectedGames.length; i++) {
      const game = selectedGames[i];
      const events = selectedItems[i] ?? [];

      for (const eventName of events) {
        const foundEvent = eventList.find(e => e.display_name === eventName);
        if (foundEvent) {
          allEvents.push({
            sport_id: game.sportId,
            event_id: foundEvent.id.toString(), // ✅ Send ID, not name
            eventValue: '0',
            eventUnit: '',
          });
        }
      }
    }

    console.log('allEvents' , selectedItems);

    if (allEvents.length === 0) {
      Alert.alert('Error', 'No valid events found to submit.');
      return;
    }

    const requestBody: SaveSportsRequest = {
      sports_profile: allEvents,
      additional_info: '',
      media_links: '',
    };

    // ⚠️ Optional: Remove or limit large console logs
    console.log('Sending sports data count:', allEvents.length);

    const res = await httpRequest2<SimpleResponse>(
      soprtsUrl,
      'post',
      requestBody,
      accessToken ?? '',
      true
    );

    if (res.status) {
      onNext?.();
    } else {
      Alert.alert('Error', res.message ?? 'Request failed');
    }
  } catch (err) {
    Alert.alert('Error', 'Unexpected error occurred.');
  } finally {
    setLoading(false);
  }
};




  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleSelection = (option: string) => {
    const newSelection = [...selectedItems];
    const currentSelections = new Set(newSelection[step]);

    if (currentSelections.has(option)) {
      currentSelections.delete(option);
    } else {
      currentSelections.add(option);
    }

    newSelection[step] = Array.from(currentSelections);
    setSelectedItems(newSelection);
  };

  return (
    <>
      <View className="flex-row items-center bg-white h-14 rounded-full px-4 mb-2">
        <Loader show={loading} />
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
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isChecked = selectedItems[step]?.includes(item);
            return (
              <TouchableOpacity
                onPress={() => toggleSelection(item)}
                className="flex-row justify-between items-center px-4 py-3 mb-2"
              >
                <Text className="text-base text-title">{item}</Text>
                <View
                  className={`w-6 h-6 rounded-lg items-center justify-center border ${
                    isChecked ? 'bg-green-900 border-green-600' : 'bg-white border-gray-400'
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

      {selectedItems[step].length > 0 && (
        <View className="mt-1 px-1 py-1">
          <Text className="text-green-800 mb-2">Selected:</Text>
          <View className="flex-row flex-wrap gap-1">
            {selectedItems[step].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  const newSelection = [...selectedItems];
                  newSelection[step] = newSelection[step].filter((i) => i !== item);
                  setSelectedItems(newSelection);
                }}
                className="flex-row items-center px-4 py-2 bg-gray-200 rounded-full"
              >
                <Text className="text-pretty mr-1">{item}</Text>
                <Ionicons name="close" size={14} color="#065F46" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View className="px-2 py-4 mb-20">
        {/* <ArrowButton
          text="Continue"
          onPress={() => onNext?.()}
          disabled={selectedItems[step].length === 0}
          fullWidth
        /> */}
    <ArrowButton
  text="Continue"
  fullWidth
  disabled={selectedItems[step].length === 0}
  onPress={async () => {
    if (step == selectedGames.length -1) {
      // await SaveEventRequest();
       onNext?.();
    } else {
      onNext?.();
    }
  }}
/>



      </View>
    </>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getItem } from "~/utils/storage";
import { PREF_KEYS } from "~/utils/Prefs";
import { Api_Url, httpRequest2 } from "~/services/serviceRequest";
import { EventsResponse, HoldSportsdata, SavedSportResponse } from "~/services/DataModals";
import AppText from "~/components/AppText";
import { capitalizeWords } from "~/utils/AppFunctions";
import TitleText from "~/components/TitleText";
import ArrowButton from "~/components/ArrowButton";

export default function CheckboxModal({
  visible,
  onClose,
  onSelect,
  sportName = "Select Items",
  sportId,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (selectedData: any[]) => void; // send full mapped data
  sportName?: string;
  sportId: string;
}) {
  const [events, setEvents] = useState<HoldSportsdata[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch API data when modal opens
  useEffect(() => {
    if (!visible) return;

    const fetchAPIRequest = async () => {
      try {
        setLoading(true);
        const accessToken = await getItem(PREF_KEYS.accessToken);

        const res = await httpRequest2<EventsResponse>(
          Api_Url.sportsEvents(sportId),
          "get",
          {},
          accessToken ?? ""
        );

        if (res.status && res.data) {
          const parsedEvents: HoldSportsdata[] = res.data.map((event) => ({
            ...event,
            sport_id: sportId,
            selected: event.user_selected === "1",
          }));

          setEvents(parsedEvents);
        } else {
          Alert.alert("Error", res.message ?? "Something went wrong");
        }
      } catch (err) {
        Alert.alert("Error", "Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAPIRequest();
  }, [visible, sportId]);

  // Toggle checkbox
  const toggleItem = (id: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.event_id === id ? { ...e, selected: !e.selected } : e
      )
    );
  };

  // Proceed button
  const handleDone = () => {
    const selectedEvents = events.filter((e) => e.selected);

    if (selectedEvents.length === 0) {
      Alert.alert("Error", "Please select at least one event.");
      return;
    }

    const mappedData = selectedEvents.map((e) => ({
      sport_id: e.sport_id,
      event_id: e.event_id,
      eventValue: e.event_value,
      eventUnit: e.event_unit,
    }));

    console.log("✅ Final selected events:", mappedData);

    // Pass mapped data to parent
    handleSubmit(mappedData);
   
  };

  // Search filter
  const filteredEvents = events.filter((item) =>
    item.display_name.toLowerCase().includes(searchText.toLowerCase())
  );


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
            };
  
            const res = await httpRequest2<SavedSportResponse>(
                Api_Url.save_sports,
                'post',
                payload,
                accessToken ?? '',
                true
            );
            console.log(res);
            if (res.status) {
                    setLoading(false);
                setTimeout(() => {
                     onSelect(allData);
    onClose();
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






  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="w-full h-[90%] bg-background rounded-t-2xl px-8 py-4 flex flex-col">
          {/* Title */}
          <View className="flex-row items-center justify-between">
            <TitleText>{capitalizeWords(sportName)}</TitleText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#235D48" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-200 rounded-lg px-3 py-2 mb-3 mt-5">
            <Ionicons name="search" size={20} color="#999" className="mr-2" />
            <TextInput
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-base text-gray-800"
              placeholderTextColor="#999"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <View className="flex-1 min-h-[200px]">
            {loading ? (
              <View className="h-[200px] justify-center items-center">
                <Text className="text-gray-400 text-base">Loading...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.event_id}
                ListEmptyComponent={
                  <View className="h-[200px] justify-center items-center">
                    <Text className="text-gray-400 text-base">
                      No items found
                    </Text>
                  </View>
                }
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      className="flex-row justify-between items-center py-3 border-b border-gray-200"
                      onPress={() => toggleItem(item.event_id)}
                    >
                      <View className="flex-1 mr-3">
                        <AppText>{item.display_name}</AppText>
                      </View>
                      <View className="mr-4">
                        {item.selected ? (
                          <Ionicons
                            name="checkbox"
                            size={24}
                            color="#235D48"
                          />
                        ) : (
                          <Ionicons
                            name="checkbox-outline"
                            size={24}
                            color="#DBDBDB"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>

          {/* Footer Buttons */}
          <View className="w-full justify-end mt-6 mb-10">
            <ArrowButton text={"Proceed"} fullWidth onPress={handleDone} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

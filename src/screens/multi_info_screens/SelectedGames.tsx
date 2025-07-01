import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';

type Props = {
  options: string[];
  searchText: string;
  setSearchText: (text: string) => void;
  selectedItems: string[][];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[][]>>;
  step: number;
  onNext?: () => void; // ✅ optional
};


export default function SelectedGames({
  options,
  searchText,
  setSearchText,
  selectedItems,
  setSelectedItems,
  step,
  onNext,
}: Props) {
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
        <TextInput
          className="flex-1 py-2 text-black"
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color="gray" />
      </View>

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
        <ArrowButton
          text="Continue"
          onPress={() => onNext?.()} // ✅ safe call
           disabled={selectedItems[step].length === 0}
          fullWidth
        />
      </View>
    </>
  );
}

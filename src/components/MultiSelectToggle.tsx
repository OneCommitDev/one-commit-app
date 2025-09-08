/*import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  options: string[];
  initialValues?: string[];
  onSelect: (selected: string[]) => void;
};

export default function MultiSelectToggle({
  options,
  initialValues = [],
  onSelect,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialValues);

  // 🔥 Sync when initialValues changes
  useEffect(() => {
    setSelectedItems(initialValues);
  }, [initialValues]);

  const toggleSelect = (value: string) => {
    let updated: string[];
    if (selectedItems.includes(value)) {
      updated = selectedItems.filter((item) => item !== value);
    } else {
      updated = [...selectedItems, value];
    }
    setSelectedItems(updated);
    onSelect(updated);
  };

  const capitalizeWords = (text: string) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <View className="mt-3 mb-3 w-full items-center">
      <View
        className="flex-row  rounded-full overflow-hidden w-full"
        style={{ height: 50 }}
      >
        {options.map((item) => {
          const isSelected = selectedItems.includes(item);
          return (
            <TouchableOpacity
              key={item}
              onPress={() => toggleSelect(item)}
              className="flex-row items-center justify-center px-3 rounded-full flex-1 ml-1"
              style={{
                backgroundColor: isSelected ? "white" : "transparent",
                borderWidth: 1,
                borderColor: isSelected ? '#235D48' : '#E5E7EB',
              }}
            >
              <Text
                className={`${
                  isSelected
                    ? "text-primary font-nunitoextrabold text-16 pl-1"
                    : "text-gray-500 text-14"
                }`}
              >
                {capitalizeWords(item)}
              </Text>
              <Ionicons
                name={isSelected ? "checkmark" : "checkmark-done"}
                size={20}
                color={isSelected ? "green" : "gray"}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
*/


/*
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  options: string[];
  initialValues?: string[];
  onSelect: (selected: string[]) => void;
};

export default function MultiSelectToggle({
  options,
  initialValues = [],
  onSelect,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialValues);

  // 🔥 Sync when initialValues changes
  useEffect(() => {
    setSelectedItems(initialValues);
  }, [initialValues]);

  const toggleSelect = (value: string) => {
    let updated: string[];
    if (selectedItems.includes(value)) {
      updated = selectedItems.filter((item) => item !== value);
    } else {
      updated = [...selectedItems, value];
    }
    setSelectedItems(updated);
    onSelect(updated);
  };

  const capitalizeWords = (text: string) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <View className="mt-3 mb-3 w-full">
      <View className="flex-row flex-wrap w-full">
        {options.map((item) => {
          const isSelected = selectedItems.includes(item);
          return (
            <TouchableOpacity
              key={item}
              onPress={() => toggleSelect(item)}
              className="flex-row items-center justify-center px-4 py-2 rounded-full mr-2 mb-2"
              style={{
                backgroundColor: isSelected ? "white" : "transparent",
                borderWidth: 0.2,
                borderColor: isSelected ? "#235D48" : "#E5E7EB",
              }}
            >
              <Text
                className={`${
                  isSelected
                    ? "text-primary font-nunitoextrabold text-16"
                    : "text-gray-500 text-14"
                }`}
              >
                {capitalizeWords(item)}
              </Text>
              <Ionicons
                name={isSelected ? "checkmark" : "checkmark"}
                size={18}
                color={isSelected ? "green" : "gray"}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
*/



import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  options: string[];
  initialValues?: string[];
  onSelect: (selected: string[]) => void;
};

export default function MultiSelectToggle({
  options,
  initialValues = [],
  onSelect,
}: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // normalize & deduplicate initial values
  useEffect(() => {
    const normalized = initialValues
      .map((v) => v.trim().toLowerCase())
      .filter((v) => options.map((o) => o.toLowerCase()).includes(v));

    setSelectedItems(Array.from(new Set(normalized)));
  }, [initialValues, options]);

  const toggleSelect = (value: string) => {
    const valueLower = value.toLowerCase();

    let updated: string[];
    if (selectedItems.includes(valueLower)) {
      updated = selectedItems.filter((item) => item !== valueLower);
    } else {
      updated = [...selectedItems, valueLower];
    }

    setSelectedItems(updated);
    onSelect(updated); // always returns clean array
  };

  const capitalizeWords = (text: string) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <View className="mt-3 mb-3 w-full">
      <View className="flex-row flex-wrap w-full">
        {options.map((item) => {
          const itemLower = item.toLowerCase();
          const isSelected = selectedItems.includes(itemLower);

          return (
            <TouchableOpacity
              key={item}
              onPress={() => toggleSelect(item)}
              className="flex-row items-center justify-center px-4 py-2 rounded-full mr-2 mb-2"
              style={{
                backgroundColor: isSelected ? "white" : "transparent",
                borderWidth: 0.2,
                borderColor: isSelected ? "#235D48" : "#E5E7EB",
              }}
            >
              <Text
                className={`${
                  isSelected
                    ? "text-primary font-nunitoextrabold text-16"
                    : "text-gray-500 text-14"
                }`}
              >
                {capitalizeWords(item)}
              </Text>
              <Ionicons
                name="checkmark"
                size={18}
                color={isSelected ? "green" : "gray"}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

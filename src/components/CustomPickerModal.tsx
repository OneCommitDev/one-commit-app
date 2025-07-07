import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WheelPickerExpo from 'react-native-wheel-picker-expo';

const screenWidth = Dimensions.get('window').width;

// Types
export type PickerItem = {
  key: string;
  label: string;
  value: string;
};

type CustomPickerModalProps = {
  visible: boolean;
  title: string;
  data: PickerItem[];
  initialValue: string;
  onClose: () => void;
  onSave: (selected: PickerItem) => void;
};

export const CustomPickerModal: React.FC<CustomPickerModalProps> = ({
  visible,
  title,
  data,
  initialValue,
  onClose,
  onSave,
}) => {
  const initialIndex = data.findIndex((item) => item.value === initialValue);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  // Reset to initial value when modal opens
  useEffect(() => {
    if (visible) {
      const index = data.findIndex((item) => item.value === initialValue);
      setSelectedIndex(index >= 0 ? index : 0);
    }
  }, [visible, initialValue, data]);

  const selectedItem = data[selectedIndex];

  if (!data || data.length === 0) return null;




  

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <View className="bg-white rounded-t-2xl pt-2 pb-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4 px-4">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>

            <Text className="text-base font-semibold text-black">{title}</Text>

            <TouchableOpacity
              onPress={() => {
                onSave(selectedItem);
                onClose();
              }}
            >
              <Ionicons name="checkmark" size={26} color="#235D48" />
            </TouchableOpacity>
          </View>

          {/* Wheel Picker */}
          <View style={{ height: 250, alignItems: 'center' }}>
          <WheelPickerExpo
            height={250}
            width={screenWidth}
            items={data.map(({ label, value }) => ({ label, value }))}
            initialSelectedIndex={selectedIndex}
            onChange={({ index }) => setSelectedIndex(index)}
            backgroundColor="#eaeded"
            selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
          />

          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

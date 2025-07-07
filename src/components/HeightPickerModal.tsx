import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WheelPickerExpo from 'react-native-wheel-picker-expo';

const screenWidth = Dimensions.get('window').width;

type HeightPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  form: { heightis: string };
  handleChange: (field: 'heightis', value: string) => void;
};

const feetInchesArray = Array.from({ length: 121 }, (_, i) => {
  const totalInches = i + 36; // Start at 3'0" = 36 inches
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return {
    label: `${feet}'${inches}"`,
    value: totalInches,
  };
});

export const HeightPickerModal: React.FC<HeightPickerModalProps> = ({
  visible,
  onClose,
  form,
  handleChange,
}) => {
  const currentIndex = form.heightis
    ? feetInchesArray.findIndex((item) => item.label === form.heightis)
    : feetInchesArray.findIndex((item) => item.label === `5'6"`); // default to 5'6"

  const [tempIndex, setTempIndex] = useState(currentIndex);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <View className="bg-white rounded-t-2xl pt-2">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4 px-2">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>

            <Text className="text-center text-base font-semibold">Height</Text>

            <TouchableOpacity
              onPress={() => {
                const selected = feetInchesArray[tempIndex];
                handleChange('heightis', selected.label);
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
              items={feetInchesArray}
              initialSelectedIndex={tempIndex}
              onChange={({ index }) => setTempIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

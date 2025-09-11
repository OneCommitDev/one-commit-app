// components/TimePickerModal.tsx
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
import AppText from './AppText';

const screenWidth = Dimensions.get('window').width;

type TimePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  initialValue?: { minutes: number; seconds: number; milliseconds: number };
  onSave: (value: { minutes: number; seconds: number; milliseconds: number }) => void;
  title? : string;
};

const generateRange = (max: number) => {
  return Array.from({ length: max }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i,
    key: i.toString(),
  }));
};

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  onClose,
  initialValue = { minutes: 0, seconds: 0, milliseconds: 0 },
  onSave,
  title,
}) => {
  const [minuteIndex, setMinuteIndex] = useState(initialValue.minutes);
  const [secondIndex, setSecondIndex] = useState(initialValue.seconds);
  const [msIndex, setMsIndex] = useState(initialValue.milliseconds);

  useEffect(() => {
    if (visible) {
      setMinuteIndex(initialValue.minutes);
      setSecondIndex(initialValue.seconds);
      setMsIndex(initialValue.milliseconds);
    }
  }, [visible]);

  const minuteItems = generateRange(60);
  const secondItems = generateRange(60);
  const msItems = generateRange(100);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <View className="bg-white rounded-t-2xl pt-2 pb-4">
          <View className="flex-row items-center justify-between mb-4 px-4">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
            <AppText>
  {title && title.trim() !== "" ? title : "Select Time"}
</AppText>
            <TouchableOpacity
              onPress={() => {
                onSave({
                  minutes: minuteIndex,
                  seconds: secondIndex,
                  milliseconds: msIndex,
                });
                onClose();
              }}
            >
              <Ionicons name="checkmark" size={26} color="#235D48" />
            </TouchableOpacity>
          </View>
<View className="flex-row justify-between px-4 mt-4 mb-1">
  <Text className="w-1/3 text-center text-sm font-medium text-gray-500">MIN</Text>
  <Text className="w-1/3 text-center text-sm font-medium text-gray-500">SEC</Text>
  <Text className="w-1/3 text-center text-sm font-medium text-gray-500">MS</Text>
</View>

          <View className="flex-row justify-around px-4 mt-5 bg-[#eaeded]">
            <WheelPickerExpo
              height={250}
              width={screenWidth / 3.2}
              items={minuteItems}
              initialSelectedIndex={minuteIndex}
              onChange={({ index }) => setMinuteIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
            />
            <WheelPickerExpo
              height={250}
              width={screenWidth / 3.2}
              items={secondItems}
              initialSelectedIndex={secondIndex}
              onChange={({ index }) => setSecondIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
            />
            <WheelPickerExpo
              height={250}
              width={screenWidth / 3.2}
              items={msItems}
              initialSelectedIndex={msIndex}
              onChange={({ index }) => setMsIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
            />
          </View>

         
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

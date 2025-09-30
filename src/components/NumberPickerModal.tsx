import React, { useEffect, useState } from 'react';
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

type NumberPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (whole: number, decimal: number) => void;
  title?: string;
};

export const NumberPickerModal: React.FC<NumberPickerModalProps> = ({
  visible,
  onClose,
  onSave,
  title,
}) => {
  const wholeRaw = Array.from({ length: 13 }, (_, i) => i); // 0 to 30
  const decimalRaw = Array.from({ length: 10 }, (_, i) => i); // 0 to 11

  const wholeItems = wholeRaw.map((val) => ({
    label: `${val}`,
    value: val,
    key: val.toString(),
  }));

  const decimalItems = decimalRaw.map((val) => ({
    label: `${val}`,
    value: val,
    key: val.toString(),
  }));

  const [wholeIndex, setWholeIndex] = useState(1); // Default to 1
  const [decimalIndex, setDecimalIndex] = useState(0); // Default to .0

  useEffect(() => {
    if (visible) {
      setWholeIndex(1);
      setDecimalIndex(0);
    }
  }, [visible]);

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
            <AppText className="text-base font-semibold text-black">
              {title || 'Select Value'}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                onSave(wholeItems[wholeIndex].value, decimalItems[decimalIndex].value);
              }}
            >
              <Ionicons name="checkmark" size={26} color="#235D48" />
            </TouchableOpacity>
          </View>

          {/* Wheel Pickers */}
          <View className="flex-row items-center justify-center px-4 bg-[#eaeded]">
            <WheelPickerExpo
              key={`whole-${visible}`}
              height={250}
              width={screenWidth / 3}
              items={wholeItems}
              initialSelectedIndex={wholeIndex}
              onChange={({ index }) => setWholeIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
            />

            <WheelPickerExpo
              key={`decimal-${visible}`}
              height={250}
              width={screenWidth / 3}
              items={decimalItems}
              initialSelectedIndex={decimalIndex}
              onChange={({ index }) => setDecimalIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

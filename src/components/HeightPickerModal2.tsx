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

type HeightPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (feet: number, inches: number) => void;
    title?: string; // <- NEW

};

export const HeightPickerModal2: React.FC<HeightPickerModalProps> = ({
  visible,
  onClose,
  onSave,
  title, 
}) => {
  const feetRaw = [1, 2, 3, 4, 5, 6, 7 ,8 , 9 , 10 , 11 , 12];
  const inchRaw = Array.from({ length: 12 }, (_, i) => i);

  const feetItems = feetRaw.map((val) => ({
    label: `${val}'`, // add single quote
    value: val,
    key: val.toString(),
  }));

  const inchItems = inchRaw.map((val) => ({
    label: `${val}"`, // add double quote
    value: val,
    key: val.toString(),
  }));

  const [feetIndex, setFeetIndex] = useState(4); // default to 5'
  const [inchIndex, setInchIndex] = useState(6); // default to 6"

  useEffect(() => {
    if (visible) {
      setFeetIndex(4);
      setInchIndex(6);
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
            <AppText className="text-base font-semibold text-black"> {title || 'Select Height'}</AppText>
          <TouchableOpacity
  onPress={() => {
    onSave(feetItems[feetIndex].value, inchItems[inchIndex].value);
    // let parent decide when to close
  }}
>

              <Ionicons name="checkmark" size={26} color="#235D48" />
            </TouchableOpacity>
          </View>

          {/* Wheel Pickers without labels */}
     <View className="flex-row items-center justify-center px-4 bg-[#eaeded]">
  <WheelPickerExpo
    key={`ft-${visible}`}
    height={250}
    width={screenWidth / 3}
    items={feetItems}
    initialSelectedIndex={feetIndex}
    onChange={({ index }) => setFeetIndex(index)}
    backgroundColor="#eaeded"
    selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
  />
  {/* Removed or minimized spacer */}
  {/* <View style={{ width: screenWidth / 6 }} /> */}
  {/* <View style={{ width: 8 }} /> */}
  <WheelPickerExpo
    key={`in-${visible}`}
    height={250}
    width={screenWidth / 3}
    items={inchItems}
    initialSelectedIndex={inchIndex}
    onChange={({ index }) => setInchIndex(index)}
    backgroundColor="#eaeded"
    selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
  />
</View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

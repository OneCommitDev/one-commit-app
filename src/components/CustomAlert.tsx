// components/CustomAlert.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import TitleText from './TitleText';
import AppText from './AppText';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
};

export default function CustomAlert({
  visible,
  title = 'Advice',
  message = 'We don’t recommend limiting yourself to just one division.',
  buttonText = 'OK',
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-8">
        <View className="bg-white rounded-2xl p-6 w-full">
          <TitleText className="text-center mb-2">{title}</TitleText>
          <AppText className=" mb-4">{message}</AppText>
          <TouchableOpacity
            onPress={onClose}
            className="bg-primary py-2 px-6 rounded-full self-center w-[30%]"
          >
            <AppText className="text-white text-center">{buttonText}</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import LottieView from 'lottie-react-native';
import TitleText from './TitleText';
import AppText from './AppText';

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  visible,
  title = 'Confirm',
  message,
  onCancel,
  onConfirm,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setShowModal(false));
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal transparent visible={true} animationType="none">
      <View className="flex-1 justify-center items-center bg-black/40 px-6">
        <Animated.View
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: Platform.OS === 'android' ? 5 : 0,
          }}
        >
          {/* <View className="items-center mb-4">
            <LottieView
              source={require('assets/animations/delete.json')}
              autoPlay
              loop={false}
              style={{ width: 120, height: 60 }}
            />
          </View> */}

          <TitleText className="text-center mb-5 ml-10 mr-10" size="text-18">
            {message}
          </TitleText>

          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity
              className="flex-1 py-2 rounded-full bg-gray-200"
              onPress={onCancel}
            >
              <AppText className="text-center text-gray-800 font-semibold">
                Cancel
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-2 rounded-full bg-red-500 ml-5"
              onPress={onConfirm}
            >
              <AppText
                className="text-center text-white"
                fontFamily="font-nunitoextrabold"
              >
                Yes, Delete
              </AppText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

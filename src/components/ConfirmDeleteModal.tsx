import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import TitleText from "./TitleText";

export const ConfirmDeleteModal = ({
  visible,
  onCancel,
  onConfirm,
  eventName,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  eventName: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);

 useEffect(() => {
  if (visible) {
    setShowModal(true); // mount modal
    scaleAnim.setValue(0.8);    // reset before animating
    opacityAnim.setValue(0);    // reset before animating

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  } else {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowModal(false));
  }
}, [visible]);


  if (!showModal) return null;

  return (
    <Modal transparent visible={showModal} animationType="none">
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
        >
          {/* Title */}
          <TitleText className="text-center mb-3" color="text-red-600">
            Confirm Delete
          </TitleText>

          {/* Message */}
          <Text className="text-base text-center text-gray-700 mb-6 leading-relaxed">
            Are you sure you want to delete{" "}
            <Text className="font-bold text-black">"{eventName}"</Text> event?{" "}
            This action cannot be undone.
          </Text>

          {/* Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 mr-2 py-3 rounded-xl border border-gray-300 bg-gray-100"
            >
              <Text className="text-center text-gray-700 font-medium">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 ml-2 py-3 rounded-xl bg-red-500"
            >
              <Text className="text-center text-white font-semibold">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

import React from "react";
import { View, Text, TouchableOpacity, Appearance } from "react-native";
import TitleText from "./TitleText";
import AppText from "./AppText";

type OfflineScreenProps = {
  onRetry: () => void;
};
const colorScheme = Appearance.getColorScheme();

export default function OfflineScreen({ onRetry }: OfflineScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <TitleText className="mb-2">No Internet Connection</TitleText>
      <AppText className="text-center mb-5">
        Please check your network and try again.
      </AppText>
      <TouchableOpacity
        className="bg-[#235D48] px-8 py-3 rounded-lg"
        onPress={onRetry}
      >
        <Text className="text-white font-bold">Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

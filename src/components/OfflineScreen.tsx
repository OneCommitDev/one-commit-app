import React from "react";
import { View, Text, TouchableOpacity, Appearance } from "react-native";
import TitleText from "./TitleText";
import AppText from "./AppText";
import LottieView from "lottie-react-native";

type OfflineScreenProps = {
  onRetry: () => void;
};
const colorScheme = Appearance.getColorScheme();

export default function OfflineScreen({ onRetry }: OfflineScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background p-5">
        <View className="items-center mb-6">
        <LottieView
            source={require("../../assets/animations/No Mobile Internet.json")}
            autoPlay
            loop={false}
            style={{ width: 140, height: 140 }}
          /> 
        </View>
      <TitleText className="mb-2" size="text-20">No Internet Connection</TitleText>
      <AppText className="text-center mb-5 -mt-5">
        Please check your network and try again.
      </AppText>
      <TouchableOpacity
        className="bg-[#235D48] px-8 py-3 rounded-lg"
        onPress={onRetry}
      >
        <Text className="text-white font-bold">Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
  Alert,
  useWindowDimensions,
  Linking,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";
import TitleText from "~/components/TitleText";
import AppText from "~/components/AppText";
import ArrowButton from "~/components/ArrowButton";
import * as Application from "expo-application";

type RootStackParamList = {
  ContactUs: undefined;
};

export default function ContactUs() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  const handleBack = () => {
    navigation.goBack();
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    Alert.alert("✅ Success", "Message sent successfully!");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  // On small screens, stack vertically
const isSmallScreen = width < 768;
/*
  const handleEmailPress = async () => {
    const email = "hello@onecommit.us";
    const url = `mailto:${email}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "No email client found");
      }
    } catch (err) {
      Alert.alert("Error", "Unable to open email client");
    }
  };
  */

  let appVersion = "unknown";
let buildNumber = "unknown";

 const handleEmailPress = async () => {
 const appVersion = Application.nativeApplicationVersion ?? "unknown";
  const buildNumber = Application.nativeBuildVersion ?? "unknown";




  const email = "hello@onecommit.us";
  const subject = "Support Request";
  // const body = "Hello team,";
   const body = `
    Hello OneCommit Support Team,





    App Information
    • Version: ${appVersion}
    • Build: ${buildNumber}
    • Platform: ${Platform.OS}
`;


  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  try {
    if (Platform.OS === "ios") {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Error", "No email client found");
        return;
      }
    }
    await Linking.openURL(url);
  } catch (err) {
    Alert.alert("Error", "Unable to open email client");
  }
};



  const handleWebsitePress = async () => {
    const url = "https://onecommit.us/";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open browser");
      }
    } catch (err) {
      Alert.alert("Error", "Unable to open browser");
    }
  };
  return (
    // <View className="flex-1 bg-background">
      <View
                      className={`flex-1 bg-background px-4 ${
                        Platform.OS === "ios" ? "pt-14" : "pt-1"
                      }`}
                    >
      {/* Header */}
      <View className="flex-row  items-center">
        <TouchableOpacity
          onPress={handleBack}
          className="w-11 h-11 rounded-full bg-gray-200 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#1A322E" />
        </TouchableOpacity>

        <View className="flex-1 ml-3">
          <TitleText>Contact us</TitleText>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 20 }}
        keyboardShouldPersistTaps="handled"
      >
      
        <View
          className={`${
            isSmallScreen ? "flex-col" : "flex-row"
          }  p-5 `}
        >
          <View className="flex-1 mb-6 mr-0 md:mr-5">
            <TitleText className="mb-2">
              Get in Touch
            </TitleText>
            <AppText className="mb-6">
              Have questions about OneCommit? Want to learn more about how it
              works? We'd love to hear from you.
            </AppText>

            <TitleText className="mb-1">
              Email
            </TitleText>
           <TouchableOpacity onPress={handleEmailPress}>
              <AppText className="mb-6 text-blue-600 underline">
                hello@onecommit.com
              </AppText>
            </TouchableOpacity>

            <TitleText className="mb-1">
               Website
            </TitleText>
        <TouchableOpacity onPress={handleWebsitePress}>
              <AppText className="mb-6 text-blue-600 underline">
                https://onecommit.us/
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

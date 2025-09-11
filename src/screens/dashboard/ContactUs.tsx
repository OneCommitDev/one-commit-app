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
} from "react-native";
import LottieView from "lottie-react-native";
import TitleText from "~/components/TitleText";
import AppText from "~/components/AppText";
import ArrowButton from "~/components/ArrowButton";

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

  const handleEmailPress = async () => {
    const email = "hello@onecommit.com";
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
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row mt-14 items-center px-4">
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
        className="flex-1 px-5"
        contentContainerStyle={{ paddingVertical: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Animation */}
        {/*   <View className="items-center mb-6">
        <LottieView
            source={require("../../../assets/animations/contact.json")}
            autoPlay
            loop
            style={{ width: 140, height: 140 }}
          /> 
        </View>*/}

        {/* Container */}
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

          {/* <View className="flex-1">
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-3 bg-white text-base"
              placeholder="Name *"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-3 bg-white text-base"
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 mb-3 bg-white text-base"
              placeholder="Subject *"
              value={subject}
              onChangeText={setSubject}
            />
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 h-32 bg-white rounded-xl mb-4 text-base"
              placeholder="Message *"
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <ArrowButton text={"Send Message"} fullWidth  onPress={handleSubmit} >
              
            </ArrowButton>

        
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
}

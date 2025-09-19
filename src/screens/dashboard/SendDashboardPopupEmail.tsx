import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {  View,  Text,  TextInput,  TouchableOpacity,  Modal,  ScrollView,} from "react-native";
import AppText from "~/components/AppText";
import ArrowButton from "~/components/ArrowButton";
import Logo from "~/components/Logo";
import TitleText from "~/components/TitleText";
import checkSuccessAnim from "../../../assets/animations/contact.json";
import { DashboardStartOutreachModal, SchoolItem } from "~/services/DataModals";
import WebView from "react-native-webview";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSend: (email: string) => void;
  schools: SchoolItem[];  
  subject : string;
   contentdata : string;
}
 

const SendDashboardPopupEmail: React.FC<Props> = ({ visible, onClose, onSend, schools , subject , contentdata }) => {
  const [email, setEmail] = useState("");

  const handleSend = () => {
     onSend(email.trim());
    setEmail("");
    onClose();
  };

 
  

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="w-[95%] h-[80%] bg-background rounded-xl p-5 shadow-md">
            {/* <View className="flex-row">
               <LottieView
                    source={checkSuccessAnim}
                    autoPlay
                    loop={false}
                    style={{ width: 100, height: 100 }}
                    />
                <View className="flex-1">
                    <TitleText size="text-20" className="ml-2 mt-1">
                    Connect with schools
                    </TitleText>
                    <Text className="ml-2 font-light">
                      With OneCommit, connecting with schools and colleges is easier than ever.
                    </Text>
                </View>
            </View> */}
         
            
                    <TitleText size="text-24" className=" mt-1">
                    Start Mass Outreach
                    </TitleText>
                
                    <View className="w-full h-[1px] bg-gray-300 mt-2 mb-4" />
                    {/* <Text className="ml-2 font-light">
                      With OneCommit, connecting with schools and colleges is easier than ever.
                    </Text> */}
                
         

          {/* Scrollable content */}
          <ScrollView
            className="flex-1 -mt-3"
            contentContainerStyle={{ paddingBottom: 80 }} // give space for bottom button
            showsVerticalScrollIndicator={false}
          >
          


            {/* Names list */}
           <Text className="font-nunitosemibold mt-4">Selected schools & collages :</Text>
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingVertical: 8 }}
>
    {schools.map((item, idx) => (
    <View
      key={idx}
      className="bg-gray-200 px-3 py-1 rounded-[20px] mr-2 px-2 py-3"
    >
       <Text className="text-12">{item.name}</Text>
    </View>
  ))}
</ScrollView>

            {/* Additional content */}
                    
      <TitleText>{subject}</TitleText>
    <View style={{ height: 300, marginTop: 10, borderRadius: 10, overflow: "hidden" }}>
  <WebView
    originWhitelist={["*"]}
    source={{
      html: `
        <html>
          <head>
            <style>
              body {
                background-color: transparent;
                margin: 0;
                padding: 16px; /* Add padding */
                font-family: -apple-system, Roboto, sans-serif;
                color: #333;
              }
            </style>
          </head>
          <body>
            ${contentdata}
          </body>
        </html>
      `,
    }}
    style={{ flex: 1, backgroundColor: "transparent" }}
    scalesPageToFit={false}
    javaScriptEnabled={true}
    domStorageEnabled={true}
  />
</View>


          </ScrollView>

          {/* Fixed bottom actions */}
          <View className="w-full">
            
            <ArrowButton text={"Send Emails"} fullWidth onPress={handleSend} />
            <Text className="font-nunitoregular mt-3">
           Note : This action will send an email to all the selected schools and coaches.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SendDashboardPopupEmail;

import React, { useState } from "react";
import {  View,  Text,  TouchableOpacity,  ScrollView,  Image, Dimensions,} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import TitleText from "~/components/TitleText";
import AppText from "~/components/AppText";
import Loader from "~/components/Loader";
import TestTypeToggle from "../multi_info_screens/TestTypeToggle";
import USRegionsMap from "~/components/USRegionsMap";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

 type RootStackParamList = {
  EmailConnectionUI: { selectedGames: string[]; stepToEdit: number };
};

type SectionTitleProps = {
  title: string;
  showAddButton?: boolean;  
  onAddPress?: () => void;  
};

type Option = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const campusOptions: Option[] = [
  { key: "urban", label: "Urban", icon: "business" },
  { key: "suburban", label: "Suburban", icon: "home" },
  { key: "rural", label: "Rural", icon: "trail-sign-outline" },
];
const schoolOptions: Option[] = [
{ key: "small", label: "Small", icon: "leaf-outline" },        
{ key: "medium", label: "Medium", icon: "flower-outline" },    
{ key: "large", label: "Large", icon: "earth-outline" },      
];

export default function AppPreferences() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [loading, setLoading] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
    const [selectedCampus, setSelectedCampus] = useState<string[]>([]);
    const [schoolSizeSelected, setSchoolSizeSelected] = useState<string>("");

   // Handlers
  const schoolSizetoggle = (key: string) => {
    setSchoolSizeSelected(key);
    console.log("School Size:", key);
  };

  const toggleRegion = (region: string) => {
    setSelectedRegion([region]); // single region select
    console.log("Region:", region);
  };

  const toggleCampus = (key: string) => {
    setSelectedCampus((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
    console.log("Campus:", selectedCampus);
  };

    const handleBack = () => {
    navigation.goBack();
  };


  return (
    <View className="flex-1 bg-background px-1">
      <Loader show={loading} />

     {/* Header */}
         <View className="flex-row mt-14 items-center px-4">
           <TouchableOpacity
             onPress={handleBack}
             className="w-11 h-11 rounded-full bg-gray-200 items-center justify-center"
           >
             <Ionicons name="chevron-back" size={24} color="#1A322E" />
           </TouchableOpacity>
   
           <View className="flex-1 ml-3">
             <TitleText>Preferences</TitleText>
           </View>
         </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4"
      >
   
        {/* Preferences Section */}
                      <View className="bg-white px-1 py-1 rounded-[10px] mt-4">

     
        <View >
          <SectionTitle title="REGION"  />
              <View style={{ width: "100%" }} >
            {/* <USRegionsMap selected={selectedRegion} onToggle={toggleRegion} /> */}
      </View>
      
      {/* <Text>Selected: {selected.join(", ") || "None"}</Text> */}
      <View className="h-1 w-full bg-gray-200 -mt-16" />
           <SectionTitle title="SCHOOL SIZE"  />
          <View className="flex-row justify-between w-full">
            {schoolOptions.map((opt) => {
              const isSelected = schoolSizeSelected === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => schoolSizetoggle(opt.key)}
                  className={`flex-1 flex-col items-center py-3 mx-1 rounded-[5px] border 
                  ${isSelected ? "border-primary bg-primary" : "border-gray-300 bg-white"}`}
                >
                  <Ionicons
                    name={opt.icon}
                    size={22}
                    color={isSelected ? "white" : "#374151"}
                  />
                  <Text
                    className={`mt-1 text-sm ${
                      isSelected ? "text-white font-nunitoextrabold" : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
            {/* Campus Type */}
            <SectionTitle title="CAMPUS TYPE"  />

          <View className="flex-row justify-between w-full">
            {campusOptions.map((opt) => {
              const isSelected = selectedCampus.includes(opt.key);
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => toggleCampus(opt.key)}
                  className={`flex-1 flex-col items-center py-3 mx-1 rounded-[5px] border 
                  ${isSelected ? "border-primary bg-primary" : "border-gray-300 bg-white"}`}
                >
                  <Ionicons
                    name={opt.icon}
                    size={22}
                    color={isSelected ? "white" : "#374151"}
                  />
                  <Text
                    className={`mt-1 text-sm ${
                      isSelected ? "text-white font-nunitoextrabold" : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
      </View>   
        </View>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title, showAddButton = false, onAddPress }: SectionTitleProps) {
  return (
    <View className="w-full relative">
      <TitleText size="text-16" className="mb-3 mt-2">
        {title}
      </TitleText>

      {showAddButton && (
        <TouchableOpacity
          onPress={onAddPress}
          className="absolute top-2 right-2 bg-white border border-gray-100 shadow-sm rounded-full p-[4px]"
        >
          <Ionicons name="add" size={18} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="w-[48%] bg-white rounded-2xl p-3 mb-3 border border-gray-200">
               
      <View className="flex-row items-center -mt-[12px]">
        <Ionicons name="walk-outline" size={24} color="#6B7280" />
            <View className="mt-1  w-[80%] ml-[5px]">
            <View className="mt-1  justify-between">
                <TitleText size="text-18">{value}</TitleText>
            <Text className="text-black -mt-1">{label}</Text>
            </View>
        </View>
   
      </View>

     
      <TouchableOpacity className="absolute top-2 right-2 bg-white  rounded-full p-[4px]">
        <Ionicons name="pencil-outline" size={16} color="black" />
      </TouchableOpacity>
    </View>
  );
}

 

function Tag({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View
      className={`px-4 py-2 rounded-xl border ${
        active
          ? "bg-blue-100 border-blue-500"
          : "bg-gray-100 border-gray-200"
      }`}
    >
      <AppText
        className={active ? "text-blue-600 font-semibold" : "text-gray-700"}
      >
        {label}
      </AppText>
    </View>
  );
}

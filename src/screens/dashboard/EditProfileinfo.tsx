import React, { useCallback, useState } from "react";
import {  View,  Text,  TouchableOpacity,  ScrollView,  Image, Dimensions, Alert, InteractionManager,} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import TitleText from "~/components/TitleText";
import AppText from "~/components/AppText";
import Loader from "~/components/Loader";
import TestTypeToggle from "../multi_info_screens/TestTypeToggle";
import USRegionsMap from "~/components/USRegionsMap";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileField, ProfileSection } from "../multi_info_screens/ProfilePreview";
import { getItem } from "expo-secure-store";
import { Api_Url, httpRequest2 } from "~/services/serviceRequest";
import { AcademicResponse, Editprofilemodal, ProfileComplition, ProfileComplitionData, SimpleResponse, SportEvent, SportUserFormattedData } from "~/services/DataModals";
import { PREF_KEYS } from "~/utils/Prefs";
import { capitalizeFirst, capitalizeWords, formatInchesToFeetAndInches, getInitials } from "~/utils/AppFunctions";
import MultiSelectToggle from "~/components/MultiSelectToggle";
import ListviewShhet from "~/components/ListviewShhet";
import { decodeAccessToken } from "~/utils/decodeAccessToken";
import { HeightPickerModal2 } from "~/components/HeightPickerModal2";
import { CustomDualPickerModal } from "~/components/CustomDualPickerModal";
import BottomInputModal from "~/components/BottomInputModal";
import { TimePickerModal } from "~/components/TimePickerModal";

 type RootStackParamList = {
  EmailConnectionUI: { selectedGames: string[]; stepToEdit: number };
AppPreferences : undefined;
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
{ key: "small", label: "Small", icon: "leaf-outline" },        // small leaf
{ key: "medium", label: "Medium", icon: "flower-outline" },    // medium
{ key: "large", label: "Large", icon: "earth-outline" },       // large/world


];

export default function EditProfileInfo() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
const [selectedCampus, setSelectedCampus] = useState<string[]>(["urban"]); // default
const [schoolSizeSelected, setSchoolSizeSelected] = useState<string[]>(["small"]);
  const [profileSections, setProfileSections] = useState<Editprofilemodal[]>([]);
  const [sportsdata, setsportsdata] = useState<SportUserFormattedData[]>([]);
  const [profile, setProfile] = useState<ProfileComplitionData | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [selectedtitleData, setSelectedtitleData] = useState<string>('');
  const [selected, setSelected] = useState<string | null>(null);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<'kg' | 'lbs'>('lbs');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('lbs');  
  const [screenload, setScreenload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
  title: "",
  label: "",
  typeis : "",
  value : "",
  onSave: (val: string) => {},
});

  const [showTimePicker, setShowTimePicker] = useState(false);
   const [sporteventdata, setSportsdata] = useState<SportEvent>();

   // Handlers
 const schoolSizeToggle = (key: string) => {
  setSchoolSizeSelected(prev => {
    const updated = prev.includes(key)
      ? prev.filter(x => x !== key) // remove if already selected
      : [...prev, key];             // add if not selected
    console.log("School Size:", updated);
    return updated;
  });
};

  const toggleRegion = (region: string) => {
    setSelectedRegion([region]); // single region select
    console.log("Region:", region);
  };

const toggleCampus = (key: string) => {
  setSelectedCampus(prev => {
    const updated = prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key];
    return updated;
  });
};


 

useFocusEffect(
  useCallback(() => {
    let mounted = true;

    

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const accessToken = getItem(PREF_KEYS.accessToken);
        const res = await httpRequest2<Editprofilemodal>(
          Api_Url.profileSummary,
          'get',
          {},
          accessToken ?? ''
        );

 
    if (mounted && res.status && res.data) {
          setProfile(res.data);
          setsportsdata(res.data.sportUserFormattedData ?? []);
          if (res.data.school_size) {
            const schoolArray = res.data.school_size
                .split(",")
                .map((s: string) => s.trim().toLowerCase())
                .filter((s: string) => schoolOptions.some(opt => opt.key === s)); // keep only valid options

              setSchoolSizeSelected(schoolArray);
          }
           if (res.data.campus_type) {
            const campusArray = res.data.campus_type
              .split(",")
              .map((c: string) => c.trim().toLowerCase())
              .filter((c: string) => campusOptions.some(opt => opt.key === c));  
            setSelectedCampus(campusArray);
          }
      setScreenload(true);
              
        } 
      } catch (err) {
      } finally {
        if (mounted) setLoading(false);
      }
    };

   
    InteractionManager.runAfterInteractions(() => {
      fetchProfileData();
    });
    return () => {
      mounted = false;
    };
  }, []) // include any dependencies like selectedGames
);


const openBoxModal = (title: string, label: string, typeis : string , value : string, onSave: (val: string) => void) => {
  setModalConfig({ title, label,typeis, value ,  onSave });
  setShowModal(true);
};



const SaveRequest = async (payload: Record<string, string>) => {
  try {
     const token = await getItem(PREF_KEYS.accessToken);

    const res = await httpRequest2<SimpleResponse>(
      Api_Url.academic,
      "post",
      payload,  
      token ?? "",
      true
    );

    if (res.status) {
        
    } else {
       Alert.alert("Error", res.message ?? "Request failed");
    }
  } catch (err) {
     console.error("SaveProfileRequest error:", err);
  } finally {
    setLoading(false);
  }
};



  return (
    
    <View className="flex-1 bg-background px-1">
      <Loader show={loading} />
{screenload ? (
   <> 
      {/* Header */}
      <View className="px-4 mb-6 pt-14">
        <TitleText size="text-24">Profile Settings</TitleText>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4"
      >
      {/* Profile Card */}
        <View className="flex-row justify-between bg-primary py-3 rounded-2xl mb-6 shadow-sm h-[120px]">
        <View className="flex-row items-center">
            <View className="bg-green-700 w-[60px] h-[60px] rounded-full ml-4 items-center justify-center">
            <TitleText color="text-white" size="text-24">{getInitials(profile?.full_name)}</TitleText>
            </View>
            <View className="ml-3">
            <TitleText color="text-white" size="text-18">{capitalizeWords(profile?.full_name)}</TitleText>
            <Text className="text-white font-nunitoregular -mt-[4px]">
                Class of 2025 • {profile?.sportUserFormattedData?.[0]?.display_name}
            </Text>
            <Text className="text-white font-nunitoregular">
                Student at {profile?.school_name}
            </Text>
            </View>
        </View>

        {/* Right Side - Settings Icon */}
        <TouchableOpacity
        onPress={() => navigation.navigate("AppSystemSettings" as never)}
        className="mr-4 items-center justify-center">
            <Ionicons name="settings-outline" size={18} color="white" />
        </TouchableOpacity>
        </View>


        {/* Athletics Section */}
      <View className="bg-white px-1  rounded-[10px]">
          {/* <SectionTitle title="Athletics" showAddButton onAddPress={() => alert("clicked!")} /> */}
                    <SectionTitle title="Athletics"    />

        <View className="flex-row flex-wrap justify-between">
        <InfoCard
          label="Height"
          value={formatInchesToFeetAndInches(Number(profile?.height)) || ''}
          onPressEdit={() => setShowHeightModal(true)}  
        />

        <InfoCard
          label="Weight"
          value={
            profile?.weight && profile?.weight_unit
              ? `${parseFloat(profile.weight.toString()).toFixed(1)} ${profile.weight_unit}`
              : ''
          }
          onPressEdit={() => setShowWeightModal(true)}  
        />

 
 



              {/* <SectionTitle title="Track & Field" /> */}
          {/* <InfoCard label="200M" value="22.76" />
          <InfoCard label="400M" value="50.12" />   */}

    {sportsdata.map((section, sectionIndex) => (
  <View key={sectionIndex} className="w-full">
    <SectionTitle title={section.display_name} />

    <View className="flex-row flex-wrap">
    {section.events.map((item, index) => (
  <InfoCard
    key={index}
    label={item.event_name.toUpperCase().replace('_', ' ')}
    value={item.eventValue?.toString() || ''}
    onPressEdit={() => {
      console.log('item_item',item);
        setSportsdata(item);  
        if(item.measurement_type === 'time'){
            setShowTimePicker(true);
        }
       else if(item.measurement_type === 'points'){ // show box
            
        }
         else if(item.measurement_type === 'meters'){
            
        }
         else if(item.measurement_type === 'feet_inches'){
            
        }
    }}
  />
))}

    </View>
  </View>
))}
 


        
        </View>
      </View>

        {/* Academics Section */}
              <View className="bg-white px-1 py-1 rounded-[10px] mt-4">

          {/* <SectionTitle
            title="Academics"
            showAddButton
            onAddPress={() => {
              setSelectedData(['ACT']);
              setShowSheet(true);
            }}
          /> */}
          <SectionTitle
            title="Academics"
            showAddButton={!!profile && !(profile.sat_score && profile.act_score)}
            onAddPress={() => {
              if (!profile) return; 

              if (!profile.sat_score) {
                setSelectedData(["SAT"]);
              } else if (!profile.act_score) {
                setSelectedData(["ACT"]);
              }
              setShowSheet(true);
            }}
          />


        <View className="flex-row flex-wrap justify-between">
          <InfoCard label="GPA (UWW)" value={profile?.unweighted_gpa || ''} 
           onPressEdit={() => 
                openBoxModal("Academics Info", "GPA (UWW)", "gpa" , profile?.unweighted_gpa.toString() ?? '', (val) => console.log("Saved Name:", val))
           } />

           {profile?.sat_score != null && (
          <InfoCard label="SAT" value={profile?.sat_score != null ? profile.sat_score.toString() : ''}
           onPressEdit={() => 
                openBoxModal("Academics Info", "SAT", "sat", profile.sat_score.toString(), (val) => console.log("Saved Name:", val))
           }
          />
          )}
           {profile?.sat_score != null && (
          <InfoCard label="ACT" value={profile?.act_score != null ? profile.act_score.toString() : ''} 
             onPressEdit={() => 
                openBoxModal("Academics Info", "ACT", "act", profile.act_score.toString() , (val) => console.log("Saved Name:", val))
           }
          />
         )}
         {/* <InfoCard label="Transcript" value="ADD PDF" /> */}
        </View>
 </View>
        {/* Preferences Section */}
                      <View className="bg-white px-1 py-1 rounded-[10px] mt-4">

        {/* <SectionTitle title="Preferences" showAddButton onAddPress={() => navigation.navigate('AppPreferences')} /> */}
         <SectionTitle title="Preferences"  /> 
        <View >
          <AppText>REGION</AppText>
              <View style={{ width: "100%" }} >
            {/* <USRegionsMap selected={selectedRegion} onToggle={toggleRegion}/> */}
             <MultiSelectToggle
                          options={['Midwest', 'Northeast', 'West', 'Southeast' ]}
                          initialValues={[profile?.preferred_region ?? '']}
                          onSelect={(selected) => {
                            const asString = selected.join(", ");
                          console.log("Selected Options:", asString);
                          // setCampusType(asString);
                          //   handleChange('campus_type', asString);
                          }}
                        />
      </View>
      
      {/* <Text>Selected: {selected.join(", ") || "None"}</Text> */}
         {/* School Size */}
        <AppText className="mb-2">SCHOOL SIZE</AppText>
        <View className="flex-row justify-between w-full">
          {schoolOptions.map((opt) => {
            const isSelected = schoolSizeSelected.includes(opt.key);
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => schoolSizeToggle(opt.key)}
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
          <AppText className="mb-2 mt-4">CAMPUS TYPE</AppText>
          <View className="flex-row justify-between w-full">
         {campusOptions.map((opt) => {
  const isSelected = selectedCampus.includes(opt.key); // works now
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
        {opt.label} {/* Still displays capitalized label */}
      </Text>
    </TouchableOpacity>
  );
})}

          </View>
      </View>   
     </View>

     <View className="py-5 items-center mt-5">
             <TouchableOpacity onPress={() => navigation.navigate("AppSystemSettings" as never)}>
                <TitleText>
                  App & System Settings
                </TitleText>
            </TouchableOpacity>
     </View>
      </ScrollView>
 </>
) : (
      // Loader while screenload = false
      <View className="flex-1 items-center justify-center">
        
      </View>
    )}

        <ListviewShhet
        visible={showSheet}
        title={selectedtitleData}
        data={selectedData}
        onClose={() => setShowSheet(false)}
        onSelect={(item) => {
            setSelected(item);
            switch (item) {
            case "SAT":
                openBoxModal("Academics Info", "SAT", "sat", '', (val) => console.log("Saved Name:", val))
            break;
            case "ACT":
                openBoxModal("Academics Info", "ACT", "act", '', (val) => console.log("Saved Name:", val))
            break;
            case "Athletics":
            break;
        
          
            default:
                //console.warn("No action defined for", item);
            }
        }}
        />


         <CustomDualPickerModal
                      visible={showWeightModal}
                      onClose={() => setShowWeightModal(false)}
                      selectedUnit={selectedUnit}
                      onUnitChange={(newUnit) => {
                        setSelectedUnit(newUnit);
                      }}
                      onSave={(main, decimal, unit) => {
                        const selectedWeight = `${main}.${decimal} ${unit}`;
                        setShowWeightModal(false); // close after save
                      }}
                     initialMainValue={
                      parseInt(profile?.weight.toString()?.split('.')[0] || (unit === 'kg' ? "70" : "150"), 10)
                    }
                    initialDecimalValue={
                      parseInt(profile?.weight.toString()?.split('.')[1] || "0", 10)
                    }
        
                     />

            <HeightPickerModal2
              visible={showHeightModal}
              onClose={() => setShowHeightModal(false)}
              initialFeet={parseInt(formatInchesToFeetAndInches(Number(profile?.height)).toString()?.split("'")[0] || "5", 10)}
              initialInches={parseInt(formatInchesToFeetAndInches(Number(profile?.height)).toString()?.split("'")[1]?.replace('"', '') || "6", 10)}
              onSave={(feet, inches) => {
                const formatted = `${feet}'${inches}"`;
                setTimeout(() => setShowHeightModal(false), 50);
              }}
            />
           <BottomInputModal
            visible={showModal}
            title={modalConfig.title}
            label={modalConfig.label}
            typeis={modalConfig.typeis}
            value={modalConfig.value}
            onClose={() => setShowModal(false)}
            onSave={async (val) => {
              const payload = {
                unweighted_gpa: val,    
              };

              await SaveRequest(payload);
            }}
          />



      <TimePickerModal
          visible={showTimePicker}
          initialValue={{
            minutes: Number(sporteventdata?.eventValue.split(":")[0]),
            seconds: Number(sporteventdata?.eventValue.split(":")[1]),
            milliseconds: Number(sporteventdata?.eventValue.split(":")[2]),
          }}
          onClose={() => setShowTimePicker(false)}
          onSave={(selected) => {
            const formatted = `${selected.minutes
              .toString()
              .padStart(2, '0')}:${selected.seconds
              .toString()
              .padStart(2, '0')}:${selected.milliseconds
              .toString()
              .padStart(2, '0')}`;
                  setShowTimePicker(false);
            console.log(formatted);
          }}
/>



          

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

 function InfoCard({
  label,
  value,
  onPressEdit,
}: {
  label: string;
  value: string;
  onPressEdit?: () => void;
}) {
  return (
    <View className="w-[48%] bg-white rounded-2xl p-3 mb-3 border border-gray-200">
      <View className="flex-row items-center -mt-[12px]">
        <Ionicons name="walk-outline" size={24} color="#6B7280" />
        <View className="mt-1 w-[80%] ml-[5px]">
          <View className="mt-1 justify-between">
            <TitleText size="text-18">{value}</TitleText>
            <Text className="text-black -mt-1">{label}</Text>
          </View>
        </View>
      </View>

     
        <TouchableOpacity
          className="absolute top-2 right-2 bg-white rounded-full p-[4px]"
          onPress={onPressEdit}
        >
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

 import React, { useEffect, useState } from 'react';
import {  View,  TouchableOpacity,  ScrollView,  Alert,  Modal,  FlatList,} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import Loader from '~/components/Loader';
import AppText from '~/components/AppText';
import SliderComponents from '~/components/SliderComponents';
import TestTypeToggle from './TestTypeToggle';
import AppInput from '~/components/AppInput';
import { getItem } from 'expo-secure-store';
import { MessagesText, PREF_KEYS } from '~/utils/Prefs';
import {  GetCollegePreferencesResponse,  MatterItem,  SimpleResponse,} from '~/services/DataModals';
import {  CollegePreferencesRequest,  Api_Url,  httpRequest2,} from '~/services/serviceRequest';
import TitleText from '~/components/TitleText';
import Tooltip from 'react-native-walkthrough-tooltip';
import CustomAlert from '~/components/CustomAlert';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectedGame } from './GamesGrid';
import MultiSelectToggle from '~/components/MultiSelectToggle';
 
type Props = {
  onNext?: () => void;
    goToLastStep?: () => void;
  stepToEdit: number | null;
    selectedGames: SelectedGame[];
      currentSteps : number;
};

 export type RootStackParamList = {
   Academic: {
    selectedGames: SelectedGame[];
    stepToEdit?: number | null;
  };
    EmailConnectionUI: {
    selectedGames: SelectedGame[];
    stepToEdit?: number | null;
  };

};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CollegePreferences({ onNext , goToLastStep , stepToEdit , selectedGames , currentSteps}: Props) {
  const navigation = useNavigation<Nav>(); 
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [recruitingOptions, setRecruitingOptions] = useState<MatterItem[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<number>(0);
  // const [campusType, setCampusType] = useState<'Urban' | 'Suburban' | 'Rural'>('Urban');
const [campusType, setCampusType] = useState<string>("");

  const [aidType, setAidType] = useState<'Yes' | 'No' | 'Not sure'>('Yes');
  const [decisionType, setDecisionType] = useState<'Yes' | 'No' | 'Maybe'>('Yes');
  const [schoolType, setSchoolType] = useState<'Small' | 'Medium' | 'Large'>('Small');
  const [actRigorType, setActRigorType] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [selectedReligious, setSelectedReligious] = useState('Doesn’t matter');
  const [regions, setRegions] = useState<string[]>([]);
  const [divisionsData, setDivisions] = useState<string[]>([]);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
 const [adviceModal, setAdviceModal] = useState<{
  visible: boolean;
  title: string;
  message: string;
  buttonText: string;
}>({
  visible: false,
  title: '',
  message: '',
  buttonText: '',
});

  const [form, setForm] = useState({
    what_matter_most: '',
    ncaa_division: '',
    preferred_region: '',
    school_size: '',
    academic_rigor: '',
    campus_type: '',
    need_financial_aid: '',
    early_decision_willingness: '',
    religious_affiliation: '',
    required_financial_aid : 0,
  });

const isFormValid = () => {
  return (
    form.what_matter_most &&
    selectedDivisions.length > 0 &&
    form.school_size &&
    form.academic_rigor 
    );
};

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const toggleDivision = (division: string) => {
    setSelectedDivisions((prev) =>
      prev.includes(division)
        ? prev.filter((d) => d !== division)
        : [...prev, division]
    );
  };

const showDivisionAdvice = (
  title?: string,
  message?: string,
  buttonText?: string
) => {
  // Alert.alert(
  //   title || 'Advice',
  //   message || 'We don’t recommend limiting yourself to just one division.',
  //   [{ text: buttonText || 'OK' }]
  // );
    setAdviceModal({
    visible: true,
    title: title || 'Advice',
    message: message || 'We don’t recommend limiting yourself to just one division.',
    buttonText: buttonText || 'OK',
  });

};

// const capitalize = (value: string | null | undefined): string | undefined => {
//   if (!value) return undefined;
//   return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
// };

const capitalize = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .split(",")
    .map(word => word.trim())
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(", ");
};




  useEffect(() => {
    let mounted = true;
    const fetchCollegePreferences = async () => {
      try {
        setLoading(true);
        const accessToken = await getItem(PREF_KEYS.accessToken);
        const res = await httpRequest2<GetCollegePreferencesResponse>(
          Api_Url.collegePreferences,
          'get',
          {},
          accessToken ?? ''
        );
         console.log('res_res_', res);
        console.log('res_res_', Api_Url.collegePreferences);

        if (mounted && res.status) {
          const mattersObject: MatterItem[] = res.lists.matters;
          const regionList: string[] = res.lists.regions;
           const divisionsList: string[] = res.lists.divisions;
          setRecruitingOptions(mattersObject);
          setRegions(regionList);
          setDivisions(divisionsList);
 
          const prefData = res.data;
          if (prefData) {
            setForm({
              what_matter_most: prefData.what_matter_most ?? '',
              ncaa_division: prefData.ncaa_division ?? '',
              preferred_region: prefData.preferred_region ?? '',
              school_size: capitalize(prefData.school_size) ?? 'Small',
              academic_rigor: capitalize(prefData.academic_rigor) ?? 'Low',
              campus_type: capitalize(prefData.campus_type) ?? '',
              need_financial_aid: prefData.need_financial_aid ?? '0',
              early_decision_willingness: prefData.early_decision_willingness ?? 'Yes',
              religious_affiliation: prefData.religious_affiliation ?? '',
              // required_financial_aid : prefData.required_financial_aid ?? 0
               required_financial_aid : formatNumber(prefData.required_financial_aid) ?? 0
            });

            const matchedOption = mattersObject.find(opt => opt.key === prefData.what_matter_most);
            if (matchedOption) setSelectedOption(matchedOption.key);

 
            let divisions: string[] = [];
            if (Array.isArray(prefData.ncaa_division)) {
              divisions = prefData.ncaa_division;
            } else if (typeof prefData.ncaa_division === 'string') {
             divisions = prefData.ncaa_division.split(',');
            }
            setSelectedDivisions(divisions);


      setSchoolType(
          (capitalize(prefData.school_size) ?? 'Small') as 'Small' | 'Medium' | 'Large'
        );

        setActRigorType(
          (capitalize(prefData.academic_rigor) ?? 'Low') as 'Low' | 'Medium' | 'High'
        );

        // setCampusType(
        //   (capitalize(prefData.campus_type) ?? 'Urban') as 'Urban' | 'Suburban' | 'Rural'
        // );
          setCampusType(capitalize(prefData.campus_type));

          console.log('campus_type_',form.campus_type);

        setDecisionType(
          (capitalize(prefData.early_decision_willingness) ?? 'Yes') as 'Yes' | 'No' | 'Maybe'
        );

            setSelectedReligious(prefData.religious_affiliation);
            setSelectedValue(formatNumber(prefData.required_financial_aid));
            // setAidType(prefData.need_financial_aid as 'yes' | 'no' | 'not sure');
          }
        }
      } catch (err) {
        Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCollegePreferences();
    return () => {
      mounted = false;
    };
  }, []);

const formatNumber = (value: number): number => {
  return Math.floor(value / 1000); 
};

const parseShortNumber = (num: number): number => {
  return num * 1000; // 200 → 200000
};




  const SaveCollegePreferencesRequest = async () => {
    try {
      setLoading(true);
      const token = await getItem(PREF_KEYS.accessToken);

      const reqBody: CollegePreferencesRequest = {
        ...form,
        ncaa_division: selectedDivisions.join(','),
        school_size : form.school_size.toLowerCase(),
        academic_rigor : form.academic_rigor.toLowerCase(),
        campus_type : form.campus_type.toLowerCase(),
        early_decision_willingness : form.early_decision_willingness.toLowerCase(),
        need_financial_aid : 'yes',
        required_financial_aid : parseShortNumber(selectedValue),
        religious_affiliation: "0", // If it's static
      };

      const res = await httpRequest2<SimpleResponse>(
        Api_Url.collegePreferences,
        'post',
        reqBody,
        token ?? '',
        true
      );

      if (res.status) {
          setLoading(false);
        setTimeout(() => {
         if(stepToEdit === 1){
          navigation.goBack();
         }else{
          navigation?.navigate('EmailConnectionUI' , {selectedGames : selectedGames, stepToEdit : null});
         }
        }, 300);
      } else {
          setLoading(false);
        Alert.alert('Error', res.message ?? 'Request failed');
      }
    } catch (err) {
        setLoading(false);
      Alert.alert('Error', 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

    const handleValueChange = (value: number) => {
    setSelectedValue(value);
  };

   
  

     const handleBack = () => {
      navigation.goBack();
       //  navigation?.navigate('Academic' , {selectedGames : [], stepToEdit : null});
      };



  return (
    <>
        <View className="flex-1 bg-background px-2 pt-14"> 
    
          <View className="flex-row items-center justify-between mb-1">
    
       <TouchableOpacity
                      onPress={handleBack}
                      className="w-12 h-12 rounded-full bg-[#E3E9E5] items-center justify-center"
                    >
                      <Ionicons name="chevron-back" size={24} color="#1A322E" />
                    </TouchableOpacity>

                          <View className="flex-1 mx-10 my-5">
                                            <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                                              <View
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${((3 + 1) / 6) * 100}%` }}
                                              />
                                            </View>
                                          </View>
                  </View>
    
        <View className="items-center mb-4 -mt-[6]">
                <TitleText className="text-center">
               College Preferences
                </TitleText>
                <AppText className="text-center mb-5 -mt-2 ml-2 mr-2">
                Choose your college preferences
                </AppText>
              </View>
      <ScrollView
        className="bg-background"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ marginHorizontal: 12 }}
      >
        <Loader show={loading} />

      <CustomAlert
      visible={adviceModal.visible}
      title={adviceModal.title}
      message={adviceModal.message}
      buttonText={adviceModal.buttonText}
      onClose={() => setAdviceModal((prev) => ({ ...prev, visible: false }))}
    />



 




        <View className="px-2">
          <TitleText className='mb-5'>When it comes to recruiting, what matters most to you?</TitleText>

          {recruitingOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => {
                setSelectedOption(option.key);
                handleChange('what_matter_most', option.key);
              }}
              className="flex-row items-center mb-2"
            >
              <View
                className={`w-6 h-6 rounded-full mx-3 border-2 items-center justify-center ${
                  selectedOption === option.key ? 'border-[#235D48] bg-[#235D48]' : 'border-gray-400'
                }`}
              >
                {selectedOption === option.key && (
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </View>
              <AppText  fontFamily='font-nunitoregular' color='text-black'>{option.value}</AppText>
            </TouchableOpacity>
          ))}

          <View>
            <View className="flex-row items-center justify-between">
              <TitleText>NCAA Division Interest</TitleText>
              <TouchableOpacity onPress={() => showDivisionAdvice()}>
                <Ionicons name="information-circle-outline" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap rounded-xl p-1 align-center">
              {divisionsData.map((division, index) => {
                const isSelected = selectedDivisions.includes(division);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleDivision(division)}
                    className={`flex-row items-center justify-between px-4 py-1 m-1 rounded-full min-w-[80px] ${
                      isSelected ? 'bg-white' : 'bg-transparent'
                    }`}
                    style={{
                      borderWidth: 1,
                      borderColor: isSelected ? '#235D48' : '#E5E7EB',
                    }}
                  >
                    <AppText className={isSelected ? 'text-black' : 'text-gray-600'}>
                      {division}
                    </AppText>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={isSelected ? '#235D48' : '#9CA3AF'}
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Preferred Region */}
          <View className="mt-3">
            <TitleText >Preferred Region</TitleText>
            <TouchableOpacity onPress={() => setShowRegionModal(true)}>
              <AppInput
                value={form.preferred_region}
                placeholder="Select Preferred Region"
                editable={false}
                pointerEvents="none"
                onChangeValue={() => {}}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-1 mt-3">
    <View className="flex-row items-center justify-between">
              <TitleText>School Size</TitleText>
<TouchableOpacity onPress={() => showDivisionAdvice("School size ranges" , MessagesText.School_Size_MSG)}>
                <Ionicons name="information-circle-outline" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>


            
            <TestTypeToggle
              options={['Small', 'Medium', 'Large']}
              initialValue={schoolType}
              onSelect={(selected) => {
                setSchoolType(selected as any);
                handleChange('school_size', selected);
              }}
            />
          </View>





          

          <View className="flex-1 mt-3">
                <View className="flex-row items-center justify-between">
              <TitleText>Academic Rigor</TitleText>
              {/* <TouchableOpacity onPress={() => showDivisionAdvice("Alert" , MessagesText.Academic_Rigor_MSG)}>
                <Ionicons name="information-circle-outline" size={22} color="#6b7280" />
              </TouchableOpacity> */}
            </View>
            <TestTypeToggle
              options={['Low', 'Medium', 'High']}
              initialValue={actRigorType}
              onSelect={(selected) => {
                setActRigorType(selected as any);
                handleChange('academic_rigor', selected);
              }}
            />
          </View>

          <View className="flex-1 mt-3">
            <TitleText>Campus Type</TitleText>
            {/* <TestTypeToggle
              options={['Urban', 'Suburban', 'Rural']}
              initialValue={campusType}
              onSelect={(selected) => {
                setCampusType(selected as any);
                handleChange('campus_type', selected);
              }}
            /> */}
           <MultiSelectToggle
              options={['Urban', 'Suburban', 'Rural']}
              initialValues={campusType ? campusType.split(", ") : []}
              onSelect={(selected) => {
                const asString = selected.join(", ");
              console.log("Selected Options:", asString);
              setCampusType(asString);
                handleChange('campus_type', asString);
              }}
            />
          </View>

          <View className="flex-1 mb-2 mt-3">
            <TitleText>Early Decision Willingness</TitleText>
            <TestTypeToggle
              options={['Yes', 'No', 'Maybe']}
              initialValue={decisionType}
              onSelect={(selected) => {
                setDecisionType(selected as any);
                handleChange('early_decision_willingness', selected);
              }}
            />
          </View>

          <View className="flex-1 mb-2 mt-3">
            {/* <TitleText>Do you need financial aid?</TitleText>
           <TestTypeToggle
              options={['yes', 'no', 'not sure']}
              initialValue={aidType}
              onSelect={(selected) => {
                setAidType(selected as any);
                handleChange('need_financial_aid', selected);
                if (selected === 'Yes') {
                  handleChange('financial_aid_amount', selectedValue.toString());
                } else {
                  handleChange('financial_aid_amount', '0');
                }
              }}
            />
            {aidType === 'yes' && (
             <SliderComponents
            initialValue={selectedValue} // <-- passed from API
            onValueChange={(value) => {
              setSelectedValue(value);
              handleChange('financial_aid_amount', value.toString());
            }}
          />

            )} */}

        <TitleText>How much money do you estimate your family can pay in tuition per year?</TitleText> 
             <SliderComponents
            initialValue={selectedValue} 
            onValueChange={(value) => {
              setSelectedValue(value);
              handleChange('required_financial_aid', value.toString());
            }}
          />

          </View>

          <View style={{ paddingHorizontal: 8, marginTop: 32 }}>
            <ArrowButton text="Continue" onPress={SaveCollegePreferencesRequest} fullWidth disabled={!isFormValid()} />
          </View>
        </View>
      </ScrollView>

      {/* Modal for Region Selection */}
   <Modal
  animationType="slide"
  transparent
  visible={showRegionModal}
  onRequestClose={() => setShowRegionModal(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)', // black with 40% opacity
      justifyContent: 'flex-end', // Push modal to bottom
      alignItems: 'center',
    }}
  >
    <View className="w-[100%] bg-white rounded-t-xl p-4 max-h-[70%]">
      <AppText size="text-18" className="mb-4 text-center font-semibold">
        Select Region
      </AppText>

   <FlatList
  data={regions}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => {
    const isSelected = form.preferred_region === item;
    return (
      <TouchableOpacity
        className="py-3 border-b border-gray-200 px-4 flex-row justify-between items-center"
        onPress={() => {
          handleChange('preferred_region', item);
          setShowRegionModal(false);
        }}
      >
        <AppText size="text-16">{item}</AppText>
        {isSelected && (
          <Ionicons name="checkmark" size={20} color="#235D48" />
        )}
      </TouchableOpacity>
    );
  }}
/>


   <View className='mb-4'>
       <TouchableOpacity className="mt-4 items-center" onPress={() => setShowRegionModal(false)}>
        <AppText className="text-red-500">Cancel</AppText>
      </TouchableOpacity>
   </View>
    </View>
  </View>
</Modal>
</View>
    </>
  );
}

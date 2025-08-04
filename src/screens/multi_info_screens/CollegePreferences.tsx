// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import ArrowButton from '~/components/ArrowButton';
// import Loader from '~/components/Loader';
// import AppText from '~/components/AppText';
// import SliderComponents from '~/components/SliderComponents';
// import AcademicRigorSlider from '~/components/AcademicRigorSlider';
// import TestTypeToggle from './TestTypeToggle';
// import AppInput from '~/components/AppInput';
// import ReligiousAffiliationSlider from '~/components/ReligiousAffiliationSlider';
// import FinancialAidSlider from '~/components/FinancialAidSlider';
// import { getItem } from 'expo-secure-store';
// import { PREF_KEYS } from '~/utils/Prefs';
// import { AcademicResponse, GetCollegePreferencesResponse, GetSportsAlldata, MatterItem } from '~/services/DataModals';
// import { Api_Url, httpRequest2 } from '~/services/serviceRequest';

// type Props = {
//   onNext?: () => void;
// };

// const recruitingOptions = [
//   'Play at the highest level I can',
//   'Get into the best academic school I can',
//   'Use my sport to help pay for college',
//   'Just want to keep playing and enjoy the experience',
// ];

// // const divisionOptions = ['D1', 'D2', 'D3', 'NAIA', 'NJCAA'];
//  const divisionOptions = ['D1', 'D2', 'D3'];


// export default function CollegePreferences({ onNext }: Props) {
//   const [loading, setLoading] = useState(false);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
//   const [selectedRigor, setSelectedRigor] = useState('Just get me in');
//   const [selectedValue, setSelectedValue] = useState<number>(2000);
//   const [campusType, setCampusType] = useState<'Urban' | 'Suburban' | 'Rural'>('Urban');
//   const [aidType, setAidType] = useState<'Yes' | 'No' | 'Not Sure'>('Yes');
//   const [decisionType, setDecisionType] = useState<'Yes' | 'No' | 'Maybe'>('Yes');
//   const [schoolType, setSchoolType] = useState<'Small' | 'Medium' | 'Large'>('Small');
//   const [actRigorType, setActRigorType] = useState<'Low' | 'Medium' | 'High'>('Low');


 

//     const [selectedReligious, setSelectedReligious] = useState('Doesn’t matter');
//     const [selectedFinancial, setSelectedFinancial] = useState('None');


     


//     const [form, setForm] = useState({
//       campusType: '',
//       aidType: '',
//       schoolType : '',
//       actRigorType : '',
//     });

//     const handleChange = (key: string, val: string) => {
//       setForm((prev) => ({ ...prev, [key]: val }));
//     };

//   const toggleDivision = (division: string) => {
//     setSelectedDivisions(prev =>
//       prev.includes(division)
//         ? prev.filter(d => d !== division)
//         : [...prev, division]
//     );
//   };

//   const showDivisionAdvice = () => {
//     Alert.alert(
//       'Advice',
//       "We don’t recommend limiting yourself to just one division.",
//       [{ text: 'OK' }],
//     );
//   };

//   const handleRigorChange = (value: React.SetStateAction<string>) => {
//     setSelectedRigor(value);
//     console.log('Selected Academic Rigor:', value);
//   };

//   const handleValueChange = (value: number) => {
//     setSelectedValue(value);
//     console.log('Selected Value:', value);
//   };


//     const handleReligiousChanges = (value: React.SetStateAction<string>) => {
//       setSelectedReligious(value);
//       console.log('Selected Academic Rigor:', value);
//     };
//         const handleFinancialChanges = (value: React.SetStateAction<string>) => {
//           setSelectedFinancial(value);
//           console.log('Selected Academic Rigor:', value);
//           };
    


//    useEffect(() => {
//     let mounted = true;
  
//     const fetchCollegePreferences = async () => {
//       try {
//         setLoading(true);
//         const accessToken = await getItem(PREF_KEYS.accessToken);
//         const res = await httpRequest2<GetCollegePreferencesResponse>(
//           Api_Url.collegePreferences,
//           'get',
//           {},
//           accessToken ?? ''
//         );
  
//         if (mounted && res.status) {
//             console.log(res.lists.matters);
//       const mattersObject = res.lists.matters as unknown as { [key: string]: string };
//       const mattersArray: MatterItem[] = Object.entries(mattersObject).map(
//         ([key, value]) => ({
//           key,
//           value,
//         })
//       );

//       // Optional: Replace the original object with the array (if you want to keep using `res`)
//       res.lists.matters = mattersArray;


//         }
//       } catch (err) {
//         console.log('Error fetching athletic data', err);
//         Alert.alert('Error', 'Unexpected error occurred.');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
  
//     fetchCollegePreferences();
  
//     return () => {
//       mounted = false;
//     };
//   }, []);
 

//   return (
//     <ScrollView
//       className="bg-background"
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ paddingBottom: 100 }}
//       style={{ marginHorizontal: 12 }}
//     >
//       <Loader show={loading} />

//           <View className="px-2">
//         {/* Recruiting Priorities */}
//         <AppText>
//           When it comes to recruiting, what matters most to you?
//         </AppText>

//         {recruitingOptions.map((option, index) => (
//           <TouchableOpacity
//             key={index}
//             onPress={() => setSelectedOption(option)}
//             className="flex-row items-center mb-4"
//           >
//             <View
//               className={`w-6 h-6 rounded-full mx-3 border-2 items-center justify-center ${
//                 selectedOption === option ? 'border-[#235D48] bg-[#235D48]' : 'border-gray-400'
//               }`}
//             >
//               {selectedOption === option && (
//                 <View className="w-2.5 h-2.5 rounded-full bg-white" />
//               )}
//             </View>
//             <AppText className="text-16 text-light">
//               {option}
//             </AppText>
//           </TouchableOpacity>
//         ))}

//         {/* NCAA Division Interest */}
//         <View>
//           <View className="flex-row items-center justify-between">
//             <AppText  className="font-semibold">
//               NCAA Division Interest
//             </AppText>
//             <TouchableOpacity onPress={showDivisionAdvice}>
//               <Ionicons name="information-circle-outline" size={22} color="#6b7280" />
//             </TouchableOpacity>
//           </View>

//           <View className="flex-row flex-wrap rounded-xl p-1 align-center">
//             {divisionOptions.map((division, index) => {
//               const isSelected = selectedDivisions.includes(division);
//               return (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => toggleDivision(division)}
//                   className={`flex-row items-center justify-between px-4 py-1 m-1 rounded-full min-w-[80px] ${
//                     isSelected ? 'bg-white' : 'bg-transparent'
//                   }`}
//                   style={{
//                     borderWidth: 1,
//                     borderColor: isSelected ? '#007AFF' : '#E5E7EB',
//                   }}
//                 >
//                   <AppText
//                     className={isSelected ? 'text-[#007AFF]' : 'text-gray-600'}
//                   >
//                     {division}
//                   </AppText>
//                   <Ionicons
//                     name="checkmark"
//                     size={16}
//                     color={isSelected ? '#007AFF' : '#9CA3AF'}
//                     style={{ marginLeft: 8 }}
//                   />
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         {/* Preferred Region Placeholder */}
//         <View className="mt-2">
//             <AppText>
//               Preferred Region
//             </AppText>
//          <AppInput
//               value=''
//               keyboardType="numeric"
//               onChangeValue={(text) => handleChange('test_score', text)}
//               placeholder={`Select Preferred Region`}
//             />
//         </View>
            

//         {/* School Size Slider */}
//            <View className="flex-1">
//             <AppText>
//               School Size
//             </AppText>
//                      <TestTypeToggle
//               options={['Small', 'Medium', 'Large']}
//               initialValue={schoolType}
//               onSelect={(selected) => {
//                 setSchoolType(selected as 'Small' | 'Medium' | 'Large');
//                 handleChange('schoolType', selected);
//               }}
//             />  

//           </View>
 
//         {/* Academic Rigor */}
//            <View className="flex-1 mt-2">
//             <AppText>
//               Academic Rigor
//             </AppText>
//                       {/* <AcademicRigorSlider onValueChange={handleRigorChange} /> */}

//                          <TestTypeToggle
//               options={['Low', 'Medium', 'High']}
//               initialValue={actRigorType}
//               onSelect={(selected) => {
//                 setActRigorType(selected as 'Low' | 'Medium' | 'High');
//                 handleChange('actRigorType', selected);
//               }}
//             />  
 
//           </View>
 

//   {/* Campus Type */}
//            <View className="flex-1 mt-3">
//             <AppText>
//               Campus Type
//             </AppText>
//              <TestTypeToggle
//               options={['Urban', 'Suburban', 'Rural']}
//               initialValue={campusType}
//               onSelect={(selected) => {
//                 setCampusType(selected as 'Urban' | 'Suburban' | 'Rural');
//                 handleChange('campusType', selected);
//               }}
//             />
//           </View>


//             {/* Early Decision Willingness */}
//            <View className="flex-1 mb-2">
//             <AppText>
//               Early Decision Willingness
//             </AppText>
//              <TestTypeToggle
//               options={['Yes', 'No', 'Maybe']}
//               initialValue={decisionType}
//               onSelect={(selected) => {
//                 setDecisionType(selected as 'Yes' | 'No' | 'Maybe');
//                 handleChange('aidType', selected);
//               }}
//             />
//           </View>

          
 

//         {/* Aid */}
//             <View className="flex-1 mb-2">
//               <AppText>
//                 Do you need financial aid?
//               </AppText>

//               <TestTypeToggle
//                 options={['Yes', 'No', 'Not Sure']}
//                 initialValue={aidType}
//                 onSelect={(selected) => {
//                   setAidType(selected as 'Yes' | 'No' | 'Not Sure');
//                   handleChange('aidType', selected);
//                 }}
//               />

//               {aidType === 'Yes' && (
//                  <SliderComponents onValueChange={handleValueChange} />
//               )}
//             </View>

          
 







        





//             {/* Religious Affiliation */}
//            {/* <View className="flex-1 mb-2">
//             <AppText>
//               Religious Affiliation
//             </AppText>
//             <ReligiousAffiliationSlider onValueChange={handleReligiousChanges} />

//           </View> */}
          
 
 


//         {/* Continue Button */}
//         <View style={{ paddingHorizontal: 8, marginTop: 32 }}>
//           <ArrowButton
//             text="Continue"
//             onPress={() => {
//               onNext?.();
//             }}
//             fullWidth
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// }
 


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

type Props = {
  onNext?: () => void;
    goToLastStep?: () => void;
  stepToEdit: number | null;
};

const divisionOptions = ['D1', 'D2', 'D3'];

export default function CollegePreferences({ onNext , goToLastStep , stepToEdit}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [recruitingOptions, setRecruitingOptions] = useState<MatterItem[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<number>(2000);
  const [campusType, setCampusType] = useState<'urban' | 'suburban' | 'rural'>('urban');
  const [aidType, setAidType] = useState<'yes' | 'no' | 'not sure'>('yes');
  const [decisionType, setDecisionType] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [schoolType, setSchoolType] = useState<'small' | 'medium' | 'large'>('small');
  const [actRigorType, setActRigorType] = useState<'low' | 'medium' | 'high'>('low');
  const [selectedReligious, setSelectedReligious] = useState('Doesn’t matter');
  const [regions, setRegions] = useState<string[]>([]);
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

//   const isFormValid = () => {
//   return (
//     form.what_matter_most &&
//     selectedDivisions.length > 0 &&
//     form.preferred_region &&
//     form.school_size &&
//     form.academic_rigor &&
//     form.campus_type &&
//     form.need_financial_aid &&
//     form.early_decision_willingness &&
//     (form.need_financial_aid !== 'Yes' || parseInt(form.financial_aid_amount) > 0)
//   );
// };

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

        console.log(accessToken);

        if (mounted && res.status) {
          console.log(res);
          const mattersObject: MatterItem[] = res.lists.matters;
          const regionList: string[] = res.lists.regions;
          setRecruitingOptions(mattersObject);
          setRegions(regionList);

          const prefData = res.data;
          if (prefData) {
            setForm({
              what_matter_most: prefData.what_matter_most ?? '',
              ncaa_division: prefData.ncaa_division ?? '',
              preferred_region: prefData.preferred_region ?? '',
              school_size: prefData.school_size ?? '',
              academic_rigor: prefData.academic_rigor ?? '',
              campus_type: prefData.campus_type ?? '',
              need_financial_aid: prefData.need_financial_aid ?? '',
              early_decision_willingness: prefData.early_decision_willingness ?? '',
              religious_affiliation: prefData.religious_affiliation ?? '',
              required_financial_aid : prefData.required_financial_aid ?? 0
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


            setSchoolType(prefData.school_size as 'small' | 'medium' | 'large');
            setActRigorType(prefData.academic_rigor as 'low' | 'medium' | 'high');
            setCampusType(prefData.campus_type as 'urban' | 'suburban' | 'rural');
            // setAidType(prefData.need_financial_aid as 'yes' | 'no' | 'not sure');
            setDecisionType(prefData.early_decision_willingness as 'yes' | 'no' | 'maybe');
            setSelectedReligious(prefData.religious_affiliation);
            console.log('fins ', prefData.required_financial_aid);
            setSelectedValue(prefData.required_financial_aid);
          }
        }
      } catch (err) {
        console.log('Error fetching preferences', err);
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

  const SaveCollegePreferencesRequest = async () => {
    try {
      setLoading(true);
      const token = await getItem(PREF_KEYS.accessToken);

      const reqBody: CollegePreferencesRequest = {
        ...form,
        ncaa_division: selectedDivisions.join(','),
        need_financial_aid : 'yes',
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
        setTimeout(() => {
          if(stepToEdit != null){
          goToLastStep?.();
          }else{
          onNext?.();
          }
        }, 300);
      } else {
        Alert.alert('Error', res.message ?? 'Request failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

    const handleValueChange = (value: number) => {
    setSelectedValue(value);
    console.log('Selected Value:', value);
  };

 

  return (
    <>
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
              {divisionOptions.map((division, index) => {
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
              options={['low', 'medium', 'high']}
              initialValue={actRigorType}
              onSelect={(selected) => {
                setActRigorType(selected as any);
                handleChange('academic_rigor', selected);
              }}
            />
          </View>

          <View className="flex-1 mt-3">
            <TitleText>Campus Type</TitleText>
            <TestTypeToggle
              options={['urban', 'suburban', 'rural']}
              initialValue={campusType}
              onSelect={(selected) => {
                setCampusType(selected as any);
                handleChange('campus_type', selected);
              }}
            />
          </View>

          <View className="flex-1 mb-2 mt-3">
            <TitleText>Early Decision Willingness</TitleText>
            <TestTypeToggle
              options={['yes', 'no', 'naybe']}
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
        renderItem={({ item }) => (
          <TouchableOpacity
            className="py-3 border-b border-gray-200 px-4"
            onPress={() => {
              handleChange('preferred_region', item);
              setShowRegionModal(false);
            }}
          >
            <AppText size="text-16">{item}</AppText>
          </TouchableOpacity>
        )}
      />

   <View className='mb-4'>
       <TouchableOpacity className="mt-4 items-center" onPress={() => setShowRegionModal(false)}>
        <AppText className="text-red-500">Cancel</AppText>
      </TouchableOpacity>
   </View>
    </View>
  </View>
</Modal>

    </>
  );
}

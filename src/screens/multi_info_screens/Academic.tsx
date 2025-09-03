import React, { useEffect, useState } from 'react';
import {  View,  Text,  TouchableOpacity,  ScrollView,  Alert,  Keyboard,  TouchableWithoutFeedback, InteractionManager,} from 'react-native';
import TestTypeToggle from './TestTypeToggle';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';
import { PREF_KEYS } from '~/utils/Prefs';
import { getItem } from 'expo-secure-store';
import { AcademicRequest, Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { AcademicMajor, AcademicResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
import { setMajorFromAPI, validateACTScore, validateGPA, validateSATScore, validateScore } from '~/utils/AppFunctions';
import TitleText from '~/components/TitleText';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SelectedGame } from './GamesGrid';

type Props = {
  onNext?: () => void;
  goToLastStep?: () => void;
  stepToEdit: number | null;
  selectedGames: SelectedGame[];
  currentSteps : number;
};

export type RootStackParamList = {
   Athletic: {
    selectedGames: SelectedGame[];
    stepToEdit?: number | null;
  };
   Academic: {
    selectedGames: SelectedGame[];
    stepToEdit?: number | null;
  };
    CollegePreferences: {
    selectedGames: SelectedGame[];
    stepToEdit?: number | null;
  };

};
type Nav = NativeStackNavigationProp<RootStackParamList>;

const Academic: React.FC<Props> = ({ onNext , goToLastStep , stepToEdit, selectedGames , currentSteps }) => {
  const navigation = useNavigation<Nav>(); 
  const [testType, setTestType] = useState<'SAT' | 'ACT'>('SAT');
  const [schoolType, setSchoolType] = useState<'Public' | 'Private' | 'Boarding'>('Public');
  const [NCAAType, setNCAAType] = useState<'Yes' | 'No' | 'Unsure'>('Yes');
  const [loading, setLoading] = useState(false);
  const [apiMajors, setApiMajors] = useState<AcademicMajor[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [majors, setMajors] = useState([{ search: '', showList: false }]);
  const [screenload, setScreenload] = useState(false);

  const [form, setForm] = useState({
    weighted_gpa: '0',
    unweighted_gpa: '',
    test_score_type: '',
    sat_score: '',
    act_score : '',
    intended_major_1: '',
    intended_major_2: '',
    intended_major_3: '',
    school_name: '',
    school_type: '',
    ncaa_eligibility_status: '0',
  });

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (key === 'unweighted_gpa') validateGPA(val, setErrors);

    // validateSATScore(form.sat_score, setErrors);
    // validateACTScore(form.act_score, setErrors);

     if (key === 'sat_score') validateScore(val, form.test_score_type as 'SAT' | 'ACT', setErrors);
     if (key === 'act_score') validateScore(val, form.test_score_type as 'SAT' | 'ACT', setErrors);

  };

  const getFilteredMajors = (search: string) =>
    apiMajors.filter((item) => item.display_name.toLowerCase().includes(search.toLowerCase()));
/*
  const isFormValid = () => {
    const requiredFields = [
      'unweighted_gpa',
      'intended_major_1',
      //  'intended_major_2',
      //   'intended_major_3',
      'school_name',
      'school_type',
      'test_score_type',
    ];
     const hasErrors = Object.values(errors).some((e) => e);
    const isEmpty = requiredFields.some((f) => !form[f as keyof typeof form]);
    return !hasErrors && !isEmpty;
  };
*/
const isFormValid = () => {
  const requiredFields = [
    "unweighted_gpa",
    "intended_major_1",
    "school_name",
    "school_type",
    "test_score_type",
  ];

  const hasErrors = Object.values(errors).some((e) => e);

  const isEmpty = requiredFields.some(
    (f) => !form[f as keyof typeof form]?.toString().trim()
  );

  // ✅ At least one test score required
  const hasTestScore =
    !!form.sat_score?.toString().trim() ||
    !!form.act_score?.toString().trim();

  return !hasErrors && !isEmpty && hasTestScore;
};



  const addMajor = () => {
    if (majors.length < 3) {
      setMajors((prev) => [...prev, { search: '', showList: false }]);
    }
  };

  const AcademicApiRequest = async () => {
    try {
      setLoading(true);
      const token = await getItem(PREF_KEYS.accessToken);
      const res = await httpRequest2<AcademicResponse>(Api_Url.academic, 'get', {}, token ?? '');
      if (res.status && res.data) {
// console.log('res_res_', res);
        if(res.data?.sat_score > 0){
            setTestType("SAT");
            handleChange('test_score_type', "SAT");
        }else if(res.data?.act_score > 0){
          setTestType("ACT");
          handleChange('test_score_type', "ACT");
        }else{
           setTestType("SAT");
            handleChange('test_score_type', "SAT");
        }
       /* const testType = res.data.test_score_type?.toUpperCase() === 'ACT' ? 'ACT' : 'SAT';
        setTestType(testType);
        handleChange('test_score_type', testType);
*/
        if(res.data?.sat_score > 0){
          handleChange('sat_score', res.data?.sat_score?.toString());
        }
        if(res.data?.act_score > 0){
            handleChange('act_score', res.data?.act_score?.toString());
        }

          // validateSATScore(form.sat_score, setErrors);
          // validateACTScore(form.act_score, setErrors);

      // validateScore(res.data?.test_score, res.data.test_score_type.toUpperCase as 'SAT' | 'ACT', setErrors);
    /*  validateScore(
        res.data?.act_score,
        res.data?.test_score_type?.toUpperCase() as 'SAT' | 'ACT',
        setErrors
      );
*/



        const type = res.data.school_type; 
        if (['public', 'private', 'boarding'].includes(type)) {
        setSchoolType(type as 'Public' | 'Private' | 'Boarding');
         handleChange('school_type', type); // optional if needed
       }else{
         setSchoolType('Public');
         handleChange('school_type', 'Public'); // optional if needed
       }

        const ncaa = res.data.ncaa_eligibility_status;
        if (['Yes', 'No', 'Unsure'].includes(ncaa)) {
          setNCAAType("Unsure"); // this is hardcoded  becuase item removed from the UI
          handleChange('ncaa_eligibility_status', ncaa);
        }

        const list = res.lists?.AcademicMajors ?? [];
        setApiMajors(list);

        // setMajors((prev) => {
        //   const filled = [...prev];
        //   while (filled.length < 3) filled.push({ search: '', showList: false });
        //   return filled;
        // });
          const majorsFromAPI = [
          res.data?.intended_major,
          res.data?.intended_major_2,
          res.data?.intended_major_3,
          ];

          // Filter only non-empty values
          const filledMajors = majorsFromAPI.filter(m => m && m.trim() !== "");

          // If API gives nothing → show 1 input
          const majorsCount = filledMajors.length > 0 ? filledMajors.length : 1;

          setMajors(Array.from({ length: majorsCount }, () => ({ search: "", showList: false })));

          // Now assign each API value to corresponding input
          setMajorFromAPI(res.data?.intended_major, 0, list, setMajors, handleChange);
          setMajorFromAPI(res.data?.intended_major_2, 1, list, setMajors, handleChange);
          setMajorFromAPI(res.data?.intended_major_3, 2, list, setMajors, handleChange);


        // setMajorFromAPI(res.data?.intended_major, 0, list, setMajors, handleChange);
        // setMajorFromAPI(res.data?.intended_major_2, 1, list, setMajors, handleChange);
        // setMajorFromAPI(res.data?.intended_major_3, 2, list, setMajors, handleChange);

         
        setForm((prev) => ({
          ...prev,
          weighted_gpa: res.data?.weighted_gpa ?? '',
          unweighted_gpa: res.data?.unweighted_gpa ?? '',
          school_name: res.data?.school_name ?? '',
        }));
         setLoading(false);
         setScreenload(true);
      } else {
         setLoading(false);
          setScreenload(true);
        Alert.alert('Error', res.message ?? 'Something went wrong');
      }
    } catch (err) {
       setLoading(false);
        setScreenload(true);
      Alert.alert('Error', 'Unexpected error occurred');
    } finally {
      setLoading(false);
       setScreenload(true);
    }
  };

  useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
       setTimeout(() => { 
            AcademicApiRequest();
            }, 100);
        });
         return () => task.cancel();
  }, []);

  const SaveProfileRequest = async () => {
    try {
      setLoading(true);
      const token = await getItem(PREF_KEYS.accessToken);
     /* const reqBody: AcademicRequest = {
        weighted_gpa: '0',
        unweighted_gpa: form.unweighted_gpa,
        test_score_type: form.test_score_type.toLowerCase(),
        sat_score : form.sat_score,
        act_score : form.act_score,
        intended_major: form.intended_major_1,
        intended_major_2: form.intended_major_2,
        intended_major_3: form.intended_major_3,
        school_name: form.school_name,
        school_type: form.school_type.toLowerCase(),
        ncaa_eligibility_status: form.ncaa_eligibility_status,
      };
      */
     const reqBody: AcademicRequest = {
          weighted_gpa: '0',
          unweighted_gpa: form.unweighted_gpa,
          test_score_type: form.test_score_type.toLowerCase(),
          sat_score: form.sat_score,
          act_score: form.act_score,
          intended_major: form.intended_major_1,
          school_name: form.school_name,
          school_type: form.school_type.toLowerCase(),
          ncaa_eligibility_status: form.ncaa_eligibility_status,
        };
        if (form.intended_major_2) {
          reqBody.intended_major_2 = form.intended_major_2;
        }
        if (form.intended_major_3) {
          reqBody.intended_major_3 = form.intended_major_3;
        }


      const res = await httpRequest2<AcademicResponse>(Api_Url.academic, 'post', reqBody, token ?? '', true);

      if (res.status) {
          setLoading(false);
          setTimeout(() => {
            if(stepToEdit === 1){
                navigation?.goBack();
            }else{
             navigation?.navigate('CollegePreferences' , {selectedGames : selectedGames, stepToEdit : null});
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

    const handleBack = () => {
       navigation.goBack();
    // navigation?.navigate('Athletic' , {selectedGames : [], stepToEdit : null});
  };

  return (
  
    <View className="flex-1 bg-background px-4 pt-14"> 
       {screenload ? (
      //Screen content shows after screenload = true
    <> 
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
                            style={{ width: `${((2 + 1) / 6) * 100}%` }}
                          />
                        </View>
                      </View>
              </View>
        

    <View className="items-center mb-4 -mt-[6]">
            <TitleText className="text-center">
             Academic Information
            </TitleText>
            <AppText className="text-center mb-5 -mt-2 ml-2 mr-2">
            Help colleges see your academic strengths
            </AppText>
          </View>


    <ScrollView keyboardShouldPersistTaps="handled" 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 100 }}>

      {/* GPA */}
      <View className="px-2">
        <TitleText text="Unweighted GPA" />
        {/* <AppInput
          value={form.unweighted_gpa}
          keyboardType="decimal-pad"
          onChangeValue={(text) => handleChange('unweighted_gpa', text)}
          placeholder="Enter GPA (0 - 4.5)"
        /> */}
        {/* <AppInput
        value={form.unweighted_gpa}
        keyboardType="decimal-pad"
        onChangeValue={(text) => handleChange("unweighted_gpa", text)}
        placeholder="Enter GPA (0 - 4.5)"
        onBlur={() => {
          let gpa = form.unweighted_gpa;
          if (gpa && gpa.endsWith(".")) {
            gpa = gpa + "0";
          }
          const num = parseFloat(gpa);
          if (!isNaN(num)) {
            if (num < 0) gpa = "0";
            if (num > 4.5) gpa = "4.5";
          }

          const fixed = validateGPA(gpa, setErrors);
          if (fixed !== undefined) {
            handleChange("unweighted_gpa", fixed);
          }
        }}
      /> */}
      <AppInput
      value={form.unweighted_gpa}
      keyboardType="decimal-pad"
      onChangeValue={(text) => handleChange("unweighted_gpa", text)}
      placeholder="Enter GPA (0 - 4.5)"
      onBlur={() => {
        let gpa = form.unweighted_gpa;

        if (gpa) {
          // If ends with "." → add trailing zero
          if (gpa.endsWith(".")) {
            gpa = gpa + "0";
          }
          // If it's just an integer → add ".0"
          else if (/^\d+$/.test(gpa)) {
            gpa = gpa + ".0";
          }
        }

        // clamp between 0 and 4.5
        const num = parseFloat(gpa);
        if (!isNaN(num)) {
          if (num < 0) gpa = "0.0";
          if (num > 4.5) gpa = "4.5";
        }

        const fixed = validateGPA(gpa, setErrors);
        if (fixed !== undefined) {
          handleChange("unweighted_gpa", fixed);
        }
      }}
    />



        {errors.unweighted_gpa && <Text className="text-red-500">{errors.unweighted_gpa}</Text>}

        <TitleText className="mt-3">Test Scores</TitleText>
        <TestTypeToggle
          options={['SAT', 'ACT']}
          initialValue={testType}
          onSelect={(sel) => {
            setTestType(sel as 'SAT' | 'ACT');
            handleChange('test_score_type', sel);
           if (sel === 'SAT') {
              validateSATScore(form.sat_score, setErrors);
            } else {
              validateACTScore(form.act_score, setErrors);
            }

            // validateScore(form.test_score, sel as 'SAT' | 'ACT', setErrors);
          }}
        />
          {testType === 'SAT' && (
          <AppInput
            value={form.sat_score}
            keyboardType="numeric"
            onChangeValue={(text) => handleChange('sat_score', text)}
            placeholder={`Enter ${testType} score`}
          />
          )}
        {/* Show ACT input only if act is selected */}
        {testType === 'ACT' && (
          <AppInput
            value={form.act_score}
            keyboardType="numeric"
            onChangeValue={(text) => handleChange('act_score', text)}
            placeholder="Enter ACT score"
          />
        )}

     {/* SAT error */}
          {testType === 'SAT' && errors.sat_score && (
            <Text className="text-red-500">{errors.sat_score}</Text>
          )}

          {/* ACT error */}
          {testType === 'ACT' && errors.act_score && (
            <Text className="text-red-500">{errors.act_score}</Text>
          )}

      </View>

      {/* Intended Majors Section */}
        <TitleText  className='mt-3 -mb-3'>
          Intended Major 
        </TitleText>
      <View className="px-4 py-4 mt-4  bg-gray-200 rounded-3xl">
         {/* <AppText>
                Select upto 3 in order of preference
        </AppText> */}

         {majors.map((major, index) => (
          <TouchableWithoutFeedback key={index} onPress={Keyboard.dismiss}>
            <View className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <AppText>Intended Major {index + 1}</AppText>
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setMajors((prev) => prev.filter((_, i) => i !== index));
                      handleChange(`intended_major_${index + 1}`, '');
                    }}
                  >
                    <Text className="text-red-600">🗑️</Text>
                  </TouchableOpacity>
                )}
              </View>

              <AppInput
                placeholder="Search or type a major"
                value={major.search}
                onFocus={() => {
                  const updated = [...majors];
                  updated[index].showList = true;
                  setMajors(updated);
                }}
                onChangeValue={(text) => {
                  const updated = [...majors];
                  updated[index].search = text;
                  updated[index].showList = true;
                  setMajors(updated);
                }}
                 onBlur={() => {
          // hide dropdown on outside click / blur
          setTimeout(() => {
            const updated = [...majors];
            updated[index].showList = false;
            setMajors(updated);
          }, 50);
        }}
              />

              {major.showList && getFilteredMajors(major.search).length > 0 && (
                <View className="bg-white rounded max-h-[250px] -mt-2 w-full">
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {getFilteredMajors(major.search).map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                          const updated = [...majors];
                          updated[index].search = item.display_name;
                          updated[index].showList = false;
                          setMajors(updated);
                          handleChange(`intended_major_${index + 1}`, item.id);
                          Keyboard.dismiss();
                        }}
                        className="py-1 px-4"
                      >
                        <AppText>{item.display_name}</AppText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        ))}

        {majors.length < 3 && (
          <TouchableOpacity
            onPress={addMajor}
            className="mt-0 bg-primary py-2 px-4 rounded-full self-end"
          >
            <Text className="text-white">+ Add Major</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* School Name */}
      <View className="px-2 mt-6">
        <TitleText className="mb-1">High School Name</TitleText>
        <AppInput
          value={form.school_name}
          onChangeValue={(text) => handleChange('school_name', text)}
          placeholder="Enter School Name"
        />
      </View>

      {/* School Type */}
      <View className="px-2 mt-4">
        <TitleText className="mb-1">High School Type</TitleText>
        <TestTypeToggle
          options={['Public', 'Private', 'Boarding']}
          initialValue={schoolType}
          onSelect={(sel) => {
            setSchoolType(sel as 'Public' | 'Private' | 'Boarding');
            handleChange('school_type', sel);
          }}
        />
      </View>

      {/* Submit Button */}
      <View className="px-2 py-6">
        <ArrowButton
          text="Continue"
          onPress={async () => {
            if (!isFormValid()) return;
            await SaveProfileRequest();
          }}
          fullWidth
          disabled={!isFormValid()}
        />
      </View>
    </ScrollView>
 </>
    ) : (
      // ⏳ Loader while screenload = false
      <View className="flex-1 items-center justify-center">
        
      </View>
    )}

          <Loader show={loading} />

    </View>
  );
};

export default Academic;

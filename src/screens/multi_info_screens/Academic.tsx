// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import TestTypeToggle from './TestTypeToggle';
// import AppText from '~/components/AppText';
// import AppInput from '~/components/AppInput';

// const schoolTypes = ['Public', 'Private', 'Boarding'];
// const ncaaStatuses = ['Yes', 'No', 'Unsure'];
// const majors = [
//   'Business Administration',
//   'Computer Science',
//   'Engineering',
//   'Biology',
//   'Psychology',
//   'Economics',
//   'Education',
// ];

// const Academic = () => {
//   const [testType, setTestType] = useState<'SAT' | 'ACT'>('SAT');
//   const [selectedMajor, setSelectedMajor] = useState('Business Administration');
//   const [showMajorsDropdown, setShowMajorsDropdown] = useState(false);

//   const [form, setForm] = useState({
//     weightedgpa: '',
//     unweighted : '',
//     sat_act: '',
//     schoolname: '',
//     schooltype: '',
//     ncaaStatus: '',
//   });

//   const handleChange = (key: keyof typeof form, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <ScrollView
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ padding: 0, paddingBottom: 100 }}
//     >
//       {/* GPA Input */}
     

//       <View>
//               <View className="flex-row space-x-4">
//                   {/* weightedgpa */}
//                   <View className="flex-1">
//                      <AppText>Weighted GPA</AppText>
//       <AppInput
//         value={form.weightedgpa}
//         keyboardType="decimal-pad"
//         onChangeValue={(text) => handleChange('weightedgpa', text)}
//         placeholder="Enter value"
//       />
//                   </View>

//                   {/* unweighted GPA */}
//                   <View className="flex-1 ml-5">
//                     <AppText text="Unweighted GPA"/>
//                     <AppInput
//         value={form.unweighted}
//         keyboardType="decimal-pad"
//         onChangeValue={(text) => handleChange('unweighted', text)}
//         placeholder="Enter value"
//       />
//                   </View>
//                 </View>

                  
                    
//          </View>








//       {/* Test Scores */}
//       <AppText className="mt-4">Test Scores</AppText>
//       <View className=" mb-2">
//         <TestTypeToggle
//           options={['SAT', 'ACT']}
//           initialValue="SAT"
//           onSelect={(selected) => setTestType(selected as 'SAT' | 'ACT')}
//         />
//       </View>

//       <AppInput
//         value={form.sat_act}
//         keyboardType="numeric"
//         onChangeValue={(text) => handleChange('sat_act', text)}
//         placeholder={`Enter ${testType} score`}
//       />

//       {/* Intended Major */}
//       <AppText className="text-base text-title mb-1 font-nunitoextrabold mt-5">
//         Intended Major
//       </AppText>
//       <View className="border border-gray-300 rounded-xl px-3 h-14 mb-4 mt-2 bg-white">
//         <TouchableOpacity
//           onPress={() => setShowMajorsDropdown(true)}
//           className="bg-white rounded-2xl px-4 py-3 flex-row justify-between items-center"
//         >
//           <Text className="text-16 text-title mt-1">{selectedMajor}</Text>
//           <Ionicons name="chevron-down" size={20} color="gray" className='mt-1' />
//         </TouchableOpacity>
//       </View>

//       {/* School Name */}
//       <AppText className="text-base text-title mb-1 font-nunitoextrabold mt-1">
//         School Name
//       </AppText>
//       <AppInput
//         value={form.schoolname}
//         onChangeValue={(text) => handleChange('schoolname', text)}
//         placeholder="Enter School Name"
//       />

//       {/* School Type */}
//       <AppText text="School Type" size="text-base" className="mb-1 mt-4" />
//       <View className="flex-row space-x-4 mb-4">
//         {schoolTypes.map((type) => (
//           <TouchableOpacity
//             key={type}
//             onPress={() => handleChange('schooltype', type)}
//             className="flex-row items-center space-x-2 px-4 py-3 rounded-xl bg-gray-100 flex-1"
//           >
//             <View
//               className={`w-5 h-5 rounded-md items-center justify-center border ${
//                 form.schooltype === type
//                   ? 'bg-green-600 border-primary'
//                   : 'bg-white border-gray-400'
//               }`}
//             >
//               {form.schooltype === type && (
//                 <Ionicons name="checkmark" size={12} color="white" />
//               )}
//             </View>
//             <AppText text={type} size="text-base" className="ml-2" />
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* NCAA Status */}
//       <AppText text="NCAA Eligibility Center Status" size="text-base" className="mb-1" />
//       <View className="flex-row space-x-4 mb-6">
//         {ncaaStatuses.map((status) => (
//           <TouchableOpacity
//             key={status}
//             onPress={() => handleChange('ncaaStatus', status)}
//             className="flex-row items-center space-x-2 px-4 py-3 rounded-xl bg-gray-100 flex-1"
//           >
//             <View
//               className={`w-5 h-5 rounded-md items-center justify-center border ${
//                 form.ncaaStatus === status
//                   ? 'bg-green-600 border-primary'
//                   : 'bg-white border-gray-400'
//               }`}
//             >
//               {form.ncaaStatus === status && (
//                 <Ionicons name="checkmark" size={12} color="white" />
//               )}
//             </View>
//             <AppText text={status} size="text-base" className="ml-2" />
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Dropdown Modal */}
//       <Modal
//         transparent
//         visible={showMajorsDropdown}
//         animationType="fade"
//         onRequestClose={() => setShowMajorsDropdown(false)}
//       >
//         <TouchableOpacity
//           className="flex-1 bg-black/30 justify-center px-6"
//           activeOpacity={1}
//           onPressOut={() => setShowMajorsDropdown(false)}
//         >
//           <View className="bg-white rounded-xl max-h-[300px]">
//             <FlatList
//               data={majors}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedMajor(item);
//                     setShowMajorsDropdown(false);
//                   }}
//                   className="px-5 py-4 border-b border-gray-100"
//                 >
//                   <Text className="text-base text-gray-700">{item}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </ScrollView>
//   );
// };

// export default Academic;




 import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TestTypeToggle from './TestTypeToggle';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';
import { PREF_KEYS } from '~/utils/Prefs';
import { getItem } from 'expo-secure-store';
import { AcademicRequest, Api_Url, CreateProfileRequest, httpRequest2 } from '~/services/serviceRequest';
import { AcademicResponse, ProfileSaveResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';

const majors = [
  'Business Administration',
  'Computer Science',
  'Engineering',
  'Biology',
  'Psychology',
  'Economics',
  'Education',
];

type Props = {
  onNext?: () => void;
};

const Academic: React.FC<Props> = ({ onNext }) => {
  const [testType, setTestType] = useState<'SAT' | 'ACT'>('SAT');
  const [schoolType, setSchoolType] = useState<'Public' | 'Private' | 'Boarding'>('Public');
  const [NCAAType, setNCAAType] = useState<'Yes' | 'No' | 'Unsure'>('Yes');
  const [loading, setLoading] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [showMajorsDropdown, setShowMajorsDropdown] = useState(false);

  const [form, setForm] = useState({
    weighted_gpa: '',
    unweighted_gpa: '',
    test_score_type: '',
    test_score: '',
    intended_major: '',
    school_name: '',
    school_type: '',
    ncaa_eligibility_status: '',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchAcademic = async () => {
      await AcademicApiRequest();
    };
    fetchAcademic();
  }, []);

  const AcademicApiRequest = async () => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const profileUrl = Api_Url.academic;

      const res = await httpRequest2<AcademicResponse>(
        profileUrl,
        'get',
        {},
        accessToken ?? '',
      );

 
      if (res.status && res.data) {
        const testScoreType = res.data.test_score_type?.toUpperCase() === 'ACT' ? 'ACT' : 'SAT';
        setTestType(testScoreType);
        handleChange('test_score_type', testScoreType);

        const schoolTypeAPI = res.data.school_type;
        const validSchoolTypes = ['Public', 'Private', 'Boarding'];
        if (validSchoolTypes.includes(schoolTypeAPI)) {
          setSchoolType(schoolTypeAPI as 'Public' | 'Private' | 'Boarding');
          handleChange('school_type', schoolTypeAPI);
        }

        const ncaaStatusAPI = res.data.ncaa_eligibility_status;
        const validNCAA = ['Yes', 'No', 'Unsure'];
        if (validNCAA.includes(ncaaStatusAPI)) {
          setNCAAType(ncaaStatusAPI as 'Yes' | 'No' | 'Unsure');
          handleChange('ncaa_eligibility_status', ncaaStatusAPI);
        }

        const major = res.data?.intended_major ?? '';
        setSelectedMajor(major);
        handleChange('intended_major', major);

        setForm((prev) => ({
          ...prev,
          weighted_gpa: res.data?.weighted_gpa ?? '',
          unweighted_gpa: res.data?.unweighted_gpa ?? '',
          test_score: res.data?.test_score ?? '',
          school_name: res.data?.school_name ?? '',
        }));
      } else {
        Alert.alert('Error', res.message ?? 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };


    const SaveProfileRequest = async () => {
      try {
        setLoading(true);
        const email = await getItem(PREF_KEYS.userEmailID);
        const userId = await getItem(PREF_KEYS.userId);
        const accessToken = await getItem(PREF_KEYS.accessToken);
        const profileUrl = Api_Url.academic
  
      const requestBody: AcademicRequest = {
           weighted_gpa: form.weighted_gpa,
        unweighted_gpa: form.unweighted_gpa,
        test_score_type: form.test_score_type,
        test_score: form.test_score,
        intended_major: form.intended_major,
        school_name: form.school_name,
        school_type: form.school_type,
        ncaa_eligibility_status: form.ncaa_eligibility_status,
        };
  
  
        console.log('requestBody ', requestBody);
  
        const res = await httpRequest2<AcademicResponse>(
          profileUrl,
          'post',
          requestBody,
          accessToken ?? '',
          true
        );
  
        console.log('resresresresres', res);
        if (res.status) {
          //  navigation.navigate('GamesGrid');
        } else {
          Alert.alert('Error', res.message ?? 'Request failed');
        }
      } catch (err) {
        Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Loader show={loading} />

      {/* GPA Input */}
      <View>
        <View className="flex-row space-x-4">
          <View className="flex-1">
            <AppText>Weighted GPA</AppText>
            <AppInput
              value={form.weighted_gpa}
              keyboardType="decimal-pad"
              onChangeValue={(text) => handleChange('weighted_gpa', text)}
              placeholder="Enter value"
            />
          </View>

          <View className="flex-1 ml-5">
            <AppText text="Unweighted GPA" />
            <AppInput
              value={form.unweighted_gpa}
              keyboardType="decimal-pad"
              onChangeValue={(text) => handleChange('unweighted_gpa', text)}
              placeholder="Enter value"
            />
          </View>
        </View>
      </View>

      {/* Test Scores */}
      <AppText className="mt-4">Test Scores</AppText>
      <View className="mb-2">
      <TestTypeToggle
        options={['SAT', 'ACT']}
        initialValue={testType}
        onSelect={(selected) => {
          setTestType(selected as 'SAT' | 'ACT');
          setForm((prev) => ({ ...prev, test_score_type: selected }));
        }}
      />

      </View>

      <AppInput
        value={form.test_score}
        keyboardType="numeric"
        onChangeValue={(text) => handleChange('test_score', text)}
        placeholder={`Enter ${testType} score`}
      />

      {/* Intended Major */}
      <AppText className="text-base text-title mb-1 font-nunitoextrabold mt-5">
        Intended Major
      </AppText>
      <View className="border border-gray-300 rounded-xl px-3 h-14 mb-4 mt-2 bg-white">
        <TouchableOpacity
          onPress={() => setShowMajorsDropdown(true)}
          className="bg-white rounded-2xl px-4 py-3 flex-row justify-between items-center"
        >
          <Text className="text-16 text-title mt-1">{selectedMajor}</Text>
          <Ionicons name="chevron-down" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* School Name */}
      <AppText className="text-base text-title mb-1 font-nunitoextrabold mt-1">
        School Name
      </AppText>
      <AppInput
        value={form.school_name}
        onChangeValue={(text) => handleChange('school_name', text)}
        placeholder="Enter School Name"
      />

      {/* School Type */}
      <AppText text="School Type" size="text-base" className="mb-1 mt-4" />
      <View className="mb-2">
        <TestTypeToggle
          options={['Public', 'Private', 'Boarding']}
          initialValue={schoolType}
          onSelect={(selected) => {
            setSchoolType(selected as 'Public' | 'Private' | 'Boarding');
            handleChange('school_type', selected);
          }}
        />
      </View>

      {/* NCAA Status */}
      <AppText text="NCAA Eligibility Center Status" size="text-base" className="mb-1" />
      <View className="mb-2">
        <TestTypeToggle
          options={['Yes', 'No', 'Unsure']}
          initialValue={NCAAType}
          onSelect={(selected) => {
            setNCAAType(selected as 'Yes' | 'No' | 'Unsure');
            handleChange('ncaa_eligibility_status', selected);
          }}
        />
      </View>

      {/* Continue Button */}
      <View className="px-2 py-4 mb-20">
        <ArrowButton
          text="Continue"
            onPress={async () => {
            await SaveProfileRequest();  // 🟢 Call API
            onNext?.();                  // 🟢 Navigate after save
          }}
          fullWidth
        />
      </View>

      {/* Dropdown Modal for Majors */}
      <Modal
        transparent
        visible={showMajorsDropdown}
        animationType="fade"
        onRequestClose={() => setShowMajorsDropdown(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center px-6"
          activeOpacity={1}
          onPressOut={() => setShowMajorsDropdown(false)}
        >
          <View className="bg-white rounded-xl max-h-[300px]">
            <FlatList
              data={majors}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMajor(item);
                    handleChange('intended_major', item);
                    setShowMajorsDropdown(false);
                  }}
                  className="px-5 py-4 border-b border-gray-100"
                >
                  <Text className="text-base text-gray-700">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default Academic;

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




//  import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import TestTypeToggle from './TestTypeToggle';
// import AppText from '~/components/AppText';
// import AppInput from '~/components/AppInput';
// import ArrowButton from '~/components/ArrowButton';
// import { PREF_KEYS } from '~/utils/Prefs';
// import { getItem } from 'expo-secure-store';
// import { AcademicRequest, Api_Url, CreateProfileRequest, httpRequest2 } from '~/services/serviceRequest';
// import { AcademicResponse, ProfileSaveResponse } from '~/services/DataModals';
// import Loader from '~/components/Loader';

// const majors = [
//   'Business Administration',
//   'Computer Science',
//   'Engineering',
//   'Biology',
//   'Psychology',
//   'Economics',
//   'Education',
// ];

// type Props = {
//   onNext?: () => void;
// };

// const Academic: React.FC<Props> = ({ onNext }) => {
//   const [testType, setTestType] = useState<'SAT' | 'ACT'>('SAT');
//   const [schoolType, setSchoolType] = useState<'Public' | 'Private' | 'Boarding'>('Public');
//   const [NCAAType, setNCAAType] = useState<'Yes' | 'No' | 'Unsure'>('Yes');
//   const [loading, setLoading] = useState(false);
//   const [selectedMajor, setSelectedMajor] = useState('');
//   const [showMajorsDropdown, setShowMajorsDropdown] = useState(false);

//   const [form, setForm] = useState({
//     weighted_gpa: '',
//     unweighted_gpa: '',
//     test_score_type: '',
//     test_score: '',
//     intended_major: '',
//     school_name: '',
//     school_type: '',
//     ncaa_eligibility_status: '',
//   });

//   const handleChange = (key: keyof typeof form, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   useEffect(() => {
//     const fetchAcademic = async () => {
//       await AcademicApiRequest();
//     };
//     fetchAcademic();
//   }, []);

//   const AcademicApiRequest = async () => {
//     try {
//       setLoading(true);
//       const accessToken = await getItem(PREF_KEYS.accessToken);
//       const profileUrl = Api_Url.academic;

//       const res = await httpRequest2<AcademicResponse>(
//         profileUrl,
//         'get',
//         {},
//         accessToken ?? '',
//       );

 
//       if (res.status && res.data) {
//         const testScoreType = res.data.test_score_type?.toUpperCase() === 'ACT' ? 'ACT' : 'SAT';
//         setTestType(testScoreType);
//         handleChange('test_score_type', testScoreType);

//         const schoolTypeAPI = res.data.school_type;
//         const validSchoolTypes = ['Public', 'Private', 'Boarding'];
//         if (validSchoolTypes.includes(schoolTypeAPI)) {
//           setSchoolType(schoolTypeAPI as 'Public' | 'Private' | 'Boarding');
//           handleChange('school_type', schoolTypeAPI);
//         }

//         const ncaaStatusAPI = res.data.ncaa_eligibility_status;
//         const validNCAA = ['Yes', 'No', 'Unsure'];
//         if (validNCAA.includes(ncaaStatusAPI)) {
//           setNCAAType(ncaaStatusAPI as 'Yes' | 'No' | 'Unsure');
//           handleChange('ncaa_eligibility_status', ncaaStatusAPI);
//         }

//         const major = res.data?.intended_major ?? '';
//         setSelectedMajor(major);
//         handleChange('intended_major', major);

//         setForm((prev) => ({
//           ...prev,
//           weighted_gpa: res.data?.weighted_gpa ?? '',
//           unweighted_gpa: res.data?.unweighted_gpa ?? '',
//           test_score: res.data?.test_score ?? '',
//           school_name: res.data?.school_name ?? '',
//         }));
//       } else {
//         Alert.alert('Error', res.message ?? 'Something went wrong');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };


//     const SaveProfileRequest = async () => {
//       try {
//         setLoading(true);
//         const email = await getItem(PREF_KEYS.userEmailID);
//         const userId = await getItem(PREF_KEYS.userId);
//         const accessToken = await getItem(PREF_KEYS.accessToken);
//         const profileUrl = Api_Url.academic
  
//       const requestBody: AcademicRequest = {
//            weighted_gpa: form.weighted_gpa,
//         unweighted_gpa: form.unweighted_gpa,
//         test_score_type: form.test_score_type,
//         test_score: form.test_score,
//         intended_major: form.intended_major,
//         school_name: form.school_name,
//         school_type: form.school_type,
//         ncaa_eligibility_status: form.ncaa_eligibility_status,
//         };
  
  
//         console.log('requestBody ', requestBody);
  
//         const res = await httpRequest2<AcademicResponse>(
//           profileUrl,
//           'post',
//           requestBody,
//           accessToken ?? '',
//           true
//         );
  
//         console.log('resresresresres', res);
//         if (res.status) {
//           //  navigation.navigate('GamesGrid');
//         } else {
//           Alert.alert('Error', res.message ?? 'Request failed');
//         }
//       } catch (err) {
//         Alert.alert('Error', 'Unexpected error occurred.');
//       } finally {
//         setLoading(false);
//       }
//     };

//   return (
//     <ScrollView
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ paddingBottom: 100 }}
//     >
//       <Loader show={loading} />

//       {/* GPA Input */}
//       <View>
//         <View className="flex-row space-x-4">
//           <View className="flex-1">
//             <AppText>Weighted GPA</AppText>
//             <AppInput
//               value={form.weighted_gpa}
//               keyboardType="decimal-pad"
//               onChangeValue={(text) => handleChange('weighted_gpa', text)}
//               placeholder="Enter value"
//             />
//           </View>

//           <View className="flex-1 ml-5">
//             <AppText text="Unweighted GPA" />
//             <AppInput
//               value={form.unweighted_gpa}
//               keyboardType="decimal-pad"
//               onChangeValue={(text) => handleChange('unweighted_gpa', text)}
//               placeholder="Enter value"
//             />
//           </View>
//         </View>
//       </View>

//       {/* Test Scores */}
//       <AppText className="mt-4">Test Scores</AppText>
//       <View className="mb-2">
//       <TestTypeToggle
//         options={['SAT', 'ACT']}
//         initialValue={testType}
//         onSelect={(selected) => {
//           setTestType(selected as 'SAT' | 'ACT');
//           setForm((prev) => ({ ...prev, test_score_type: selected }));
//         }}
//       />

//       </View>

//       <AppInput
//         value={form.test_score}
//         keyboardType="numeric"
//         onChangeValue={(text) => handleChange('test_score', text)}
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
//           <Ionicons name="chevron-down" size={20} color="gray" />
//         </TouchableOpacity>
//       </View>

//       {/* School Name */}
//       <AppText className="text-base text-title mb-1 font-nunitoextrabold mt-1">
//         School Name
//       </AppText>
//       <AppInput
//         value={form.school_name}
//         onChangeValue={(text) => handleChange('school_name', text)}
//         placeholder="Enter School Name"
//       />

//       {/* School Type */}
//       <AppText text="School Type" size="text-base" className="mb-1 mt-4" />
//       <View className="mb-2">
//         <TestTypeToggle
//           options={['Public', 'Private', 'Boarding']}
//           initialValue={schoolType}
//           onSelect={(selected) => {
//             setSchoolType(selected as 'Public' | 'Private' | 'Boarding');
//             handleChange('school_type', selected);
//           }}
//         />
//       </View>

//       {/* NCAA Status */}
//       <AppText text="NCAA Eligibility Center Status" size="text-base" className="mb-1" />
//       <View className="mb-2">
//         <TestTypeToggle
//           options={['Yes', 'No', 'Unsure']}
//           initialValue={NCAAType}
//           onSelect={(selected) => {
//             setNCAAType(selected as 'Yes' | 'No' | 'Unsure');
//             handleChange('ncaa_eligibility_status', selected);
//           }}
//         />
//       </View>

//       {/* Continue Button */}
//       <View className="px-2 py-4 mb-20">
//         <ArrowButton
//           text="Continue"
//             onPress={async () => {
//             await SaveProfileRequest();  // 🟢 Call API
//             onNext?.();                  // 🟢 Navigate after save
//           }}
//           fullWidth
//         />
//       </View>

//       {/* Dropdown Modal for Majors */}
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
//                     handleChange('intended_major', item);
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



//  import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import TestTypeToggle from './TestTypeToggle';
// import AppText from '~/components/AppText';
// import AppInput from '~/components/AppInput';
// import ArrowButton from '~/components/ArrowButton';
// import { PREF_KEYS } from '~/utils/Prefs';
// import { getItem } from 'expo-secure-store';
// import { AcademicRequest, Api_Url, httpRequest2 } from '~/services/serviceRequest';
// import { AcademicMajor, AcademicResponse } from '~/services/DataModals';
// import Loader from '~/components/Loader';
// import { validateGPA, validateScore } from '~/utils/AppFunctions';

// type Props = {
//   onNext?: () => void;
// };

// const Academic: React.FC<Props> = ({ onNext }) => {
//   const [testType, setTestType] = useState<'SAT' | 'ACT'>('SAT');
//   const [schoolType, setSchoolType] = useState<'Public' | 'Private' | 'Boarding'>('Public');
//   const [NCAAType, setNCAAType] = useState<'Yes' | 'No' | 'Unsure'>('Yes');
//   const [loading, setLoading] = useState(false);
//   const [selectedMajor, setSelectedMajor] = useState('');
//   const [apiMajors, setApiMajors] = useState<AcademicMajor[]>([]);
//   const [majorSearch, setMajorSearch] = useState('');
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [showMajorList, setShowMajorList] = useState(false);

//   const [majorSearch1, setMajorSearch1] = useState('');
// const [majorSearch2, setMajorSearch2] = useState('');
// const [majorSearch3, setMajorSearch3] = useState('');

// const [showMajorList1, setShowMajorList1] = useState(false);
// const [showMajorList2, setShowMajorList2] = useState(false);
// const [showMajorList3, setShowMajorList3] = useState(false);


//   const filteredMajors = apiMajors.filter((item) =>
//     item.display_name.toLowerCase().includes(majorSearch.toLowerCase())
//   );

//   const [form, setForm] = useState({
//     weighted_gpa: '0',
//     unweighted_gpa: '',
//     test_score_type: '',
//     test_score: '',
//     intended_major: '',
//     school_name: '',
//     school_type: '',
//     ncaa_eligibility_status: '0',
//   });

//   const handleChange = (key: string, val: string) => {
//     setForm((prev) => ({ ...prev, [key]: val }));
//     if (key === 'unweighted_gpa') validateGPA(val, setErrors);
//     // if (key === 'test_score') validateScore(val, form.test_score_type as 'SAT' | 'ACT');
//         if (key === 'test_score') validateScore(val, form.test_score_type as 'SAT' | 'ACT', setErrors);

//   };



// const isFormValid = () => {
//   const requiredFields: (keyof typeof form)[] = [
//     'unweighted_gpa',
//     'test_score',
//     'intended_major',
//     'school_name',
//     'school_type',
//     'test_score_type',
//   ];

//   const hasErrors = Object.values(errors).some((e) => e);
//   const isEmptyField = requiredFields.some((field) => !form[field]);

//   return !hasErrors && !isEmptyField;
// };



//   useEffect(() => {
//     const fetchAcademic = async () => {
//       await AcademicApiRequest();
//     };
//     fetchAcademic();
//   }, []);

//   const AcademicApiRequest = async () => {
//     try {
//       setLoading(true);
//       const accessToken = await getItem(PREF_KEYS.accessToken);
//       const profileUrl = Api_Url.academic;

//       const res = await httpRequest2<AcademicResponse>(
//         profileUrl,
//         'get',
//         {},
//         accessToken ?? ''
//       );

//       if (res.status && res.data) {
//         const testScoreType = res.data.test_score_type?.toUpperCase() === 'ACT' ? 'ACT' : 'SAT';
//         setTestType(testScoreType);
//         handleChange('test_score_type', testScoreType);

//         const schoolTypeAPI = res.data.school_type;
//         const validSchoolTypes = ['Public', 'Private', 'Boarding'];
//         if (validSchoolTypes.includes(schoolTypeAPI)) {
//           setSchoolType(schoolTypeAPI as 'Public' | 'Private' | 'Boarding');
//           handleChange('school_type', schoolTypeAPI);
//         }else{
//            setSchoolType('Public');
//             handleChange('school_type', 'Public');
//         }

//         const ncaaStatusAPI = res.data.ncaa_eligibility_status;
//         const validNCAA = ['Yes', 'No', 'Unsure'];
//         if (validNCAA.includes(ncaaStatusAPI)) {
//           setNCAAType(ncaaStatusAPI as 'Yes' | 'No' | 'Unsure');
//           handleChange('ncaa_eligibility_status', ncaaStatusAPI);
//         }

//         const majorList = res.lists?.AcademicMajors ?? [];
//         setApiMajors(majorList);

//         const savedMajor = res.data.intended_major ?? '';
//         setSelectedMajor(savedMajor);
//         handleChange('intended_major', savedMajor);
//         const found = majorList.find((m) => m.id === savedMajor);
//         setMajorSearch(found?.display_name ?? '');

//         setForm((prev) => ({
//           ...prev,
//           weighted_gpa: res.data?.weighted_gpa ?? '',
//           unweighted_gpa: res.data?.unweighted_gpa
//   ? parseFloat(res.data.unweighted_gpa).toFixed(1)
//   : '',

//           test_score: res.data?.test_score ?? '',
//           school_name: res.data?.school_name ?? '',
//         }));
//       } else {
//         Alert.alert('Error', res.message ?? 'Something went wrong');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const SaveProfileRequest = async () => {
//     try {
//       setLoading(true);
//       const accessToken = await getItem(PREF_KEYS.accessToken);
//       const profileUrl = Api_Url.academic;

//       const requestBody: AcademicRequest = {
//         // weighted_gpa: form.weighted_gpa,
//          weighted_gpa: '0',
//         unweighted_gpa: form.unweighted_gpa,
//         test_score_type: form.test_score_type,
//         test_score: form.test_score,
//         intended_major: form.intended_major,
//         school_name: form.school_name,
//         school_type: form.school_type,
//         ncaa_eligibility_status: form.ncaa_eligibility_status,
//       };

//       console.log('requestBody' , requestBody);

//       const res = await httpRequest2<AcademicResponse>(
//         profileUrl,
//         'post',
//         requestBody,
//         accessToken ?? '',
//         true
//       );

//       if (res.status) {
//         onNext?.();
//       } else {
//         Alert.alert('Error', res.message ?? 'Request failed');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
    
//       <ScrollView
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       >
//         <Loader show={loading} />

//         {/* Unweighted GPA */}
//         <View className="flex-row">
//           <View className="flex-1">
//             <AppText text="Unweighted GPA" />
//             <AppInput
//               value={form.unweighted_gpa}
//               keyboardType="decimal-pad"
//               onChangeValue={(text) => handleChange('unweighted_gpa', text)}
//               placeholder="Enter GPA (0 - 4.5)"
//             />
//             {errors.unweighted_gpa ? (
//               <Text style={{ color: 'red', marginTop: 4 }}>{errors.unweighted_gpa}</Text>
//             ) : null}
//           </View>
//         </View>

//         {/* Test Scores */}
//         <AppText className="mt-4">Test Scores</AppText>
//         <View className="mb-2">
//           <TestTypeToggle
//             options={['SAT', 'ACT']}
//             initialValue={testType}
//             onSelect={(selected) => {
//               const upper = selected as 'SAT' | 'ACT';
//               setTestType(upper);
//               handleChange('test_score_type', upper);
//               validateScore(form.test_score, upper , setErrors);
//             }}
//           />
//         </View>

//         <View className="px-2">
//           <AppInput
//             value={form.test_score}
//             keyboardType="numeric"
//             onChangeValue={(text) => handleChange('test_score', text)}
//             placeholder={`Enter ${testType} score`}
//           />
//           {form.test_score !== '' && errors.test_score ? (
//             <Text style={{ color: 'red', marginTop: 4 }}>{errors.test_score}</Text>
//           ) : null}
//         </View>

//         {/* Intended Major */}
//           {/* <TouchableWithoutFeedback
//        onPress={() => {
//         Keyboard.dismiss();
//        setShowMajorList(false);
//        }}
//      >
//         <View className="mb-4 mt-4 px-2">
//           <AppText className="mb-1">
//             Intended Major(s) - Select upto 3 in order of preference
//           </AppText>

//           <AppInput
//             placeholder="Search or type a major"
//             value={majorSearch}
//             onFocus={() => setShowMajorList(true)}
//             onChangeValue={(text) => {
//               setMajorSearch(text);
//               setSelectedMajor('');
//               handleChange('intended_major', '');
//               setShowMajorList(true);
//             }}
//           />

//           {showMajorList && filteredMajors.length > 0 && (
//             <View className="bg-white rounded-lg  max-h-[250px] -mt-2 w-[100%]">
//               <ScrollView keyboardShouldPersistTaps="handled">
//                 {filteredMajors.map((item) => (
//                   <TouchableOpacity
//                     key={item.id}
//                     onPress={() => {
//                       setMajorSearch(item.display_name);
//                       setSelectedMajor(item.major_name);
//                       handleChange('intended_major', item.id);
//                       setShowMajorList(false);
//                       Keyboard.dismiss();
//                     }}
//                     className="py-1 px-4"
//                   >
//                     <AppText className=" py-1 mt-5">{item.display_name}</AppText>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           )}
//         </View>
//         </TouchableWithoutFeedback> */}


// {[1, 2, 3].map((index) => {
//   const majorSearch = eval(`majorSearch${index}`);
//   const setMajorSearch = eval(`setMajorSearch${index}`);
//   const showMajorList = eval(`showMajorList${index}`);
//   const setShowMajorList = eval(`setShowMajorList${index}`);

//   return (
//     <TouchableWithoutFeedback
//       key={index}
//       onPress={() => {
//         Keyboard.dismiss();
//         setShowMajorList(false);
//       }}
//     >
//       <View className="mb-4 mt-4 px-2">
//         <AppText className="mb-1">
//           Intended Major {index} {index === 1 && '- Select up to 3 in order of preference'}
//         </AppText>

//         <AppInput
//           placeholder="Search or type a major"
//           value={majorSearch}
//           onFocus={() => setShowMajorList(true)}
//           onChangeValue={(text) => {
//             setMajorSearch(text);
//             handleChange(`intended_major_${index}`, '');
//             setShowMajorList(true);
//           }}
//         />

//         {showMajorList && filteredMajors.length > 0 && (
//           <View className="bg-white rounded-lg max-h-[250px] -mt-2 w-[100%]">
//             <ScrollView keyboardShouldPersistTaps="handled">
//               {filteredMajors.map((item) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   onPress={() => {
//                     setMajorSearch(item.display_name);
//                     handleChange(`intended_major_${index}`, item.id);
//                     setShowMajorList(false);
//                     Keyboard.dismiss();
//                   }}
//                   className="py-1 px-4"
//                 >
//                   <AppText className="py-1 mt-5">{item.display_name}</AppText>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// })}









//         {/* School Name */}
//         <AppText className="mb-1 mt-1">
//           High School Name
//         </AppText>
//         <AppInput
//           value={form.school_name}
//           onChangeValue={(text) => handleChange('school_name', text)}
//           placeholder="Enter School Name"
//         />

//         {/* School Type */}
//         <AppText text="High School Type" size="text-base" className="mb-1 mt-4" />
//         <View className="mb-2">
//           <TestTypeToggle
//             options={['Public', 'Private', 'Boarding']}
//             initialValue={schoolType}
//             onSelect={(selected) => {
//               setSchoolType(selected as 'Public' | 'Private' | 'Boarding');
//               handleChange('school_type', selected);
//             }}
//           />
//         </View>

//         {/* Continue Button */}
//         <View className="px-2 py-4 mb-20">
//        <ArrowButton
//         text="Continue"
//         onPress={async () => {
//           if (!isFormValid()) return;
//           await SaveProfileRequest();
//         }}
//         fullWidth
//         disabled={!isFormValid()}
//       />

//         </View>
//       </ScrollView>
//     // </TouchableWithoutFeedback>
//   );
// };

// export default Academic;









// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import TestTypeToggle from './TestTypeToggle';
// import AppText from '~/components/AppText';
// import AppInput from '~/components/AppInput';
// import ArrowButton from '~/components/ArrowButton';
// import { PREF_KEYS } from '~/utils/Prefs';
// import { getItem } from 'expo-secure-store';
// import { AcademicRequest, Api_Url, httpRequest2 } from '~/services/serviceRequest';
// import { AcademicMajor, AcademicResponse } from '~/services/DataModals';
// import Loader from '~/components/Loader';
// import { setMajorFromAPI, validateGPA, validateScore } from '~/utils/AppFunctions';

// type Props = {
//   onNext?: () => void;
// };

// const Academic: React.FC<Props> = ({ onNext }) => {
//   const [testType, setTestType] = useState<'SAT' | 'ACT'>('SAT');
//   const [schoolType, setSchoolType] = useState<'Public' | 'Private' | 'Boarding'>('Public');
//   const [NCAAType, setNCAAType] = useState<'Yes' | 'No' | 'Unsure'>('Yes');
//   const [loading, setLoading] = useState(false);
//   const [apiMajors, setApiMajors] = useState<AcademicMajor[]>([]);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const [majors, setMajors] = useState([
//     { search: '', showList: false },
//     { search: '', showList: false },
//     { search: '', showList: false },
//   ]);

//   const [form, setForm] = useState({
//     weighted_gpa: '0',
//     unweighted_gpa: '',
//     test_score_type: '',
//     test_score: '',
//     intended_major_1: '',
//     intended_major_2: '',
//     intended_major_3: '',
//     school_name: '',
//     school_type: '',
//     ncaa_eligibility_status: '0',
//   });

//   const handleChange = (key: string, val: string) => {
//     setForm((prev) => ({ ...prev, [key]: val }));
//     if (key === 'unweighted_gpa') validateGPA(val, setErrors);
//     if (key === 'test_score') validateScore(val, form.test_score_type as 'SAT' | 'ACT', setErrors);
//   };

//   const getFilteredMajors = (search: string) =>
//     apiMajors.filter((item) =>
//       item.display_name.toLowerCase().includes(search.toLowerCase())
//     );

//   const isFormValid = () => {
//     const requiredFields: (keyof typeof form)[] = [
//       'unweighted_gpa',
//       'test_score',
//       'intended_major_1',
//       'intended_major_2',
//       'intended_major_3',
//       'school_name',
//       'school_type',
//       'test_score_type',
//     ];

//     const hasErrors = Object.values(errors).some((e) => e);
//     const isEmptyField = requiredFields.some((field) => !form[field]);

//     return !hasErrors && !isEmptyField;
//   };

//   useEffect(() => {
//     const fetchAcademic = async () => {
//       await AcademicApiRequest();
//     };
//     fetchAcademic();
//   }, []);

//   const AcademicApiRequest = async () => {
//     try {
//       setLoading(true);
//       const accessToken = await getItem(PREF_KEYS.accessToken);
//       const profileUrl = Api_Url.academic;

//       const res = await httpRequest2<AcademicResponse>(
//         profileUrl,
//         'get',
//         {},
//         accessToken ?? ''
//       );

//       if (res.status && res.data) {
//         const testScoreType = res.data.test_score_type?.toUpperCase() === 'ACT' ? 'ACT' : 'SAT';
//         setTestType(testScoreType);
//         handleChange('test_score_type', testScoreType);

//         const schoolTypeAPI = res.data.school_type;
//         const validSchoolTypes = ['Public', 'Private', 'Boarding'];
//         if (validSchoolTypes.includes(schoolTypeAPI)) {
//           setSchoolType(schoolTypeAPI as 'Public' | 'Private' | 'Boarding');
//           handleChange('school_type', schoolTypeAPI);
//         } else {
//           setSchoolType('Public');
//           handleChange('school_type', 'Public');
//         }

//         const ncaaStatusAPI = res.data.ncaa_eligibility_status;
//         const validNCAA = ['Yes', 'No', 'Unsure'];
//         if (validNCAA.includes(ncaaStatusAPI)) {
//           setNCAAType(ncaaStatusAPI as 'Yes' | 'No' | 'Unsure');
//           handleChange('ncaa_eligibility_status', ncaaStatusAPI);
//         }

//         const majorList = res.lists?.AcademicMajors ?? [];
//         setApiMajors(majorList);

         

//         setMajorFromAPI(res.data?.intended_major, 0, majorList, setMajors, handleChange);
//         setMajorFromAPI(res.data?.intended_major_2, 1, majorList, setMajors, handleChange);
//         setMajorFromAPI(res.data?.intended_major_3, 2, majorList, setMajors, handleChange);





//         setForm((prev) => ({
//           ...prev,
//           weighted_gpa: res.data?.weighted_gpa ?? '',
//           unweighted_gpa: res.data?.unweighted_gpa
//             ? parseFloat(res.data.unweighted_gpa).toFixed(1)
//             : '',
//           test_score: res.data?.test_score ?? '',
//           school_name: res.data?.school_name ?? '',
//         }));
//       } else {
//         Alert.alert('Error', res.message ?? 'Something went wrong');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const SaveProfileRequest = async () => {
//     try {
//       setLoading(true);
//       const accessToken = await getItem(PREF_KEYS.accessToken);
//       const profileUrl = Api_Url.academic;

//       const requestBody: AcademicRequest = {
//         weighted_gpa: '0',
//         unweighted_gpa: form.unweighted_gpa,
//         test_score_type: form.test_score_type,
//         test_score: form.test_score,
//         intended_major: form.intended_major_1, 
//          intended_major_2: form.intended_major_2,
//           intended_major_3: form.intended_major_3,
//         school_name: form.school_name,
//         school_type: form.school_type,
//         ncaa_eligibility_status: form.ncaa_eligibility_status,
//       };

//       console.log('requestBody', requestBody);

//       const res = await httpRequest2<AcademicResponse>(
//         profileUrl,
//         'post',
//         requestBody,
//         accessToken ?? '',
//         true
//       );

//       if (res.status) {
//         onNext?.();
//       } else {
//         Alert.alert('Error', res.message ?? 'Request failed');
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ paddingBottom: 100 }}
//     >
//       <Loader show={loading} />

//       {/* GPA */}
//       <View className="flex-row">
//         <View className="flex-1">
//           <AppText text="Unweighted GPA" />
//           <AppInput
//             value={form.unweighted_gpa}
//             keyboardType="decimal-pad"
//             onChangeValue={(text) => handleChange('unweighted_gpa', text)}
//             placeholder="Enter GPA (0 - 4.5)"
//           />
//           {errors.unweighted_gpa ? (
//             <Text style={{ color: 'red', marginTop: 4 }}>{errors.unweighted_gpa}</Text>
//           ) : null}
//         </View>
//       </View>

//       {/* Test Score */}
//       <AppText className="mt-4">Test Scores</AppText>
//       <View className="mb-2">
//         <TestTypeToggle
//           options={['SAT', 'ACT']}
//           initialValue={testType}
//           onSelect={(selected) => {
//             const upper = selected as 'SAT' | 'ACT';
//             setTestType(upper);
//             handleChange('test_score_type', upper);
//             validateScore(form.test_score, upper, setErrors);
//           }}
//         />
//       </View>

//       <View className="px-2">
//         <AppInput
//           value={form.test_score}
//           keyboardType="numeric"
//           onChangeValue={(text) => handleChange('test_score', text)}
//           placeholder={`Enter ${testType} score`}
//         />
//         {form.test_score !== '' && errors.test_score ? (
//           <Text style={{ color: 'red', marginTop: 4 }}>{errors.test_score}</Text>
//         ) : null}
//       </View>

//       {/* Intended Majors (1 to 3) */}
//       {majors.map((major, index) => (
//         <TouchableWithoutFeedback
//           key={index}
//           onPress={() => {
//             Keyboard.dismiss();
//             setMajors((prev) => {
//               const updated = [...prev];
//               updated[index].showList = false;
//               return updated;
//             });
//           }}
//         >
//           <View className="px-2">
//             <AppText className="mb-1">
//               Intended Major(s) {index + 1} {index === 0 && ' (Select upto 3 in order of preference)'}
//             </AppText>

//             <AppInput
//               placeholder="Search or type a major"
//               value={major.search}
//               onFocus={() =>
//                 setMajors((prev) => {
//                   const updated = [...prev];
//                   updated[index].showList = true;
//                   return updated;
//                 })
//               }
//               onChangeValue={(text) =>
//                 setMajors((prev) => {
//                   const updated = [...prev];
//                   updated[index].search = text;
//                   updated[index].showList = true;
//                   return updated;
//                 })
//               }
//             />

//             {major.showList && getFilteredMajors(major.search).length > 0 && (
//               <View className="bg-white rounded-lg max-h-[250px] -mt-2 w-[100%]">
//                 <ScrollView keyboardShouldPersistTaps="handled">
//                   {getFilteredMajors(major.search).map((item) => (
//                     <TouchableOpacity
//                       key={item.id}
//                       onPress={() => {
//                         setMajors((prev) => {
//                           const updated = [...prev];
//                           updated[index].search = item.display_name;
//                           updated[index].showList = false;
//                           return updated;
//                         });

//                         handleChange(`intended_major_${index + 1}`, item.id);
//                         Keyboard.dismiss();
//                       }}
//                       className="py-1 px-4"
//                     >
//                       <AppText className="py-1 mt-5">{item.display_name}</AppText>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>
//             )}
//           </View>
//         </TouchableWithoutFeedback>
//       ))}

//       {/* High School Name */}
//       <AppText className="mb-1 mt-1">High School Name</AppText>
//       <AppInput
//         value={form.school_name}
//         onChangeValue={(text) => handleChange('school_name', text)}
//         placeholder="Enter School Name"
//       />

//       {/* School Type */}
//       <AppText text="High School Type" size="text-base" className="mb-1 mt-4" />
//       <View className="mb-2">
//         <TestTypeToggle
//           options={['Public', 'Private', 'Boarding']}
//           initialValue={schoolType}
//           onSelect={(selected) => {
//             setSchoolType(selected as 'Public' | 'Private' | 'Boarding');
//             handleChange('school_type', selected);
//           }}
//         />
//       </View>

//       {/* Continue Button */}
//       <View className="px-2 py-4 mb-20">
//         <ArrowButton
//           text="Continue"
//           onPress={async () => {
//             if (!isFormValid()) return;
//             await SaveProfileRequest();
//           }}
//           fullWidth
//           disabled={!isFormValid()}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// export default Academic;




import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import TestTypeToggle from './TestTypeToggle';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';
import { PREF_KEYS } from '~/utils/Prefs';
import { getItem } from 'expo-secure-store';
import { AcademicRequest, Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { AcademicMajor, AcademicResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
import { setMajorFromAPI, validateGPA, validateScore } from '~/utils/AppFunctions';
import TitleText from '~/components/TitleText';

type Props = {
  onNext?: () => void;
};

const Academic: React.FC<Props> = ({ onNext }) => {
  const [testType, setTestType] = useState<'sat' | 'act'>('sat');
  const [schoolType, setSchoolType] = useState<'public' | 'private' | 'boarding'>('public');
  const [NCAAType, setNCAAType] = useState<'Yes' | 'No' | 'Unsure'>('Yes');
  const [loading, setLoading] = useState(false);
  const [apiMajors, setApiMajors] = useState<AcademicMajor[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [majors, setMajors] = useState([{ search: '', showList: false }]);

  const [form, setForm] = useState({
    weighted_gpa: '0',
    unweighted_gpa: '',
    test_score_type: '',
    test_score: '',
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
    if (key === 'test_score') validateScore(val, form.test_score_type as 'sat' | 'act', setErrors);
  };

  const getFilteredMajors = (search: string) =>
    apiMajors.filter((item) => item.display_name.toLowerCase().includes(search.toLowerCase()));

  const isFormValid = () => {
    const requiredFields = [
      'unweighted_gpa',
      'test_score',
      'intended_major_1',
       'intended_major_2',
        'intended_major_3',
      'school_name',
      'school_type',
      'test_score_type',
    ];
    const hasErrors = Object.values(errors).some((e) => e);
    const isEmpty = requiredFields.some((f) => !form[f as keyof typeof form]);
    return !hasErrors && !isEmpty;
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
      // console.log('res_res ', res);
      if (res.status && res.data) {
        const testType = res.data.test_score_type?.toLowerCase() === 'act' ? 'act' : 'sat';
        setTestType(testType);
        handleChange('test_score_type', testType);

        const type = res.data.school_type; 
        if (['public', 'private', 'boarding'].includes(type)) {
        setSchoolType(type as 'public' | 'private' | 'boarding');
         handleChange('school_type', type); // optional if needed
      }


        const ncaa = res.data.ncaa_eligibility_status;
        if (['Yes', 'No', 'Unsure'].includes(ncaa)) {
          setNCAAType("Unsure"); // this is hardcoded  becuase item removed from the UI
          handleChange('ncaa_eligibility_status', ncaa);
        }

        const list = res.lists?.AcademicMajors ?? [];
        setApiMajors(list);

        setMajors((prev) => {
          const filled = [...prev];
          while (filled.length < 3) filled.push({ search: '', showList: false });
          return filled;
        });

        setMajorFromAPI(res.data?.intended_major, 0, list, setMajors, handleChange);
        setMajorFromAPI(res.data?.intended_major_2, 1, list, setMajors, handleChange);
        setMajorFromAPI(res.data?.intended_major_3, 2, list, setMajors, handleChange);

          handleChange('test_score', res.data?.test_score?.toString() ?? '');

        setForm((prev) => ({
          ...prev,
          weighted_gpa: res.data?.weighted_gpa ?? '',
          unweighted_gpa: res.data?.unweighted_gpa ?? '',
          school_name: res.data?.school_name ?? '',
        }));
      } else {
        Alert.alert('Error', res.message ?? 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AcademicApiRequest();
  }, []);

  const SaveProfileRequest = async () => {
    try {
      setLoading(true);
      const token = await getItem(PREF_KEYS.accessToken);
      const reqBody: AcademicRequest = {
        weighted_gpa: '0',
        unweighted_gpa: form.unweighted_gpa,
        test_score_type: form.test_score_type,
        test_score: form.test_score,
        intended_major: form.intended_major_1,
        intended_major_2: form.intended_major_2,
        intended_major_3: form.intended_major_3,
        school_name: form.school_name,
        school_type: form.school_type,
        ncaa_eligibility_status: form.ncaa_eligibility_status,
      };

      const res = await httpRequest2<AcademicResponse>(Api_Url.academic, 'post', reqBody, token ?? '', true);

      if (res.status) {
          setTimeout(() => {
          onNext?.();
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

  return (
    <ScrollView keyboardShouldPersistTaps="handled" 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 100 }}>
      <Loader show={loading} />

      {/* GPA */}
      <View className="px-2">
        <TitleText text="Unweighted GPA" />
        <AppInput
          value={form.unweighted_gpa}
          keyboardType="decimal-pad"
          onChangeValue={(text) => handleChange('unweighted_gpa', text)}
          placeholder="Enter GPA (0 - 4.5)"
        />
        {errors.unweighted_gpa && <Text className="text-red-500">{errors.unweighted_gpa}</Text>}

        <TitleText className="mt-3">Test Scores</TitleText>
        <TestTypeToggle
          options={['sat', 'act']}
          initialValue={testType}
          onSelect={(sel) => {
            setTestType(sel as 'sat' | 'act');
            handleChange('test_score_type', sel);
            validateScore(form.test_score, sel as 'sat' | 'act', setErrors);
          }}
        />

        <AppInput
          value={form.test_score}
          keyboardType="numeric"
          onChangeValue={(text) => handleChange('test_score', text)}
          placeholder={`Enter ${testType} score`}
        />
        {form.test_score !== '' && errors.test_score && (
          <Text className="text-red-500">{errors.test_score}</Text>
        )}
      </View>

      {/* Intended Majors Section */}
        <TitleText  className='mt-3 -mb-3'>
          Intended Major 
        </TitleText>
      <View className="px-4 py-4 mt-4  bg-gray-200 rounded-3xl">
         <AppText>
          {/* Intended Major (<Text style={{ fontStyle: 'italic' , fontSize : 14 }}>Select upto 3 in order of preference</Text>) */}
                Select upto 3 in order of preference
        </AppText>

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
            className="mt-2 bg-primary py-2 px-4 rounded-full self-end"
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
          options={['public', 'private', 'boarding']}
          initialValue={schoolType}
          onSelect={(sel) => {
            setSchoolType(sel as 'public' | 'private' | 'boarding');
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
  );
};

export default Academic;

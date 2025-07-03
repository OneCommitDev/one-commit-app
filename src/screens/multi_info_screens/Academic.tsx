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




import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TestTypeToggle from './TestTypeToggle';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';
import MySliderComponent from '~/components/SliderComponent';
import WeightRuler from '~/components/WeightRuler';

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

  
  const [selectedMajor, setSelectedMajor] = useState('');
  const [showMajorsDropdown, setShowMajorsDropdown] = useState(false);

  const [form, setForm] = useState({
    weightedgpa: '',
    unweighted: '',
    sat_act: '',
    schoolname: '',
    schooltype: '',
    ncaaStatus: '',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* GPA Input */}
      <View>
        <View className="flex-row space-x-4">
          {/* Weighted GPA */}
          <View className="flex-1">
            <AppText>Weighted GPA</AppText>
            <AppInput
              value={form.weightedgpa}
              keyboardType="decimal-pad"
              onChangeValue={(text) => handleChange('weightedgpa', text)}
              placeholder="Enter value"
            />
          </View>

          {/* Unweighted GPA */}
          <View className="flex-1 ml-5">
            <AppText text="Unweighted GPA" />
            <AppInput
              value={form.unweighted}
              keyboardType="decimal-pad"
              onChangeValue={(text) => handleChange('unweighted', text)}
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
          initialValue="SAT"
          onSelect={(selected) => setTestType(selected as 'SAT' | 'ACT')}
        />
        {/* <MySliderComponent min={0} max={100} step={1} initialValue={10} labelInterval={20} /> */}
        {/* <WeightRuler /> */}

      </View>

      <AppInput
        value={form.sat_act}
        keyboardType="numeric"
        onChangeValue={(text) => handleChange('sat_act', text)}
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
        value={form.schoolname}
        onChangeValue={(text) => handleChange('schoolname', text)}
        placeholder="Enter School Name"
      />

      {/* School Type */}
      <AppText text="School Type" size="text-base" className="mb-1 mt-4" />
  
 
        <View className="mb-2">
        <TestTypeToggle
          options={['Public', 'Private', 'Boarding']}
          initialValue="Public"
          onSelect={(selected) => setSchoolType(selected as 'Public' | 'Private' | 'Boarding')}
        />
      </View>

      {/* NCAA Status */}
      <AppText text="NCAA Eligibility Center Status" size="text-base" className="mb-1" />
        <View className="mb-2">
        <TestTypeToggle
          options={['Yes', 'No', 'Unsure']}
          initialValue="Yes"
          onSelect={(selected) => setNCAAType(selected as 'Yes' | 'No' | 'Unsure')}
        />
      </View>

      {/* Continue Button */}
      <View className="px-2 py-4 mb-20">
        <ArrowButton
          text="Continue"
          onPress={() => onNext?.()} // ✅ safe call to parent handler
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

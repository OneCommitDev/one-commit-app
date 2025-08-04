// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ImageSourcePropType,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import ArrowButton from '~/components/ArrowButton';
// import AppText from '~/components/AppText';
// import WhiteCustomButton from '~/components/WhiteCustomButton';
// import images from '~/components/images';
// import TitleText from '~/components/TitleText';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '~/navigation/types';
// import OutreachSheet from './OutreachSheet';
// import SuccessModal from '~/components/SuccessModal';

// type College = {
//   id: string;
//   name: string;
//   division: string;
//   location: string;
//   tag: string;
//   match: string;
//   logoUrl: ImageSourcePropType;
// };

// type Props = {
//   onNext?: () => void;
// };
// type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


// const colleges: College[] = [
//   {
//     id: '1',
//     name: 'Stanford University',
//     division: 'NCAA Division I',
//     location: 'Stanford, CA',
//     tag: 'Target',
//     match: '92%',
//     logoUrl: images.run,
//   },
//   {
//     id: '2',
//     name: 'University of Florida',
//     division: 'NCAA Division I',
//     location: 'Gainesville, FL',
//     tag: 'Safe',
//     match: '88%',
//     logoUrl: images.run,
//   },
//   {
//     id: '3',
//     name: 'Harvard University',
//     division: 'NCAA Division I',
//     location: 'Cambridge, MA',
//     tag: 'Reach',
//     match: '75%',
//     logoUrl: images.run,
//   },
// ];

// export default function CollegeMatches({ onNext }: Props) {
//   const navigation = useNavigation<DashboardNavProp>();
//   const [sheetVisible, setSheetVisible] = useState(false);
// const [sheetData, setSheetData] = useState({ subject: '', message: '' });

// const [showOutreach, setShowOutreach] = useState(false);
// const [showSuccess, setShowSuccess] = useState(false);

//   const [selected, setSelected] = useState<string[]>([]);
//   const [searchText, setSearchText] = useState('');

//   const filteredColleges = useMemo(() => {
//     return colleges.filter((college) =>
//       college.name.toLowerCase().includes(searchText.toLowerCase())
//     );
//   }, [searchText]);

//   const toggleSelection = (id: string) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
//     );
//   };

//   return (
//     <View className="flex-1 bg-background px-2 pt-2">

//  <OutreachSheet
//   isVisible={sheetVisible}
//   onClose={() => setSheetVisible(false)}
//   initialSubject={sheetData.subject}
//   onEmailSent={() => {
//     setShowSuccess(true);
//   }}
// />

// <SuccessModal
//   isVisible={showSuccess}
//   onClose={() => setShowSuccess(false)}
// />


 

//       {/* 🔍 Search Box */}
//       <View className="flex-row items-center bg-white h-14 rounded-full px-4 mb-2">
//         <TextInput
//           placeholder="Search schools..."
//           className="flex-1 text-black"
//           value={searchText}
//           onChangeText={setSearchText}
//         />
//         <Ionicons name="search" size={20} color="gray" />
//       </View>

//       {/* 📊 Match Count + Filter */}
//       <View className="flex-row justify-between items-center mt-2 mb-2">
//         <AppText>
//           {filteredColleges.length} College Matches
//         </AppText>
//         {/* <TouchableOpacity>
//           <Ionicons name="filter" size={20} color="gray" />
//         </TouchableOpacity> */}
//       </View>

//       {/* 📋 Scrollable College List */}
//       <View className="flex-1">
//         <FlatList
//   data={filteredColleges}
//   keyExtractor={(item) => item.id}
//   contentContainerStyle={{ gap: 10, paddingBottom: 40 }}
//   renderItem={({ item }) => {
//     const isSelected = selected.includes(item.id);
//     return (
//       <TouchableOpacity
//         onPress={() => toggleSelection(item.id)}
//         className={`rounded-xl p-4 bg-white space-y-2 shadow-sm ${
//           isSelected ? 'border-2 border-green-700' : 'border border-transparent'
//         }`}
//       >
//         <View className="flex-row items-center space-x-4">
//          <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
//              {/* <Image
//             source={item.logoUrl}
//             className="w-8 h-8 rounded-full"
//             resizeMode="contain"
//           /> */}
//          </View>
//           <View className="flex-1 ml-2">
//             <TitleText  color='text-primary'>
//               {item.name}
//             </TitleText>
//             <AppText  className="-mt-3">
//               {item.division} - {item.location}
//             </AppText>
//             <View className="flex-row space-x-2 -mt-1">
//               <View
//                 className={`px-2 py-0.5 rounded-full ${
//                   item.tag === 'Safe'
//                     ? 'bg-blue-100'
//                     : item.tag === 'Target'
//                     ? 'bg-yellow-100'
//                     : 'bg-red-100'
//                 }`}
//               >
//                 <Text className="text-xs text-gray-700">{item.tag}</Text>
//               </View>
//                <View className='-mt-2 ml-3'>
//                  <AppText size='text-12'>
//                 {item.match} Match
//               </AppText>
//                </View>
//             </View>
//           </View>
//         </View>

//         <View className="mt-3">
//         <WhiteCustomButton
//             text="Start Outreach"
//             onPress={() => {
//               setSheetData({
//                 subject: 'Testing subject',
//                 message: 'I’m excited to connect with your program.',
//               });
//               setSheetVisible(true);
//             }}
//             fullWidth
//           />
        
//         </View>
//       </TouchableOpacity>
//     );
//   }}
//   ListFooterComponent={
//     <View className="px-2 pt-6 space-y-3">
//       {selected.length > 0 && (
//         <View className="bg-gray-200 px-3 py-2 rounded-full self-center">
//           <Text className="text-center text-sm text-gray-700">
//             {selected.length} schools selected
//           </Text>
//         </View>
//       )}

//      <View className='mb-5 mt-5'>
      
//        <WhiteCustomButton
//         text="Send Email to all"
//             onPress={() => onNext?.()}
//             fullWidth
//             height={50}
//           />
//      </View>

//       <ArrowButton
//         text="Finish & Go to Dashboard"
//          onPress={() => navigation.replace('Dashboard')}
//         fullWidth
//       />
//     </View>
//   }
// />

//       </View>

     
//     </View>
//   );
// }


// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ImageSourcePropType,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { Ionicons } from '@expo/vector-icons';

// import TitleText from '~/components/TitleText';
// import AppText from '~/components/AppText';
// import ArrowButton from '~/components/ArrowButton';
// import images from '~/components/images';
// import { RootStackParamList } from '~/navigation/types';

// type College = {
//   id: string;
//   name: string;
//   division: string;
//   location: string;
//   tag: 'Safe' | 'Target' | 'Reach';
//   region: string;
//   match: string;
//   logoUrl: ImageSourcePropType;
// };

// type Props = { onNext?: () => void };
// type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// const colleges: College[] = [
//   {
//     id: '1',
//     name: 'Stanford University',
//     division: 'NCAA Division I',
//     location: 'Stanford, CA',
//     tag: 'Target',
//     region: 'Midwest',
//     match: '92%',
//     logoUrl: images.logo,
//   },
//   {
//     id: '2',
//     name: 'University of Florida',
//     division: 'NCAA Division I',
//     location: 'Gainesville, FL',
//     tag: 'Safe',
//     region: 'South',
//     match: '88%',
//     logoUrl: images.logo,
//   },
//   {
//     id: '3',
//     name: 'Harvard University',
//     division: 'NCAA Division I',
//     location: 'Cambridge, MA',
//     tag: 'Reach',
//     region: 'Northeast',
//     match: '75%',
//     logoUrl: images.logo,
//   },
// ];

// export default function CollegeMatches({ onNext }: Props) {
//   const navigation = useNavigation<DashboardNavProp>();

//   return (
//     <View className="flex-1 bg-background">
//       <FlatList
//         data={colleges}
//         keyExtractor={item => item.id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
//         renderItem={({ item, index }) => (
//           <View className="p-4 bg-white rounded-xl shadow-sm">
//             {/* Top row: #1 - University Name (center) - Logo (right) */}
//             <View className="flex-row  justify-between mb-1">
//               {/* Number */}
//               <TitleText>{`#${index + 1}`}</TitleText>

//               {/* University Info - centered */}
//               <View className="flex-1 ml-5">
//                 <TitleText>{item.name}</TitleText>
//                 <AppText className="-mt-2">
//                   {item.division} – {item.location}
//                 </AppText>

//                   {/* Info chips - All gray background and centered */}
//             <View className="flex-row mt-1">
//               <View className="px-4 h-6 rounded-full bg-gray-200 text-center justify-center">
//                 <Text className="text-xs text-black">{item.tag}</Text>
//               </View>
//               <View className="px-4 h-6 rounded-full bg-gray-200 text-center justify-center ml-2">
//                 <Text className="text-xs text-black">{item.region}</Text>
//               </View>
//               <View className="px-4 h-6 rounded-full bg-gray-200 text-center justify-center ml-2">
//                 <Text className="text-xs text-black">{item.match} Match</Text>
//               </View>
//             </View>



//               </View>
            
 
//                      {/* <Image
//                 source={item.logoUrl}
//                 className="w-10 h-10 rounded-full mt-3"
//                 resizeMode="contain"
//               />    */}

//               <View className="items-center justify-center mt-1 mr-2">
//   {/* Delete icon at the top */}
//   <TouchableOpacity
//     onPress={() => {
//       // handle delete
//     }}
//     className="mb-2"
//   >
//     <Ionicons name="trash-outline" size={20} color="gray" />
//   </TouchableOpacity>

//   {/* Logo image below the icon */}
//   <Image
//     source={item.logoUrl}
//     className="w-10 h-10 rounded-full"
//     resizeMode="contain"
//   />
// </View>

          
//             </View>

// <View className="flex-row justify-between items-center">
//   <View className="border border-gray-300 rounded-full px-4 py-2 flex-row justify-center items-center ml-6 mt-2 mb-2">
//     <TouchableOpacity onPress={() => {}}>
//       <TitleText size="text-14">Why this match?</TitleText>
//     </TouchableOpacity>

//     <TitleText size="text-14 ml-1 mr-1">|</TitleText>

//     <TouchableOpacity onPress={() => {}}>
//       <TitleText size="text-14">View School Details</TitleText>
//     </TouchableOpacity>
//   </View>

//   {/* <TouchableOpacity
//     onPress={() => {
//     }}
//     className="ml-3"
//   >
//  <Ionicons name="trash-outline" size={20} color="gray" />
//   </TouchableOpacity> */}
// </View>


// {/* <View className="flex-row justify-between items-center mt-2">
//   <View className="flex-row">
//     <TouchableOpacity
//       onPress={() => {}}
//       className="border border-gray-300 rounded-[10] w-[140px] h-[36px] "
//     >
//       <TitleText size="text-14" className='text-center'>Why this match?</TitleText>
//     </TouchableOpacity>

//     <TouchableOpacity
//       onPress={() => {}}
//  className="border border-gray-300 rounded-[10] w-[150px] h-[36px] ml-2"    >
//       <TitleText size="text-14" className='text-center'>View School Details</TitleText>
//     </TouchableOpacity>
//   </View>

//    <TouchableOpacity
//     onPress={() => {
//     }}
//     className="ml-3"
//   >
//     <Ionicons name="trash-outline" size={20} color="gray" />
//   </TouchableOpacity>
// </View> */}



//           </View>
//         )}
//       />

//        <View className="mb-10 mt-4">
//         <ArrowButton
//           text="Finish & Go to Dashboard"
//           onPress={() => navigation.replace('Dashboard')}
//           fullWidth
//         />
//       </View>
//     </View>
//   );
// }



// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ImageSourcePropType,
//     Alert,           

// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { Ionicons } from '@expo/vector-icons';
// import SchoolDetailModal from '~/components/SchoolDetailModal';
// import TitleText from '~/components/TitleText';
// import AppText from '~/components/AppText';
// import ArrowButton from '~/components/ArrowButton';
// import images from '~/components/images';
// import { RootStackParamList } from '~/navigation/types';
// import SchoolMatchModal from '~/components/SchoolMatchModal';
// import Loader from '~/components/Loader';
// import { getItem } from 'expo-secure-store';
// import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
// import { GetSportsAlldata, SchoolsMatches } from '~/services/DataModals';
// import { PREF_KEYS } from '~/utils/Prefs';

// type College = {
//   id: string;
//   name: string;
//   division: string;
//   location: string;
//   tag: 'Safe' | 'Target' | 'Reach';
//   region: string;
//   match: string;
//   logoUrl: any;
// };

// type Props = { onNext?: () => void };
// type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// const colleges: College[] = [];

// export default function CollegeMatches({ onNext }: Props) {
//   const navigation = useNavigation<DashboardNavProp>();
// const [showDetails, setShowDetails] = React.useState(false);
// const [selectedSchoolMatchVisible, setSelectedSchoolMatchVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//  const [colleges, setColleges] = useState<College[]>([]);



//  useEffect(() => {
//   let mounted = true;

//  const fetchCollges = async () => {
//   try {
//     setLoading(true);
//     const accessToken = getItem(PREF_KEYS.accessToken);
//     const res = await httpRequest2<SchoolsMatches>(
//       Api_Url.schoolsMatches,
//       'get',
//       {},
//       accessToken ?? ''
//     );

//     if (mounted && res.status && res.data) {
//       const mappedColleges: College[] = res.data.map((school, index) => ({
//         id: school.school_id,
//         name: school.name,
//         division: school.ncaa_division, 
//         location: `${school.city}, ${school.state}`,
//         tag: 'Target', // default or dynamic logic if available
//         region: school.region,
//         match: `${school.overall_match_percent}%`,
//         logoUrl: school.img_path
//           ? { uri: school.img_path }
//           : images.logo, // fallback image
//       }));

//       console.log('mappedColleges ', res.data);

//       // setColleges(mappedColleges);
//     }
//   } catch (err) {
//     console.log('Error fetching athletic data', err);
//     Alert.alert('Error', 'Unexpected error occurred.');
//   } finally {
//     if (mounted) setLoading(false);
//   }
// };


//   fetchCollges();

//   return () => {
//     mounted = false;
//   };
// }, []);


//   return (
    
//    <View className="flex-1 bg-background">
//     <SchoolDetailModal
//   isVisible={showDetails}
//   onClose={() => setShowDetails(false)}
// />
// <SchoolMatchModal
//   isVisible={selectedSchoolMatchVisible}
//   onClose={() => setSelectedSchoolMatchVisible(false)}
// />
//       <Loader show={loading} />

// <TitleText>3 Collage Matches</TitleText>

//       <FlatList
//         data={colleges}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
//         renderItem={({ item, index }) => (
//           <View className="relative mt-3">
//             {/* Card Content */}
//             <View className="p-4 bg-white rounded-xl shadow-sm">
//               {/* Top Row */}
//               <View className="flex-row justify-between mb-1">
//                 {/* Number */}
//                 <TitleText>{`#${index + 1}`}</TitleText>

//                 {/* University Info */}
//                 <View className="flex-1 ml-5">
//                   <TitleText>{item.name}</TitleText>
//                   <AppText className="-mt-2">
//                     {item.division} – {item.location}
//                   </AppText>

//                   {/* Info Chips */}
//                   <View className="flex-row mt-1">
//                     <View className="px-4 h-6 rounded-full bg-gray-200 justify-center">
//                       <Text className="text-xs text-black">{item.tag}</Text>
//                     </View>
//                     <View className="px-4 h-6 rounded-full bg-gray-200 justify-center ml-2">
//                       <Text className="text-xs text-black">{item.region}</Text>
//                     </View>
//                     <View className="px-4 h-6 rounded-full bg-gray-200 justify-center ml-2">
//                       <Text className="text-xs text-black">{item.match} Match</Text>
//                     </View>
//                   </View>
//                 </View>

//                 {/* Logo */}
//                 <Image
//                   source={item.logoUrl}
//                   className="w-14 h-14 rounded-md mt-3"
//                   resizeMode="contain"
//                 />
//               </View>

//               {/* Button Row */}
//               <View className="flex-row justify-between items-center">
//                 <View className="border border-gray-300 rounded-full px-4 py-2 flex-row justify-center items-center ml-6 mt-2 mb-2">
//                   <TouchableOpacity onPress={() => setSelectedSchoolMatchVisible(true)}>
//                     <TitleText size="text-14">Why this match?</TitleText>
//                   </TouchableOpacity>

//                   <TitleText size="text-14 ml-1 mr-1">|</TitleText>

//                   <TouchableOpacity onPress={() => setShowDetails(true)}>
//                     <TitleText size="text-14">View School Details</TitleText>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>

//           {/* Overlapping Close / Delete Icon */}
//           <TouchableOpacity
//             onPress={() => {
//               Alert.alert(
//                 'Are you sure?',            
//                 undefined,                 
//                 [
//                   { text: 'Cancel', style: 'cancel' },
//                   {
//                     text: 'Yes',
//                     onPress: () => {
//                       // TODO: remove item here
//                     },
//                   },
//                 ],
//                 { cancelable: true }
//               );
//             }}
//             className="absolute -top-4 -right-2 p-1 rounded-full"
//           >
//             <Ionicons name="close-circle-outline" size={30} color="gray" />
//           </TouchableOpacity>

//           </View>
//         )}
//       />

//       {/* Bottom CTA Button */}
//       <View className="mb-10 mt-4">
//         <ArrowButton
//           text="Finish & Go to Dashboard"
//           onPress={() => navigation.replace('Dashboard')}
//           fullWidth
//         />
//       </View>
//     </View>
//   );
// }
 


import React, { useEffect, useRef, useState } from 'react';
import {  View,  Text,  FlatList,  TouchableOpacity,  Image,  Alert,  ActivityIndicator,  Animated,  Easing,  Dimensions, InteractionManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import SchoolDetailModal from '~/components/SchoolDetailModal';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import ArrowButton from '~/components/ArrowButton';
import SchoolMatchModal from '~/components/SchoolMatchModal';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import { Api_Url, base_url_images, httpRequest2 } from '~/services/serviceRequest';
import { MatchCriteria, SchoolMatchItem, SchoolsMatches, SimpleResponse } from '~/services/DataModals';
import { PREF_KEYS } from '~/utils/Prefs';
import LottieView from 'lottie-react-native';
import ConfirmModal from '~/components/ConfirmModal';
import SchoolCard from '~/components/SchoolCard';
import { RootStackParamList } from '~/navigation/types';
import {  NativeSyntheticEvent,  NativeScrollEvent,  ScrollView,} from 'react-native';
import OutreachSheet from './OutreachSheet';
import SuccessModal from '~/components/SuccessModal';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = SCREEN_HEIGHT * 0.50;
  
type Props = { onNext?: () => void };
type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function CollegeMatches({ onNext }: Props) {
  const navigation = useNavigation<DashboardNavProp>();

  const [matches, setMatches] = useState<SchoolMatchItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(2);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSchoolMatchVisible, setSelectedSchoolMatchVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [schoolIdToDelete, setSchoolIdToDelete] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<SchoolMatchItem | null>(null);
  const [flippingCardId, setFlippingCardId] = useState<string | null>(null);
  const flipAnim = useRef(new Animated.Value(0)).current;

   const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetData, setSheetData] = useState({ subject: '', message: '' });

 const [showOutreach, setShowOutreach] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);


  const triggerFlipAndShowDetails = (school: SchoolMatchItem) => {
    flipAnim.setValue(0);
    setSelectedSchool(school);
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowDetails(true);
    });
  };

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '0deg'],
  });

  useEffect(() => {
    fetchColleges(0);
  }, []);


  const fetchColleges = async (offsetToLoad = 0, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.schoolsMatches(offsetToLoad, limit);
      const res = await httpRequest2<SchoolsMatches>(
        url,
        'get',
        {},
        accessToken ?? ''
      );

      if (res.status && res.data) {
        setMatches(prev => append ? [...prev, ...res.data] : res.data);
        setOffset(offsetToLoad + limit);
        setTotal(res.pagination.total);
      }
    } catch (err) {
      console.log('Error fetching school matches', err);
      // Using Alert for error messages as per existing code, though a custom modal is generally preferred in React Native.
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      // Reset loading states
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

 
  const handleDelete = (schoolId: string, name: string) => {
    setSchoolIdToDelete(schoolId);
    setConfirmMessage(`Are you sure you want to delete “${name}”?`);
    setConfirmVisible(true);
  };

  const deleteColleges = async (deleteId: string , type : string) => {
    try {
      setLoading(true); // Show global loader during deletion

      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.schoolsMatchesDelete(deleteId , type);
      const res = await httpRequest2<SimpleResponse>(url, 'post', {}, accessToken ?? '', true);

      console.log('save_res' , res);
      if (res.status) {
        setMatches(prev => prev.filter(item => item.school_id !== deleteId));
        setTotal(prev => Math.max(prev - 1, 0));

        setTimeout(() => {
          setMatches(prev => {
            if (prev.length < total - 1) { // total - 1 because total was decremented
              fetchColleges(offset, true);
            }
            return prev;
          });
        }, 0);
      }
    } catch (err) {
      console.log('Error deleting school', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false); // Hide global loader
    }
  };

  /**
   * Confirms the deletion action and triggers the delete API call.
   */
  const confirmDelete = () => {
    if (schoolIdToDelete) {
      deleteColleges(schoolIdToDelete , "remove");
    }
    setConfirmVisible(false);
    setSchoolIdToDelete(null);
  };

 
  const renderSchoolItem = ({ item, index }: { item: SchoolMatchItem; index: number }) => {
    return (
      <View style={{ height: ITEM_HEIGHT }}> 
        <SchoolCard
          item={item}
          index={index}
          flippingCardId={flippingCardId}
          base_url_images={base_url_images}
          onSwipeLeft={() => deleteColleges(item.school_id , "save")}
          onSwipeRight={() => deleteColleges(item.school_id , "remove")}
          //  onSwipeLeft={() => deleteColleges("123")}
          // onSwipeRight={() => deleteColleges("123")}
        />
      </View>
    );
  };


  const completeProfileApiRequest = async () => {
    try {
      setLoading(true);  

      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.profileComplete;
      const res = await httpRequest2<SimpleResponse>(url, 'post', {}, accessToken ?? '', true);

      if (res.status) {
        setLoading(false);
      console.log(res);
        // setTimeout(() => {
        // // navigation.replace('Dashboard')
        //  setSheetData({
        //     subject: '',
        //     message: '',
        //     });
        //     setSheetVisible(true);
        // }, 100);
      //  closeAllModals();
// setAllModalsClosed(true);
setSheetVisible(false);

        InteractionManager.runAfterInteractions(() => {
              setTimeout(() => {
                  setSheetData({
                    subject: 'Testing subject',
                    message: 'I’m excited to connect with your program.',
                  });
                  setSheetVisible(true);
                }, 200); 
              });
      }
    } catch (err) {
      console.log('Error deleting school', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false); // Hide global loader
    }
  };

 const buttonTranslateY = useRef(new Animated.Value(0)).current;
  const scrollOffsetY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > scrollOffsetY.current ? 'down' : 'up';

    if (direction === 'down') {
      Animated.timing(buttonTranslateY, {
        toValue: 100, // hide button
        duration: 100,
        useNativeDriver: true,
      }).start();
    }

    // clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // set new timeout to detect scroll end
    scrollTimeout.current = setTimeout(() => {
      Animated.timing(buttonTranslateY, {
        toValue: 0, // show button
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, 350); 

    scrollOffsetY.current = currentOffset;
  };

 
 


  return (
    <View className="flex-1 bg-background  px-4">
     <View className='mt-14'>
      <TitleText size='text-24'>Explore</TitleText>
     </View>
      <SchoolDetailModal
        isVisible={showDetails}
        onClose={() => setShowDetails(false)}
        school={selectedSchool}
      />

      <SchoolMatchModal
        isVisible={selectedSchoolMatchVisible}
        onClose={() => setSelectedSchoolMatchVisible(false)}
        school={selectedSchool}
      />

      <ConfirmModal
        visible={confirmVisible}
        message={confirmMessage}
        onCancel={() => {
          setConfirmVisible(false);
          setSchoolIdToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
       <OutreachSheet
        isVisible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      initialSubject={sheetData.subject}
        onEmailSent={() => {
          setShowSuccess(true);
        }}
  />

    <SuccessModal
      isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />


      {/* Global loader component */}
      <Loader show={loading} />

      <TitleText>{`${total} College Matches`}</TitleText>
 
        {/* <FlatList
          data={matches}
          keyExtractor={(item, index) => `${item.school_id}_${index}`}
          renderItem={renderSchoolItem}
          pagingEnabled
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          bounces={false}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (!loadingMore && matches.length < total && offset < total) {
              fetchColleges(offset, true);
            }
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // flexGrow: 1,  
            paddingBottom: 0,
    paddingTop: 0,
          }}
          ListEmptyComponent={
            loading ? null : (  
              <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                <AppText>No college matches available.</AppText>
              </View>
            )
          }
          ListFooterComponent={
            loadingMore ? ( 
              <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView
                  source={require('assets/animations/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 200, height: 100 }}
                />
              </View>
            ) : null
          }
          scrollEnabled={matches.length > 1}
        /> */}

        <FlatList
  data={matches}
  keyExtractor={(item, index) => `${item.school_id}_${index}`}
  renderItem={renderSchoolItem}
  pagingEnabled
  snapToInterval={ITEM_HEIGHT}
  decelerationRate="fast"
  bounces={false}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  onEndReachedThreshold={0.5}
  onEndReached={() => {
    if (!loadingMore && matches.length < total && offset < total) {
      fetchColleges(offset, true);
    }
  }}
   onScroll={handleScroll}
        scrollEventThrottle={16}
  showsVerticalScrollIndicator={false}
  scrollEnabled={matches.length > 1}
  contentContainerStyle={{
    paddingTop: 0,
    // paddingBottom: matches.length * ITEM_HEIGHT > SCREEN_HEIGHT ? 0 : SCREEN_HEIGHT - ITEM_HEIGHT,
        paddingBottom: 160,

  }}
  ListEmptyComponent={
    loading ? null : (
      <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
          source={require('assets/animations/bot_no_data.json')}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
        <AppText className='-mt-5'>No college matches available.</AppText> 
      </View>
    )
  }
  ListFooterComponent={
    loadingMore ? (
      <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={require('assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: 200, height: 100 }}
        />
      </View>
    ) : <View style={{ height: 0 }} />
  }
/>
 <Animated.View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          transform: [{ translateY: buttonTranslateY }],
        }}
      >
     {/* <ArrowButton
            text="Finish & Go to Dashboard"
            onPress={() => {
            setSheetData({
            subject: 'Testing subject',
            message: 'I’m excited to connect with your program.',
            });
            setSheetVisible(true);
            }}
          fullWidth
        /> */}
         <ArrowButton
            text="Finish & Go to Dashboard"
                   onPress={() =>  completeProfileApiRequest()}

          fullWidth
        />
      </Animated.View>
 
      {/* Button to navigate to the Dashboard */}
      {/* <View className="mb-10 mt-4 ">
        <ArrowButton
          text="Finish & Go to Dashboard"
          onPress={() =>  completeProfileApiRequest()}
          fullWidth
        />
      </View> */}
    </View>
  );
}
 

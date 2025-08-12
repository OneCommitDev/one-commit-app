import React, { useCallback, useEffect, useState } from 'react';
import {  View,  Text,  SectionList,  TouchableOpacity,  Alert, InteractionManager,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import ArrowButton from '~/components/ArrowButton';
import { SelectedGame } from './GamesGrid';
import { Step } from './MultiStepSurvey';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { PREF_KEYS } from '~/utils/Prefs';
import { ProfileComplition, SimpleResponse } from '~/services/DataModals';
import TitleText from '~/components/TitleText';
import { setItem } from '~/utils/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MultiStepSurvey'>;

const sectionStepMap: Record<string, string> = {
  'Profile Details': 'profile',
  'Sports' : 'games',
  'Personal Records': 'PersonalRecords',
  'Academic Information': 'Academic',
  'College Preferences': 'College',
  'Connected Email Account': 'Accounts', // ✅ corrected
};

type MultiStepSurveyRouteProp = RouteProp<RootStackParamList, 'MultiStepSurvey'>;

function generateStepsData(selectedGames: SelectedGame[]): Step[] {
  const dynamicSteps: Step[] = selectedGames.map((sport) => ({
    title: sport.sportName,
    subtitle: 'Select the options as per your specialty.',
    type: 'games',
    sportId: sport.sportId,
  }));

  const staticSteps: Step[] = [
    {
      title: 'Personal Records',
      subtitle: 'Showcase your physical stats and achievements',
      type: 'PersonalRecords',
    },
    {
      title: 'Academic Information',
      subtitle: 'Help colleges see your academic strengths',
      type: 'Academic',
    },
    {
      title: 'College Preferences',
      subtitle: 'Choose your college preferences',
      type: 'College',
    },
    {
      title: 'Connected Email Account',
      subtitle: 'Required to send emails directly to coaches from your own account',
      type: 'Accounts',
    },
    {
      title: 'Profile Preview',
      subtitle: 'Review all your details',
      type: 'ProfilePreview',
    },
  ];

  return [...dynamicSteps, ...staticSteps];
}

type ProfileField = {
  title: string;
  value: string;
};

type ProfileSection = {
  title: string;
  data: ProfileField[];
};

export default function ProfilePreview({ onNext }: { onNext?: () => void }) {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MultiStepSurveyRouteProp>();
const { selectedGames , stepToEdit  } = route.params ?? {};
  const stepsData = generateStepsData(selectedGames);
  const [loading, setLoading] = useState(false);
  const [profileSections, setProfileSections] = useState<ProfileSection[]>([]);

//  const handleEdit = (sectionTitle: string) => {
//   const stepType = sectionStepMap[sectionTitle];

//   if (stepType === 'profile') {
//     console.log('Navigating to UserProfile for:', sectionTitle);
//     navigation.navigate('UserProfile', { src: '' });
//   } 
//   else  if (stepType === 'games') {  
//     const stepIndex = stepsData.findIndex(step => step.title === stepType);

//   }
//   else {
//     const stepIndex = stepsData.findIndex(step => step.type === stepType);
//     if (stepIndex !== -1) {
//       navigation.replace('MultiStepSurvey', {
//         selectedGames,
//         stepToEdit: stepIndex, // +1 if your flow starts after profile screen
//       });
//     } else {
//       Alert.alert('Error', 'Unable to locate section for editing.');
//     }
//   }
// };

const handleEdit = (sectionTitle: string) => {
  // Handle "Profile Details" specifically
  if (sectionTitle === 'Profile Details') {
    navigation.navigate('UserProfile', { src: 'review_src' });
    return;
  }

  // Check if this sectionTitle matches a sport (case-insensitive match)
  const matchedSport = selectedGames.find(
    (sport) => sport.sportName.toLowerCase() === sectionTitle.toLowerCase()
  );

  if (matchedSport) {
    const stepIndex = stepsData.findIndex(
      (step) => step.type === 'games' && step.sportId === matchedSport.sportId
    );

    if (stepIndex !== -1) {
      navigation.replace('MultiStepSurvey', {
        selectedGames,
        stepToEdit: stepIndex,
      });
    } else {
      //Alert.alert('Error', 'Sport step not found.');
    }

    return;
  }

  // For static sections like Personal Records, Academic Information, etc.
  const stepIndex = stepsData.findIndex(
    (step) => step.title.toLowerCase() === sectionTitle.toLowerCase()
  );

  if (stepIndex !== -1) {
    navigation.replace('MultiStepSurvey', {
      selectedGames,
      stepToEdit: stepIndex,
    });
  } else {
   // Alert.alert('Error', 'Unable to locate section for editing.');
  }
};

useFocusEffect(
  useCallback(() => {
    let mounted = true;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const accessToken = await getItem(PREF_KEYS.accessToken);
        const res = await httpRequest2<ProfileComplition>(
          Api_Url.profileSummary,
          'get',
          {},
          accessToken ?? ''
        );

        if (mounted && res.status && res.data) {
          const d = res.data;

          const sportSections: ProfileSection[] =
            d.sportUserFormattedData?.map((sport) => {
              const eventFields: ProfileField[] = sport.events.map((event) => ({
                title: event.display_name || event.event_name,
                value: `${event.eventValue ?? ''} ${event.eventUnit ?? ''}`.trim(),
              }));

              return {
                title: sport.display_name || sport.sport_name,
                data: [...eventFields],
              };
            }) || [];

          const updatedSampleData: ProfileSection[] = [
            {
              title: 'Profile Details',
              data: [
                { title: 'Full Name', value: d.full_name || '' },
                { title: 'Preferred Name', value: d.preferred_name || '' },
                { title: 'Email Address', value: d.email_connect_address || '' },
                { title: 'Phone Number', value: d.phone || '' },
                { title: 'Date of Birth', value: d.dob || '' },
                { title: 'ZipCode', value: d.zipcode || '' },
                { title: 'State', value: d.state || '' },
                { title: 'City', value: d.city || '' },
                { title: 'Gender', value: '' },
                { title: 'Weight', value: `${d.weight ?? ''} ${d.weight_unit ?? ''}` },
                { title: 'Height', value: `${d.height ?? ''} ${d.height_unit ?? ''}` },
              ],
            },
            ...sportSections,
            {
              title: 'Personal Records',
              data: [
                { title: 'Meet Highlighted Link', value: d.media_links || '' },
                { title: 'Additional Information', value: d.additional_info || '' },
              ],
            },
            {
              title: 'Academic Information',
              data: [
                { title: 'Unweighted GPA', value: d.unweighted_gpa || '' },
                { title: 'Test Scores Type', value: d.test_score_type || '' },
                { title: 'Test Scores', value: d.test_score?.toString() || '' },
                { title: 'Intended Major 1', value: d.intended_major || '' },
                { title: 'Intended Major 2', value: d.intended_major_2 || '' },
                { title: 'Intended Major 3', value: d.intended_major_3 || '' },
                { title: 'High School Name', value: d.school_name || '' },
                { title: 'High School Type', value: d.school_type || '' },
              ],
            },
            {
              title: 'College Preferences',
              data: [
                {
                  title: 'When it comes to recruiting, what matters most to you?',
                  value: d.what_matter_most || '',
                },
                {
                  title: 'NCAA Division Interest',
                  value: d.ncaa_division?.join(', ') || '',
                },
                { title: 'Preferred Region', value: d.preferred_region || '' },
                { title: 'School Size', value: d.school_size || '' },
                { title: 'Academic Rigor', value: d.academic_rigor || '' },
                { title: 'Campus Type', value: d.campus_type || '' },
                { title: 'Early Decision Willingness', value: d.early_decision_willingness || '' },
                {
                  title: 'How much money do you estimate your family can pay in tuition per year?',
                  value: d.required_financial_aid?.toString() || '',
                },
              ],
            },
            {
              title: 'Connected Email Account',
              data: [
                {
                  title: 'Email Connected',
                  value: d.email_connect_status ? 'Yes' : 'No',
                },
                {
                  title: 'Email Provider',
                  value: d.email_connect_provider ? 'Microsoft' : 'Gmail',
                },
              ],
            },
          ];
console.log(updatedSampleData);
           setProfileSections(updatedSampleData);
        }
      } catch (err) {
        console.log('Error fetching profile data', err);
        Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

// setTimeout(() => {
//   requestAnimationFrame(() => {
//     fetchProfileData();
//   });
// }, 100);  

InteractionManager.runAfterInteractions(() => {
  fetchProfileData();
});



    return () => {
      mounted = false;
    };
  }, [selectedGames]) // include any dependencies like selectedGames
);

  const completeProfileApiRequest = async () => {
    try {
      setLoading(true);  
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.profileComplete;
      const res = await httpRequest2<SimpleResponse>(url, 'post', {}, accessToken ?? '', true);

      if (res.status) {
        setLoading(false);
        setTimeout(() => {
        setItem(PREF_KEYS.profileCompleted , 'success');
           navigation.replace('SuccessProfileScreen')
        }, 300);
      }
    } catch (err) {
      console.log('Error deleting school', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false); // Hide global loader
    }
  };



// useEffect(() => {
//   let mounted = true;

//   const fetchProfileData = async () => {
//     try {
//       setLoading(true);
//       const accessToken = await getItem(PREF_KEYS.accessToken);
//       const res = await httpRequest2<ProfileComplition>(
//         Api_Url.profileSummary,
//         'get',
//         {},
//         accessToken ?? ''
//       );

//       if (mounted && res.status && res.data) {
//         const d = res.data;

//         // // 🔁 Dynamically generate sport sections
//         // const sportSections: ProfileSection[] = d.sportUserFormattedData?.map((sport) => ({
//         //   title: sport.display_name || sport.sport_name,
//         //   data: [
//         //     { title: sport.display_name, value: sport.sport_name || '' },
//         //   ],
//         // })) || [];
//         const sportSections: ProfileSection[] = d.sportUserFormattedData?.map((sport) => {
//   const eventFields: ProfileField[] = sport.events.map((event) => ({
//     title: event.display_name || event.event_name,
//     value: `${event.eventValue ?? ''} ${event.eventUnit ?? ''}`.trim(),
//   }));

//   return {
//     title: sport.display_name || sport.sport_name,
//     data: [
//       ...eventFields,
//     ],
//   };
// }) || [];


//         const updatedSampleData: ProfileSection[] = [
//           {
//             title: 'Profile Details',
//             data: [
//               { title: 'Full Name', value: d.full_name || '' },
//               { title: 'Preferred Name', value: d.preferred_name || '' },
//               { title: 'Email Address', value: d.email_connect_address || '' },
//               { title: 'Phone Number', value: d.phone || '' },
//               { title: 'Date of Birth', value: d.dob || '' },
//               { title: 'ZipCode', value: d.zipcode || '' },
//               { title: 'State', value: d.state || '' },
//               { title: 'City', value: d.city || '' },
//               { title: 'Gender', value: '' },
//               { title: 'Weight', value: `${d.weight ?? ''} ${d.weight_unit ?? ''}` },
//               { title: 'Height', value: `${d.height ?? ''} ${d.height_unit ?? ''}` },
//             ],
//           },

//           // 🏀 Add each sport as a section
//           ...sportSections,

//           {
//             title: 'Personal Records',
//             data: [
//               { title: 'Meet Highlighted Link', value: d.media_links || '' },
//               { title: 'Additional Information', value: d.additional_info || '' },
//             ],
//           },
//           {
//             title: 'Academic Information',
//             data: [
//               { title: 'Unweighted GPA', value: d.unweighted_gpa || '' },
//               { title: 'Test Scores Type', value: d.test_score_type || '' },
//               { title: 'Test Scores', value: d.test_score?.toString() || '' },
//               { title: 'Intended Major 1', value: d.intended_major || '' },
//               { title: 'Intended Major 2', value: d.intended_major_2 || '' },
//               { title: 'Intended Major 3', value: d.intended_major_3 || '' },
//               { title: 'High School Name', value: d.school_name || '' },
//               { title: 'High School Type', value: d.school_type || '' },
//             ],
//           },
//           {
//             title: 'College Preferences',
//             data: [
//               {
//                 title: 'When it comes to recruiting, what matters most to you?',
//                 value: d.what_matter_most || '',
//               },
//               {
//                 title: 'NCAA Division Interest',
//                 value: d.ncaa_division?.join(', ') || '',
//               },
//               { title: 'Preferred Region', value: d.preferred_region || '' },
//               { title: 'School Size', value: d.school_size || '' },
//               { title: 'Academic Rigor', value: d.academic_rigor || '' },
//               { title: 'Campus Type', value: d.campus_type || '' },
//               { title: 'Early Decision Willingness', value: d.early_decision_willingness || '' },
//               {
//                 title: 'How much money do you estimate your family can pay in tuition per year?',
//                 value: d.required_financial_aid?.toString() + 'k' || '',
//               },
//             ],
//           },
//           {
//             title: 'Connected Email Account',
//             data: [
//               {
//                 title: 'Email Connected',
//                 value: d.email_connect_status ? 'Yes' : 'No',
//               },
//               {
//                 title: 'Email Provider',
//                 value: d.email_connect_provider ? 'Microsoft' : 'Gmail',
//               },
//             ],
//           },
//         ];

//         setProfileSections(updatedSampleData);
//       }
//     } catch (err) {
//       console.log('Error fetching profile data', err);
//       Alert.alert('Error', 'Unexpected error occurred.');
//     } finally {
//       if (mounted) setLoading(false);
//     }
//   };

//   fetchProfileData();

//   return () => {
//     mounted = false;
//   };
// }, []);


  

  return (
    <View className="flex-1 bg-background">
      <Loader show={loading} />

      {!loading && profileSections.length === 0 && (
        <Text className="text-center text-gray-400 mt-8">
          No profile data available.
        </Text>
      )}

      <SectionList
        sections={profileSections}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View className="bg-white shadow-sm rounded-t-2xl px-4 py-3 flex-row justify-between items-center mt-6">
            <TitleText>
              {section.title}
            </TitleText>
            <TouchableOpacity
              onPress={() => handleEdit(section.title)}
              className="p-1 rounded-full bg-blue-100"
            >
              <Ionicons name="create-outline" size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <View
            className={`bg-white px-4 py-3 ${
              index === section.data.length - 1
                ? 'rounded-b-2xl'
                : 'border-b border-gray-200'
            }`}
          >
            <View className="flex-row justify-between items-start">
              <Text className="text-14 text-gray-800 w-[40%] font-nunitosemibold">{item.title}</Text>
              <Text className="text-14 font-nunitoregular text-gray-900 w-[55%] text-right">
                {item.value}
              </Text>
            </View>
          </View>
        )}
      />

      <View className="mb-10">
        <ArrowButton
          text="Finish & Go to Homescreen"
          fullWidth
          onPress={() => completeProfileApiRequest()}
        />
      </View>
    </View>
  );
}

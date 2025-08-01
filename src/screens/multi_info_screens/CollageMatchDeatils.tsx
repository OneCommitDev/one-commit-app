import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import { SchoolMatchItem } from '~/services/DataModals';
import TestTypeToggle from './TestTypeToggle';
import { Ionicons } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import SchoolDetailModal from '~/components/SchoolDetailModal';
import AppText from '~/components/AppText';
import SliderComponents from '~/components/SliderComponents';
import { Animated } from 'react-native';

type CollegeMatchDetailsRouteProp = RouteProp<RootStackParamList, 'CollegeMatchDetails'>;

export default function CollegeMatchDetails() {
  const navigation = useNavigation();
  const route = useRoute<CollegeMatchDetailsRouteProp>();
  const school: SchoolMatchItem | null = route.params?.school || null;
    const [showDetails, setShowDetails] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number>(2000);

  const [schoolType, setSchoolType] = useState<'School Deatils' | 'Why this match?'>('School Deatils');
const fadeAnim = useRef(new Animated.Value(0)).current;
const slideAnim = useRef(new Animated.Value(20)).current;
  const [form, setForm] = useState({
    weighted_gpa: '0',
    school_type: '',
  });

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  console.log(school);

  if (!school) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-base text-gray-600">No details available.</Text>
      </View>
    );
  }

  useEffect(() => {
  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }),
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }),
  ]).start();
}, []);



  return (
    <View className="flex-1 bg-background p-4 h-[90%] mt-10">
     <SafeAreaView>
        <View className='flex-row'>
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">

            <Ionicons name="close-outline" size={30} color="gray" className='mt-1 mr-3'/>
            </TouchableOpacity>

            <TitleText>Details</TitleText>
        </View>
     </SafeAreaView>

<View className="flex-row items-center justify-center">
  <View className="w-[90%]">
    <TestTypeToggle
      options={['School Deatils', 'Why this match?']}
      initialValue={schoolType}
      onSelect={(sel) => {
        setSchoolType(sel as 'School Deatils' | 'Why this match?');
        handleChange('school_type', sel);
      }}
    />
  </View>
</View>




       <ScrollView className="flex-1 m-4">
{schoolType === 'School Deatils' ? (
      <>
      {/* 🏫 School Info Section */}
      <View>
        <TitleText text="School Information" size="text-16" />
        <View className="flex-1 bg-white px-4 py-2 rounded-2xl">
          <TitleText>{school.name}</TitleText>
          <View className="w-full h-[1px] mt-2 bg-gray-200" />

          <View className="flex-row justify-between items-center mb-1">
            <TitleText text="Location:" className="flex-1" />
            <AppText  className="text-right" >{school.city} </AppText>
          </View>

          <View className="flex-row justify-between items-center mb-1">
            <TitleText text="NCAA Division:" className="flex-1" />
            <AppText  className="text-right" >{school.ncaa_division} </AppText>
          </View>

          <View className="flex-row justify-between items-center mb-1">
            <TitleText text="Enrollment:" className="flex-1" />
            <AppText text="N/A" className="text-right" />
          </View>

          <View className="flex-row justify-between items-center">
            <TitleText text="Region:" className="flex-1" />
            <AppText  className="text-right" >{school.region} </AppText>
          </View>
        </View>
      </View>

      {/* 🧑‍🏫 Coach Details Section */}
      <View className="mt-3">
        <TitleText text="Coach Details" size="text-16" className="mb-1" />
        <View className="flex-1 bg-white px-4 py-2 rounded-2xl">
          <TitleText>{school.coach_name}</TitleText>
          <View className="w-full h-[1px] mt-2 bg-gray-200" />

          <View className="flex-row justify-between items-center mb-1">
            <TitleText text="Email:" className="flex-1" />
            <AppText  className="text-right" >{school.coach_email} </AppText>
          </View>

          <View className="flex-row justify-between items-center mb-1">
            <TitleText text="Role:" className="flex-1" />
            <AppText  className="text-right" >{school.coach_role} </AppText>
          </View>

          <View className="flex-row justify-between items-center">
            <TitleText text="Phone no.:" className="flex-1" />
            <AppText  className="text-right" >N/A </AppText>
          </View>
        </View>
      </View>

      {/* 🏃 Team Info Section */}
      <View className="mt-3">
        <TitleText text="Team Info" size="text-16" className="mb-1" />
        <View className="flex-1 bg-white px-4 py-2 rounded-2xl">
          <View className="flex-row justify-between items-center mb-2">
            <TitleText text="Team Size:" className="flex-1" />
            <AppText text="N/A" className="text-right" />
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <TitleText text="Range of runners in their events:" className="flex-1" />
            <AppText text="N/A" className="text-right" />
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <TitleText text="Facility Specs:" className="flex-1" />
            <AppText text="N/A" className="text-right" />
          </View>

          <View className="flex-row justify-between items-center">
            <TitleText text="What conference they compete in:" className="flex-1" />
            <AppText text="N/A" className="text-right" />
          </View>
        </View>
      </View>
    </>
  ) : (
    <Animated.View
  style={{
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  }}
>
    <View className="flex-1">

         {/* 🏫 Athletic Fit Section */}
      <View>
        <TitleText text="Athletic Fit" size="text-16" />
            <View className="flex-1 bg-white px-4 py-2 rounded-2xl">
          <View className="flex-row justify-between items-center">
            <TitleText   className="flex-1" >Your {school.match_criteria.athlietic_fit[0].event_name.replace('_' , ' ')} </TitleText>
            <AppText  className="text-right" >
              {school.match_criteria.athlietic_fit[0].event_performance}
               </AppText>
          </View>

   <View className="flex-1">
            <TitleText   className="flex-1" >Benchmark</TitleText>
        <SliderComponents
            initialValue={7.50} 
            minimumValue={6.93}
            maximumValue={7.58}
            step={5}
            minLabel="6.93"
            maxLabel="8.50"
            valueSuffix=""
            disabled
            onValueChange={(value) => {
              setSelectedValue(value);
              handleChange('required_financial_aid', value.toString());
            }}
          />
          </View>
          

       <View className="flex-row justify-between items-center mb-1">
        <TitleText className="flex-1">
          {school.match_criteria.athlietic_fit[0].within_range === true ? '✅' : '❌'} Within Range
        </TitleText>
      </View>
        </View>
      </View>
      
      <View className="mt-3">
        <TitleText text="Academic Fit" size="text-16" className="mb-1" />
        <View className="flex-1 bg-white px-4 py-2 rounded-2xl">
      

          <View className="flex-row justify-between items-center mb-1">
            <TitleText text="Your GPA:" className="flex-1" />
            <AppText  className="text-right" >{school.match_criteria.academic_fit.unweighted_gpa} </AppText>
          </View>

          <View className="flex-row justify-between items-center mb-1">
            <TitleText text="School Min GPA:" className="flex-1" />
            <AppText  className="text-right" >{school.match_criteria.academic_fit.unweighted_gpa_school_min} </AppText>
          </View>
               <View className="flex-row justify-between items-center mb-1">
  <TitleText
    text={
      school.match_criteria.academic_fit.test_score_above_average === true
        ? '✅ Above Average'
        : '❌ Above Average'
    }
    className="flex-1"
  />
  <AppText className="text-right"></AppText>
</View>


          <View className="flex-row justify-between items-center">
            <TitleText   className="flex-1" >{school.match_criteria.academic_fit.test_type.toUpperCase()} (optional): </TitleText>
            <AppText  className="text-right" >
            {school.match_criteria.academic_fit.test_score} vs  {school.match_criteria.academic_fit.test_score_min} - {school.match_criteria.academic_fit.test_score_avg}
               </AppText>
          </View>
        </View>
      </View>

      <View className="mt-3">
        <TitleText text="Preference Fit (if applicable)" size="text-16" className="mb-1" />
        <View className="flex-1 bg-white px-4 py-2 rounded-2xl">
      

       <View className="flex-row justify-between items-center mb-1">
      <AppText className="flex-1">
        {school.match_criteria.preference_fit.preferred_region_match === true ? '✅' : '❌'} {school.match_criteria.preference_fit.preferred_region} Region
      </AppText>
      </View>


      <View className="flex-row justify-between items-center mb-1">
        <AppText className="flex-1">
        {school.match_criteria.preference_fit.school_size_match === true ? '✅' : '❌'} School size {school.match_criteria.preference_fit.school_size}
        </AppText>
      </View>


           {/* <View className="flex-row justify-between items-center mb-1">
            <AppText  className="flex-1" >✅ Medium-sized private school </AppText>
          </View> */}
        </View>
      </View>
       

          <View className="mt-3">
            <View className="flex-1 bg-white px-4 py-2 rounded-2xl">
              <View className="flex-row justify-between items-center mb-1">
                <TitleText text="Match Score" className="flex-1" />
                <View className="flex-row justify-end items-center space-x-2">
                  <AppText>{school.match_criteria.match_score.match_score_percent}%</AppText>
                  <View className="bg-yellow-100 px-4 py-1 rounded-lg ml-2">
                    <AppText className="text-xs">{school.match_criteria.match_score.match_score_tier}</AppText>
                  </View>
                   <Ionicons name="information-circle-sharp" size={20} color="gray" />
                </View>
              </View>
            </View>
          </View>
    
  </View>
  </Animated.View>
  )}
</ScrollView>


 
    </View>
  );
}





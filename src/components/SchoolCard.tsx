import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { MotiView, AnimatePresence } from 'moti';
import SegmentControl from './SegmentControl';
import AppText from './AppText';
import TitleText from './TitleText';
import { Ionicons } from '@expo/vector-icons';
import { SchoolMatchItem } from '~/services/DataModals';
import PerformanceBar from './PerformanceBar';

 

type Props = {
  item: SchoolMatchItem;
  index: number;
  flippingCardId: string | null;
  base_url_images: string;
  onSwipeLeft?: (school: SchoolMatchItem) => void; // Archive
  onSwipeRight?: (school: SchoolMatchItem) => void; // Delete
};

const SchoolCard: React.FC<Props> = ({
  item,
  index,
  flippingCardId,
  base_url_images,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const isFlipping = flippingCardId === item.school_id;
  const [showSegment, setShowSegment] = useState(false);

  const percent = parseFloat(item.overall_match_percent);
  const matchPercent = `${percent}%`;

  const logoSource = `${base_url_images}${item.img_path?.startsWith('/')
    ? item.img_path.slice(1)
    : item.img_path}`;

  const location = [item.city, item.state].filter(Boolean).join(', ');

  // Swipe actions
  const renderLeftActions = () => (
    <TouchableOpacity
      onPress={() => onSwipeLeft?.(item)}
      className="bg-background mt-40 items-start px-4 flex-1"
    >
         <View className='flex-row'>
        <Ionicons name="heart" size={24} color="#235D48" className='mt-1 mr-5' />
            <Text className="text-[#235D48] font-nunitoextrabold text-24">Intrested</Text>
    </View>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => onSwipeRight?.(item)}
      className="bg-background mt-40 items-end px-4 flex-1"
    >
    <View className='flex-row'>
        <Ionicons name="archive" size={24} color="red" className='mt-1 mr-5' />
            <Text className="text-red-500 font-nunitoextrabold text-24">Archive</Text>
    </View>

    </TouchableOpacity>
  );

  return (
 <Swipeable
  renderLeftActions={renderLeftActions}
  renderRightActions={renderRightActions}
  onSwipeableOpen={(direction) => {
    if (direction === 'left') {
      onSwipeLeft?.(item); // ARCHIVE
    } else if (direction === 'right') {
      onSwipeRight?.(item); // ARCHIVE
    }
  }}
>
      
        <View className="relative p-1   rounded-[10]">
        <View className="pt-1 pl-4 pr-4 bg-white rounded-xl shadow-sm shadow-white">
        <View className="flex-row justify-between mb-1">
        <TitleText>{`#${index + 1}`}</TitleText>

        {/* School Info */}
        <View className="flex-1 ml-5">
          <View className="flex-row  ">
            <TitleText>{item.name}</TitleText>
          </View>
        <View className="flex-row items-start -mt-3">
        <AppText>{item.ncaa_division}</AppText>
        <AppText>- {item.city} , {item.state} - {item.region}</AppText>
        </View>

 
        <View className="flex-row items-start -mt-3">
         <AppText>Test Score: Optional</AppText>
        </View>
    
        </View>

        

        {/* Logo & Match */}
        <View className="w-[60px] items-end">
        <Image
        source={{ uri: item.img_path }}
        className="w-[60] h-[60] rounded-[6] mt-4"
        resizeMode="contain"
        />
        </View>
        </View>
        
      <View className='justify-center -mt-2 mb-1   items-center'>
        <View className='bg-amber-400 w-[100px] h-[36px] rounded-full text-center items-center justify-center'>
            <AppText>
            {matchPercent} Match
            </AppText>
          </View>
      </View>

      


   




       <View className="w-full mt-2 h-[70%]">
  <SegmentControl selectedIndex={selectedTab} onChange={setSelectedTab} />

 <View className='flex-1 mt-2'>
   {selectedTab === 2 && item?.match_criteria?.preference_fit && (
    <View className="flex-1 p-2 space-y-2 h-full">
      <View>
        <AppText>
          {item.match_criteria.preference_fit.preferred_region_match ? '✅' : '❌'}{' '}
          {item.match_criteria.preference_fit.preferred_region} Region
        </AppText>
         <AppText>
          {item.match_criteria.preference_fit.school_size_match ? '✅' : '❌'} School size:{' '}
          {item.match_criteria.preference_fit.school_size}
        </AppText>
      </View>

     
    </View>
  )}

   {/* <PerformanceBar
          title="GPA:"
          score={10}
          min={5.0}
          max={10.0}
        /> */}
        

{selectedTab === 0 && (
  <View className="flex-1 px-2 space-y-2">
    {item.match_criteria?.academic_fit && (
      <>
         {/* Render GPA Bar */}
        <PerformanceBar
          title="GPA:"
          score={Number(item.match_criteria.academic_fit.unweighted_gpa) || 0}
          min={Number(item.match_criteria.academic_fit.unweighted_gpa_school_min) || 0}
          max={Number(item.match_criteria.academic_fit.unweighted_gpa_school_avg) || 4.5}
        />
        
        {/* Render Test Score Bar if SAT or ACT */}
        {item.match_criteria.academic_fit.test_type?.toLowerCase() === 'sat' && (
          <PerformanceBar
            title="SAT:"
            score={Number(item.match_criteria.academic_fit.test_score) || 0}
            min={Number(item.match_criteria.academic_fit.test_score_min) || 0}
            max={Number(item.match_criteria.academic_fit.test_score_avg) || 1600}
          />
        )}
        {item.match_criteria.academic_fit.test_type?.toLowerCase() === 'act' && (
          <PerformanceBar
            title="ACT:"
            score={Number(item.match_criteria.academic_fit.test_score) || 0}
            min={Number(item.match_criteria.academic_fit.test_score_min) || 0}
            max={Number(item.match_criteria.academic_fit.test_score_avg) || 36}
          />
        )}

     
      </>
    )}
  </View>
)}


 {selectedTab === 1 && (
  <View className="flex-1 px-2 space-y-2">
    {item.match_criteria?.athlietic_fit?.map((fit, index) => {
      const benchmark = fit?.event_name || '';
      const min = parseFloat(fit?.event_school_bm_min);
      const max = parseFloat(fit.event_school_bm_max);
      const score = Number(fit?.event_performance) || 0;

      return (
        <PerformanceBar
          key={index}
          title={fit?.event_name.replace('_', " ")}
          score={score}
          min={min}
          max={max}
        />
      );
    })}
  </View>
)}

 
 </View>
</View>

  
        </View>
        </View>
     </Swipeable>
  );
};

export default SchoolCard;

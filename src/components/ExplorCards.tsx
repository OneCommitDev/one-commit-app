
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { SchoolMatchItem } from '~/services/DataModals';
import AppText from './AppText';
import TitleText from './TitleText';
import PerformanceBar from './PerformanceBar';
import SegmentControl from './SegmentControl';

type Props = {
  item: SchoolMatchItem;
  index: number;
  flippingCardId: string | null;
  base_url_images: string;
  onSwipeLeft?: (school: SchoolMatchItem) => void;
  onSwipeRight?: (school: SchoolMatchItem) => void;
  onSkipCard?: () => void;
};

const ExplorCards: React.FC<Props> = ({
  item,  index,  flippingCardId,  base_url_images,  onSwipeLeft,  onSwipeRight, onSkipCard}) => {
     if (!item) return null;
  const percent = parseFloat(item.overall_match_percent || '0');
  const matchPercent = `${percent}%`;
  const logoSource = `${base_url_images}${item.img_path?.startsWith('/') ? item.img_path.slice(1) : item.img_path}`;
  const location = [item.city, item.state].filter(Boolean).join(', ');
  const [selectedTab, setSelectedTab] = useState(0);
  

  const renderLeftActions = () => (
   <View className='w-full flex-row'>
     <TouchableOpacity
      onPress={() => onSwipeLeft?.(item)}
      className="bg-white mt-0 items-start px-4 flex-1 justify-center rounded-[30px]"
    >
      <View className="flex-row items-center">
        <Ionicons name="heart" size={24} color="#235D48" />
        <Text className="text-[#235D48] font-bold text-lg ml-2">Interested</Text>
      </View>
    </TouchableOpacity>
   </View>
  );

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => onSwipeRight?.(item)}
      className="bg-white mt-0 items-end px-4 flex-1 justify-center"
    >
      <View className="flex-row items-center">
        <Ionicons name="archive" size={24} color="red" />
        <Text className="text-red-500 font-bold text-lg ml-2">Archive</Text>
      </View>
    </TouchableOpacity>
  );

  return (
<View className='bg-background'>
      <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') onSwipeLeft?.(item);
        if (direction === 'right') onSwipeRight?.(item);
      }}
    >
      
      <View className="bg-white rounded-xl shadow-md overflow-hidden">

        <View className="relative mb-10">
          <Image
            source={{
            // uri: item.img_path,
              uri: 'https://images.unsplash.com/photo-1542404937-2132aa1fa6fc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
            className="w-full h-[200px] rounded-[10px]"
            resizeMode="cover"
          />

       

          <View className="absolute top-1 left-4 px-3 py-1 rounded z-20">
            <TitleText size="text-24" color="text-white">{item.name}</TitleText>
          </View>

          <View className="absolute bottom-4 left-4 z-10 mr-[40%] bg-black/60 rounded-[10px]">
            <AppText className="leading-5 px-2 py-2" color="text-white">
              {item.name} is located in {item.city}, {item.state} - {item.region}.
            </AppText>
          </View>

          <View className="absolute bottom-[-30px] right-4 bg-white rounded-full w-[80px] h-[80px] items-center justify-center border-4 border-yellow-400 z-20 shadow-md">
            <TitleText size="text-[22px]" className="text-green-800">{matchPercent}</TitleText>
            <AppText size="text-[10px]" className="-mt-5">Match Score</AppText>
          </View>
        </View>

        <View className="px-4 pt-2 pb-4 flex-col justify-between">
          <View className="w-full">
            <SegmentControl selectedIndex={selectedTab} onChange={setSelectedTab} />

            <View className="mt-2">
              {selectedTab === 2 && item?.match_criteria?.preference_fit && (
                <View className="p-2 space-y-2">
                  <AppText>
                    {item.match_criteria.preference_fit.preferred_region_match ? '✅' : '❌'}{' '}
                    {item.match_criteria.preference_fit.preferred_region} Region
                  </AppText>
                  <AppText>
                    {item.match_criteria.preference_fit.school_size_match ? '✅' : '❌'} School size:{' '}
                    {item.match_criteria.preference_fit.school_size}
                  </AppText>
                </View>
              )}

            {selectedTab === 0 && item.match_criteria?.academic_fit && (
  <View className="px-2 space-y-2">
    {item.match_criteria.academic_fit.unweighted_gpa !== null && (
      <PerformanceBar
        title="GPA:"
        score={Number(item.match_criteria.academic_fit.unweighted_gpa)}
        show_min={Number(item.match_criteria.academic_fit.unweighted_gpa_school_min)}
        min={Number(item.match_criteria.academic_fit.unweighted_gpa_school_min)}
        max={Number(item.match_criteria.academic_fit.unweighted_gpa_school_avg)}
      />
    )}

    {item.match_criteria.academic_fit.sat_score !== null && (
      <PerformanceBar
        title="SAT:"
        score={Number(item.match_criteria.academic_fit.sat_score)}
        min={0}
        show_min={Number(item.match_criteria.academic_fit.sat_score_min)}
        max={Number(item.match_criteria.academic_fit.sat_score_avg)}
      />
    )}

    {item.match_criteria.academic_fit.act_score !== null &&
      item.match_criteria.academic_fit.act_score > 0 && (
        <PerformanceBar
          title="ACT:"
          score={Number(item.match_criteria.academic_fit.act_score)}
          min={0}
          show_min={Number(item.match_criteria.academic_fit.act_score)}
          max={Number(item.match_criteria.academic_fit.act_score_avg)}
        />
      )}
  </View>
)}

 
{selectedTab === 1 && item.match_criteria?.athlietic_fit && (
  <View style={{ maxHeight: 310, paddingHorizontal: 8 }}>
    <ScrollView
      contentContainerStyle={{ paddingVertical: 8 }}
      showsVerticalScrollIndicator={true}
    >
      {item.match_criteria.athlietic_fit.map((fit, index) => (
        <PerformanceBar
          key={index}
          show_min={parseFloat(fit?.event_school_bm_min)}
          title={fit.event_name?.replace('_', ' ')}
          score={Number(fit?.event_performance) || 0}
          min={0}
          max={parseFloat(fit?.event_school_bm_max)}
        />
      ))}
    </ScrollView>
  </View>
)}


              {/* {selectedTab === 1 && item.match_criteria?.athlietic_fit && (
                <View className="px-2 space-y-2">
                  {item.match_criteria.athlietic_fit.map((fit, index) => (
                    <PerformanceBar
                      key={index}
                      show_min={parseFloat(fit?.event_school_bm_min)}
                      title={fit.event_name?.replace('_', ' ')}
                      score={Number(fit?.event_performance) || 0}
                      // min={parseFloat(fit?.event_school_bm_min)}
                       min={0}
                      max={parseFloat(fit?.event_school_bm_max)}
                    />
                  ))}
                </View>
              )} */}
            </View>
          </View>

          <TouchableOpacity
  onPress={onSkipCard}
  className="mt-6 items-center justify-center"
>
            <AppText className="text-center text-blue-500 font-bold">Skip This Card</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
</View>
  );
};

export default ExplorCards;

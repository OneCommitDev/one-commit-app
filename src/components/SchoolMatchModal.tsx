import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TitleText from './TitleText';
import AppText from './AppText';
import { SchoolMatchItem } from '~/services/DataModals';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  school: SchoolMatchItem | null;
};

type MatchSectionItem = { lines: string[] };

type MatchSection = {
  title: string;
  data: MatchSectionItem[];
};

const formatAthletic = (schoolName: string, item: any): MatchSectionItem => {
  const eventName = item.event_name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const user = parseFloat(item.event_performance || '0').toFixed(1);
  const [min, max] = (item.event_school_benchmark ?? '0-0')
    .split('-')
    .map((n: string) => parseFloat(n).toFixed(1));

  return {
    lines: [
      `Your ${eventName} PR: ${user}s`,
      // `${schoolName} Benchmark: ${min}s – ${max}s`,
       `Benchmark: ${min}s – ${max}s`,
      ` ${item.within_range ? '✅ Within Range' : '✘ Not in Range'}`,
    ],
  };
};

const buildMatchSections = (school: SchoolMatchItem): MatchSection[] => {
  const athleticFit = school?.match_criteria?.athlietic_fit ?? [];
  const athleticBlocks = athleticFit.map((it) => formatAthletic(school.name, it));

  return [
    {
      title: '🏃‍♂️ Athletic Fit',
      data: athleticBlocks,
    },
  ];
};

export default function SchoolMatchModal({ isVisible, onClose, school }: Props) {
  const translateY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
      }).start();
    }
  }, [isVisible]);

  const close = () =>
    Animated.timing(translateY, {
      toValue: 500,
      useNativeDriver: true,
      duration: 250,
      easing: Easing.out(Easing.ease),
    }).start(onClose);

  const sections = useMemo(() => (school ? buildMatchSections(school) : []), [school]);

  const academic = school?.match_criteria?.academic_fit;
  const academicStatus = academic?.unweighted_gpa_above_average
    ? '✔︎ Above Average'
    : '✘ Below Average';
  const academicDetails = academic
    ? [
        `GPA: ${academic.unweighted_gpa ?? 'N/A'}`,
        `School Min GPA: ${academic.unweighted_gpa_school_min ?? 'N/A'}`,
        `${academic.test_type ?? 'Test'}: You ${academic.test_score ?? 'N/A'}, Avg ${academic.test_score_avg ?? 'N/A'}, Min ${academic.test_score_min ?? 'N/A'}`,
      ]
    : [];

  const preference = school?.match_criteria?.preference_fit;
  const preferenceDetails = preference
    ? [
        `Region: ${preference.preferred_region ?? 'N/A'}`,
        `School Size: ${preference.school_size ?? 'N/A'}`,
      ]
    : [];

  const matchScore = school?.match_criteria.match_score;

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <View className="flex-1 bg-black/40">
        <Animated.View
          style={{ transform: [{ translateY }] }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 pt-3 max-h-[85%]"
        >
          {/* handle & close */}
          <View className="self-center mb-2 w-12 h-1.5 bg-gray-300 rounded-full" />
          <TouchableOpacity onPress={close} className="absolute top-3 right-4 z-10">
            <Ionicons name="close" size={24} color="gray" />
          </TouchableOpacity>

          {/* title */}
          <TitleText className="text-center mb-4" fontFamily="font-nunitoextrabold" size="text-20">
            Why You Match with{'\n'}
            {school?.name ?? 'School'}
          </TitleText>

          {/* athletic section */}
          <SectionList
  sections={sections}
  stickySectionHeadersEnabled={false}
  keyExtractor={(_, i) => String(i)}
  renderSectionHeader={({ section }) => (
    <TitleText className="mt-3 mb-2 text-18">{section.title}</TitleText>
  )}
  renderItem={({ item }) => (
    <View className="mb-3">
      {item.lines.map((line, index) => {
        const [label, rest] = line.split(':');
        return (
          <Text key={index} style={{ marginBottom: 10, fontSize : 14 }}>
            • <Text style={{ fontWeight: 'bold', fontSize : 14 }}>{label.trim()}:</Text>{' '}
            {rest?.trim()}
          </Text>
        );
      })}
    </View>
  )}
  ListFooterComponent={
    <View className="mt-4 border-t border-gray-200 pt-4 pb-10">
      <TitleText className="text-18 mb-1">🧑‍🎓 Academic Fit</TitleText>
      {academicDetails.map((line, i) => (
        <AppText key={i} className="mb-1">
          • {line}
        </AppText>
      ))}
      {!!academic && (
        <AppText className="mb-2 text-green-700">{academicStatus}</AppText>
      )}

      <TitleText className="text-18 mt-2 mb-1">✅ Preference Fit (if applicable)</TitleText>
      {preferenceDetails.map((line, i) => (
        <AppText key={i} className="mb-1">
          • {line}
        </AppText>
      ))}

      {matchScore && (
        <View className="mt-4 flex-row items-center">
          <TitleText>Match Score: </TitleText>
          <Text className="font-semibold text-orange-600">
            {matchScore.match_score_percent ?? '0%'}
          </Text>
          <View className="bg-yellow-200 rounded-full px-3 py-0.5 ml-2">
            <Text className="text-xs font-medium text-gray-800">
              {matchScore.match_score_tier ?? 'N/A'}
            </Text>
          </View>
        </View>
      )}
    </View>
  }
  showsVerticalScrollIndicator={false}
/>

        </Animated.View>
      </View>
    </Modal>
  );
}

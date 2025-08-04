import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  SectionList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import TitleText from './TitleText';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import { SchoolMatchItem } from '~/services/DataModals';

type SectionItem = {
  label: string;
  value: string;
};

type SectionData = {
  title: string;
  data: SectionItem[];
  tags?: string[];
};

type Props = {
  isVisible: boolean;
  onClose: () => void;
  school: SchoolMatchItem | null;
};

// Animated item component with bottom-to-top animation
const AnimatedItem = ({
  item,
  index,
}: {
  item: SectionItem;
  index: number;
}) => {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <AppText className="mb-1">
        • <TitleText>{item.label}:</TitleText> {item.value}
      </AppText>
    </Animated.View>
  );
};

export default function SchoolDetailModal({
  isVisible,
  onClose,
  school,
}: Props) {
  const schoolData: SectionData[] = school
    ? [
        {
          title: '🔐 School Info',
          data: [
            { label: 'Location', value: `${school.city}, ${school.state}` },
            { label: 'NCAA Division', value: school.ncaa_division || 'N/A' },
            { label: 'Enrollment', value: 'N/A' },
            { label: 'Region', value: school.region || 'N/A' },
          ],
          tags: (school as any).tags || [],
        },
        {
          title: '🧑‍🏫 Coach Contact Info',
          data: [
            { label: 'Head Coach', value: school.coach_name || 'N/A' },
            { label: 'Email', value: school.coach_email || 'N/A' },
            { label: 'Role', value: school.coach_role || 'N/A' },
          ],
        },
        {
          title: '🏋️ Team Info',
          data: [
            { label: 'Team Size', value: 'N/A' },
            { label: 'Range of runners in their events', value: 'N/A' },
            { label: 'Facility specs', value: 'N/A' },
            { label: 'What conference they compete in', value: 'N/A' },
          ],
        },
      ]
    : [];

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View className="flex-1 bg-black/40">
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 pt-3 max-h-[85%]">
          {/* Drag Handle */}
          <View className="self-center mb-2 w-12 h-1.5 bg-gray-300 rounded-full" />

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-3 right-4 z-10"
          >
            <Ionicons name="close" size={24} color="gray" />
          </TouchableOpacity>

          {/* Title */}
          <TitleText
            className="text-center mb-4"
            fontFamily="font-nunitoextrabold"
            size="text-20"
          >
            {school?.name || 'School Name'}
          </TitleText>

          {/* Section List */}
          <SectionList
            sections={schoolData}
            keyExtractor={(item, index) => `${item.label}_${index}`}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section }) => (
              <View className="mb-1 mt-4">
                <TitleText className="mb-1 text-18">{section.title}</TitleText>
              </View>
            )}
            renderItem={({ item, index }) => (
              <AnimatedItem item={item} index={index} />
            )}
            renderSectionFooter={({ section }) =>
              section.title === '🔐 School Info' && section.tags?.length ? (
                <View className="flex-row flex-wrap mt-2 mb-2">
                  {section.tags.map((tag: string, idx: number) => (
                    <View
                      key={idx}
                      className="bg-yellow-100 rounded-full px-4 py-1 mb-1 ml-1"
                    >
                      <AppText size="text-12">{tag}</AppText>
                    </View>
                  ))}
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </Modal>
  );
}

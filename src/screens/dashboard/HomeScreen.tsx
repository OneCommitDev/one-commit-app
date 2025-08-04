import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import { PREF_KEYS } from '~/utils/Prefs';
import { getItem } from 'expo-secure-store';

const cardData = [
  {
    id: '1',
    title: 'TO-DO',
    icon: <Ionicons name="checkmark-done-circle" size={20} color="#14532D" />,
    items: [
      'Send follow-up to Coach Martinez',
      'Update your academic info',
    ],
  },
  {
    id: '2',
    title: 'WHAT WE LEARNED (RECAP)',
    icon: <Ionicons name="bulb-outline" size={20} color="#14532D" />,
    items: [
      'Coach Williams viewed your profile',
      'Coaches at 3 schools opened your email',
    ],
  },
  {
    id: '3',
    title: 'AI SUGGESTIONS',
    icon: <MaterialCommunityIcons name="atom-variant" size={20} color="#14532D" />,
    items: [
      'Add Carleton College to your list',
      'Consider removing Millsaps College',
    ],
  },
];

export default function HomeScreen() {
  const renderCard = ({ item }: { item: typeof cardData[0] }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
      <View className="flex-row items-center">
        {item.icon}
        <TitleText className='ml-2'>{item.title}</TitleText>
      </View>
      {item.items.map((text, idx) => (
        <View key={idx} className="flex-row items-start">
          <AppText className='ml-5'>•</AppText>
          <AppText className='ml-5'>{text}</AppText>
        </View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-background pt-14">
      <View className="px-4 mb-6">
        <TitleText size='text-24'>Hi, {getItem(PREF_KEYS.displayName)} 👋</TitleText>
        <AppText className='-mt-3'>Mon, 28 Sept</AppText>
      </View>

      <FlatList
        data={cardData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

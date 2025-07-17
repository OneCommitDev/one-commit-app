import React, { useState } from 'react';
import {  View,  Text,  Image,  TextInput,  TouchableOpacity,  FlatList,} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import ProfileSetting from './ProfileSetting';
import HomeScreen from './HomeScreen';
import StatsScreen from './StatsScreen';
import CalendarScreen from './CalendarScreen';
import AssistantScreen from './AssistantScreen';

// Define allowed tab types
type TabType = 'home' | 'stats' | 'calendar' | 'assistant' | 'profile';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const notificationCount = 8;


 
  const tabs: { tab: TabType; icon: keyof typeof Ionicons.glyphMap }[] = [
    { tab: 'home', icon: 'home' },
    { tab: 'stats', icon: 'bar-chart-outline' },
    { tab: 'calendar', icon: 'calendar-outline' },
    { tab: 'assistant', icon: 'rocket-outline' },
    { tab: 'profile', icon: 'person-outline' },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* <View className="flex-1 px-4 pt-10 pb-28"> */}
            <View className="flex-1  pb-28">

        {/* Header */}
        <View className="flex-row justify-between items-center mb-3 mt-6 px-3 pt-10">
          <AppText>SAT, 25 JUN 2026</AppText>
          <TouchableOpacity className="relative">
            <Ionicons name="notifications-outline" size={24} color="black" />
            {notificationCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-600 w-4 h-4 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tab content */}
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'calendar' && <CalendarScreen />}
        {activeTab === 'assistant' && <AssistantScreen />}
        {activeTab === 'profile' && <ProfileSetting />}
      </View>

      {/* Bottom Navigation */}
      <View className="absolute bottom-5 left-4 right-4 bg-[#2D3E36] flex-row justify-around items-center rounded-full h-20 shadow-lg px-3">
        {tabs.map(({ tab, icon }) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <View className={`p-3 rounded-full ${activeTab === tab ? 'bg-black' : ''}`}>
              <Ionicons
                name={icon}
                size={24}
                color={activeTab === tab ? '#86EFAC' : 'white'}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

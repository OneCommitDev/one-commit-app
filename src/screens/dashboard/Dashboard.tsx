import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import ProfileSetting from './ProfileSetting';
import HomeScreen from './HomeScreen';
import StatsScreen from './StatsScreen';
import CalendarScreen from './CalendarScreen';
import AssistantScreen from './AssistantScreen';
import DisplayDashboard from './DisplayDashboard';
import CollegeMatches from '../multi_info_screens/CollegeMatches';
import ExplorSchools from './ExplorSchools';
import { RouteProp, useRoute } from '@react-navigation/native';
import EditProfileInfo from './EditProfileinfo';

type TabType = 'Home' | 'Dashboard' | 'Explore' | 'Profile';

type RootStackParamList = {
  Dashboard: { onload?: TabType };   // optional param
};
type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

export default function Dashboard() {
  const route = useRoute<DashboardRouteProp>();
  const { onload } = route.params ?? {};   
  const [activeTab, setActiveTab] = useState<TabType>('Explore');
  const notificationCount = 8;
  const animation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
    if (onload) {
      setActiveTab(onload as TabType);
    }
  }, [onload]);

  const tabTitles: Record<TabType, string> = {
    Home: 'Hi, Hugh 👋',
    Dashboard: 'Dashboard',
    Explore: 'Explore',
    Profile: 'My Profile Settings',
  };

  const tabs: {
    tab: TabType;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
  }[] = [
    { tab: 'Home', icon: 'home', label: 'Home' },
    { tab: 'Dashboard', icon: 'options', label: 'Dashboard' },
    { tab: 'Explore', icon: 'arrow-forward-circle-outline', label: 'Explore' },
    { tab: 'Profile', icon: 'person-outline', label: 'Profile' },
  ];

  return (
    <View className="flex-1 bg-white">
          <Animated.View
        style={{
          flex: 1,
          opacity: animation,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        }}
      >
      <View className="flex-1 pb-20">
        {/* Header */}
        {/* <View className="flex-row justify-between items-center mb-3 mt-6 px-4 pt-10">
          <TitleText size="text-20">{tabTitles[activeTab]}</TitleText>
          <TouchableOpacity className="relative">
            <Ionicons name="notifications-outline" size={24} color="black" />
            {notificationCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-600 w-4 h-4 rounded-full items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View> */}

        {/* Tab Content */}
        {activeTab === 'Home' && <HomeScreen onRedirect={setActiveTab} />}
        {activeTab === 'Dashboard' && <DisplayDashboard  />}
        {activeTab === 'Explore' && <ExplorSchools  />}
        {activeTab === 'Profile' && <EditProfileInfo />}
      </View>
        </Animated.View>

      {/* Custom Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 h-[85px] bg-white border-t border-gray-200 flex-row justify-around items-center">
        {tabs.map(({ tab, icon, label }) => {
          const isActive = activeTab === tab;
            const activeIcon =
      icon.endsWith('-outline') ? icon.replace('-outline', '') : icon;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 items-center justify-center"
            >
              {/* <Ionicons name={icon} size={24} color={isActive ? '#235D48' : '#888'} /> */}
               <Ionicons
          name={isActive ? (activeIcon as any) : (icon as any)}
          size={24}
          color={isActive ? '#235D48' : '#888'}
        />
              <Text className={`text-xs mt-1 ${isActive ? 'text-[#235D48] font-nunitosemibold' : 'text-#888'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

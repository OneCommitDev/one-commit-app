// import React, { useState } from 'react';
// import {  View,  Text,  Image,  TextInput,  TouchableOpacity,  FlatList,} from 'react-native';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import TitleText from '~/components/TitleText';
// import AppText from '~/components/AppText';
// import ProfileSetting from './ProfileSetting';
// import HomeScreen from './HomeScreen';
// import StatsScreen from './StatsScreen';
// import CalendarScreen from './CalendarScreen';
// import AssistantScreen from './AssistantScreen';

// // Define allowed tab types
// type TabType = 'home' | 'stats' | 'calendar' | 'assistant' | 'profile';

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState<TabType>('home');
//   const notificationCount = 8;

// const tabTitles: Record<TabType, string> = {
//   home: 'Welcome Home',
//   stats: 'Manage Schools',
//   calendar: 'My Recruting Calendar',
//   assistant: 'AI Assistant',
//   profile: 'My Profile Settings',
// };

 
//   const tabs: { tab: TabType; icon: keyof typeof Ionicons.glyphMap }[] = [
//     { tab: 'home', icon: 'home' },
//     { tab: 'stats', icon: 'bar-chart-outline' },
//     { tab: 'calendar', icon: 'calendar-outline' },
//     { tab: 'assistant', icon: 'rocket-outline' },
//     { tab: 'profile', icon: 'person-outline' },
//   ];

//   return (
//     <View className="flex-1 bg-background">
//       {/* <View className="flex-1 px-4 pt-10 pb-28"> */}
//             <View className="flex-1  pb-28">

//         {/* Header */}
//         <View className="flex-row justify-between items-center mb-3 mt-6 px-3 pt-10">
//           <TitleText size='text-20'>{tabTitles[activeTab]}</TitleText>
//           <TouchableOpacity className="relative">
//             <Ionicons name="notifications-outline" size={24} color="black" />
//             {notificationCount > 0 && (
//               <View className="absolute -top-1 -right-1 bg-red-600 w-4 h-4 rounded-full items-center justify-center">
//                 <Text className="text-white text-[10px] font-bold">{notificationCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Tab content */}
//         {activeTab === 'home' && <HomeScreen />}
//         {activeTab === 'stats' && <StatsScreen />}
//         {activeTab === 'calendar' && <CalendarScreen />}
//         {activeTab === 'assistant' && <AssistantScreen />}
//         {activeTab === 'profile' && <ProfileSetting />}
//       </View>

//       {/* Bottom Navigation */}
//       <View className="absolute bottom-5 left-4 right-4 bg-[#2D3E36] flex-row justify-around items-center rounded-full h-20 shadow-lg px-3">
//         {tabs.map(({ tab, icon }) => (
//           <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
//             <View className={`p-3 rounded-full ${activeTab === tab ? 'bg-black' : ''}`}>
//               <Ionicons
//                 name={icon}
//                 size={24}
//                 color={activeTab === tab ? '#86EFAC' : 'white'}
//               />
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }









import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

type TabType = 'Home' | 'Dashboard' | 'Explore' | 'Profile';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const notificationCount = 8;

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
        {activeTab === 'Home' && <HomeScreen />}
        {activeTab === 'Dashboard' && <DisplayDashboard />}
        {activeTab === 'Explore' && <ExplorSchools />}
        {activeTab === 'Profile' && <ProfileSetting />}
      </View>

      {/* Custom Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 h-[85px] bg-white border-t border-gray-200 flex-row justify-around items-center">
        {tabs.map(({ tab, icon, label }) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 items-center justify-center"
            >
              <Ionicons name={icon} size={24} color={isActive ? '#235D48' : '#888'} />
              <Text className={`text-xs mt-1 ${isActive ? 'text-[#235D48] font-nunitosemibold' : 'text-gray-500'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

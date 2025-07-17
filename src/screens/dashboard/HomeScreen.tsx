import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';

type TabType = 'home' | 'stats' | 'calendar' | 'assistant' | 'profile';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-10 pb-28 justify-center items-center">
        <TitleText>
          HOMESCREEN
        </TitleText>
      </View>
    </View>
  );
}

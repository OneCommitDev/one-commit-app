import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';

type Props = {
  onNext?: () => void;
};

export default function CollegePreferences({ onNext }: Props) {
  return (
    <View className="space-y-5 pb-28">
    
     

      {/* Continue Button */}
      <View className="px-2">
        <ArrowButton text="Continue" onPress={() => onNext?.()} fullWidth />
      </View>
    </View>
  );
}

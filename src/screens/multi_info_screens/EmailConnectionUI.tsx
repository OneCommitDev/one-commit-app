import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import AppText from '~/components/AppText';
import TitleText from '~/components/TitleText';

type Props = {
  onNext?: () => void;
};

export default function EmailConnectionUI({ onNext }: Props) {
  const [selected, setSelected] = useState<'gmail' | 'outlook' | null>(null);

  return (
    <View className="space-y-5 pb-28">
      {/* Gmail */}
      <TouchableOpacity
        onPress={() => setSelected('gmail')}
        className={`flex-row items-center justify-between rounded-2xl px-5 py-4 h-24 mt-5 bg-white ${
          selected === 'gmail' ? 'border-2 border-primary' : 'border border-transparent'
        } shadow-sm`}
      >
        <View className="flex-row items-center space-x-4">
          <Image
            source={{ uri: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' }}
            className="w-10 h-10 rounded-full"
          />
          <TitleText className='ml-6'>
            Connect Gmail
          </TitleText>
        </View>
        {/* <Ionicons name="arrow-forward" size={20} color="#1A322E" /> */}
      </TouchableOpacity>

      {/* Outlook */}
      <TouchableOpacity
        onPress={() => setSelected('outlook')}
        className={`flex-row items-center justify-between rounded-2xl px-5 py-4 h-24 mt-3 bg-white ${
          selected === 'outlook' ? 'border-2 border-primary' : 'border border-transparent'
        } shadow-sm`}
      >
        <View className="flex-row items-center space-x-4">
          <Image
            source={require('../../../assets/images/outlook.png')
}
            className="w-10 h-10"
          />
          <TitleText className='ml-6'>
            Connect Outlook
          </TitleText>
        </View>
        {/* <Ionicons name="arrow-forward" size={20} color="#1A322E" /> */}
      </TouchableOpacity>

      {/* Info Box */}
      <View className="bg-background border border-border_color rounded-xl p-2 mt-4 mb-6 text-title">
        <AppText className="leading-relaxed ml-2">
          Email connection is required to use OneCommit’s outreach features. To learn more, click{' '}
          <Text
            className="underline text-black"
            onPress={() => Linking.openURL('https://onecommit.us/')}
          >
            here
          </Text>
          .
        </AppText>
      </View>

      {/* Continue Button */}
      <View className="px-2">
        <ArrowButton
          text="Continue"
          onPress={() => onNext?.()}
          fullWidth
          disabled={!selected}  
        />

        <TouchableOpacity onPress={() => onNext?.()}>
          <AppText className='text-center mt-5'>Skip for now</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

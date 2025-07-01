import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';

type Props = {
  onNext?: () => void;
};

const Athletic: React.FC<Props> = ({ onNext }) => {
  const [form, setForm] = useState({
    championships: [],
    swim1: '',
    swim2: '',
    Sprint: '',
    heightis2: '',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Your Inputs */}
      <AppText text="Personal Records/Track & Field" size="text-20" color='text-light' />
      {/* ... input fields ... */}

      <AppText text="Personal Records/Swimming" size="text-20" color='text-light' />
      {/* ... input fields ... */}

      <AppText text="Championship Experience" size="text-base" className="mb-1" />

      <View className="px-2 py-4 mb-20">
        <ArrowButton
          text="Continue"
          onPress={() => onNext?.()}
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

export default Athletic;

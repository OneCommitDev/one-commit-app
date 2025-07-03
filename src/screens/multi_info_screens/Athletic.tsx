import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Switch
} from 'react-native';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';
import { Ionicons } from '@expo/vector-icons';
import TestTypeToggle from './TestTypeToggle';
import TimePickerModal from '~/components/TimePickerModal';

type Props = {
  onNext?: () => void;
};

type InputItem = {
  key: string;
  label: string;
  placeholder: string;
  type : string;
};

type Section = {
  title: string;
  inputs: InputItem[];
};

const sections: Section[] = [
  {
    title: 'Track & Field',
    inputs: [
      { key: 'longJump', label: 'Long Jump', placeholder: 'Enter value' , type : 'Metric' },
      { key: 'sprint100m', label: '100m Sprint', placeholder: 'Enter value' , type : 'Metric' },
    ],
  },
  {
    title: 'Swimming',
    inputs: [
      { key: 'freestyle50m', label: '50m Freestyle', placeholder: 'Enter time' , type : 'time' },
      { key: 'backstroke100m', label: '100m Backstroke', placeholder: 'Enter time' , type : 'time' },
    ],
  },
];

const groupIntoPairs = (arr: InputItem[]) => {
  const pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push(arr.slice(i, i + 2));
  }
  return pairs;
};

const MAX_CHARS = 500;
const CHAMPIONSHIP_OPTIONS = ['Districts', 'Regionals', 'State', 'Nationals'];

const Athletic: React.FC<Props> = ({ onNext }) => {
  const [form, setForm] = useState<Record<string, string>>({});
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Utility: Check if all inputs are filled (excluding optional ones)
const isFormValid = sections.every(section =>
  section.inputs.every(input => form[input.key]?.trim().length)
);


  const handleSubmit = () => {
    const charCount = form['additional']?.length || 0;
    if (charCount > MAX_CHARS) {
      Alert.alert('Character Limit Exceeded', `Please limit your response to ${MAX_CHARS} characters.`);
      return;
    }
    onNext?.();
  };

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggleSwitch = (key: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <KeyboardAvoidingView
    className='bg-background'
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust if needed
    >
      <FlatList
        data={sections}
        keyExtractor={(section) => section.title}
        ListFooterComponent={
          <View className="px-4">
            {/* Highlight Videos */}
            <View className="mb-5 -mt-3">
              <AppText>Meet Highlight Link (optional)</AppText>
              <AppInput
                value={form['videoLink'] || ''}
                keyboardType="default"
                multiline
                numberOfLines={4}
                onChangeValue={(text) => handleChange('videoLink', text)}
                placeholder="Meet Highlight Link"
                className="h-24"
                textAlignVertical="top"
                onFocus={() => setFocusedKey('videoLink')}
                onBlur={() => setFocusedKey(null)}
              />
            </View>
            <TimePickerModal visible={false} onClose={function (): void {
              throw new Error('Function not implemented.');
            } } onSave={function (value: string): void {
              throw new Error('Function not implemented.');
            } } />

            {/* Additional Info with Character Count */}
            <View className="mb-5 -mt-3">
              <AppText>Any additional information</AppText>
              <AppInput
                value={form['additional'] || ''}
                keyboardType="default"
                multiline
                numberOfLines={4}
                onChangeValue={(text) => handleChange('additional', text)}
                placeholder="Any additional information..."
                className="h-24"
                textAlignVertical="top"
                onFocus={() => setFocusedKey('additional')}
                onBlur={() => setFocusedKey(null)}
              />
              <View className="flex-row justify-end mt-1">
                <Text
                  className={`text-xs text-right ${
                    (form['additional']?.length || 0) > MAX_CHARS
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {(form['additional']?.length || 0)}/{MAX_CHARS}
                </Text>
              </View>
            </View>

            <ArrowButton text="Continue" onPress={handleSubmit} fullWidth disabled={!isFormValid} />
          </View>
        }
 renderItem={({ item: section }) => {
  return (
    <View className="mb-8 bg-[#f7f9f9] rounded-2xl px-5 py-5 border border-gray-300">
      <AppText
        text={section.title}
        size="text-20"
        color="text-primary"
        fontFamily="font-nunitoextrabold"
        className="mb-2 px-4"
      />

      {section.inputs.map(({ key, label, placeholder, type }, idx) => (
        <View key={key}>
          <View className="mb-4 px-2">
            <AppText className="mb-1">{label}</AppText>

            <AppInput
              value={form[key] || ''}
              keyboardType="decimal-pad"
              onChangeValue={(text) => handleChange(key, text)}
              placeholder={placeholder}
              onFocus={() => setFocusedKey(key)}
              onBlur={() => setFocusedKey(null)}
            />

            {type === 'Metric' && (
              <View className="mt-2">
                <TestTypeToggle
                  options={['Metric', 'Imperial']}
                  initialValue="Metric"
                  onSelect={(selected) => {
                    setForm((prev) => ({ ...prev, [`${key}_gender`]: selected }));
                  }}
                />
              </View>
            )}
               

          </View>

          {/* Divider after each input except the last one */}
          {idx < section.inputs.length - 1 && (
            <View className="border-t border-gray-300 mx-2 mb-4" />
          )}
        </View>
      ))}
    </View>
  );
}}


        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
};

export default Athletic;

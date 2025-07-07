import React, { useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import ArrowButton from '~/components/ArrowButton';
import { Ionicons } from '@expo/vector-icons';
import TestTypeToggle from './TestTypeToggle';
import { CustomPickerModal } from '~/components/CustomPickerModal';
import { TimePickerModal } from '~/components/TimePickerModal';

type Props = {
  onNext?: () => void;
};

type InputItem = {
  key: string;
  label: string;
  placeholder: string;
  type: string;
};

type Section = {
  title: string;
  inputs: InputItem[];
};

const sections: Section[] = [
  {
    title: 'Track & Field',
    inputs: [
      { key: 'longJump', label: 'Long Jump', placeholder: 'Enter value', type: 'Metric' },
      { key: 'sprint100m', label: '100m Sprint', placeholder: 'Enter value', type: 'Metric' },
    ],
  },
  {
    title: 'Swimming',
    inputs: [
      { key: 'freestyle50m', label: '50m Freestyle', placeholder: 'Enter time', type: 'time' },
      { key: 'backstroke100m', label: '100m Backstroke', placeholder: 'Enter time', type: 'time' },
    ],
  },
];

const MAX_CHARS = 500;

const Athletic: React.FC<Props> = ({ onNext }) => {
  const [form, setForm] = useState<Record<string, { input: string; selected?: string }>>({});
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [activePickerKey, setActivePickerKey] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], input: value },
    }));
  };

  const handleSelect = (key: string, selected: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], selected },
    }));
  };

  const isFormValid = sections.every((section) =>
    section.inputs.every((input) => form[input.key]?.input?.trim().length)
  );

  const handleSubmit = () => {
    const charCount = form['additional']?.input?.length || 0;
    if (charCount > MAX_CHARS) {
      Alert.alert('Character Limit Exceeded', `Please limit your response to ${MAX_CHARS} characters.`);
      return;
    }
    onNext?.();
  };

  const metricOptions = ['Metric', 'Imperial'];
  const pickerDataMap: Record<string, { key: string; label: string; value: string }[]> = sections.reduce(
    (acc, section) => {
      section.inputs.forEach((input) => {
        if (input.type !== 'time') {
          acc[input.key] = metricOptions.map((val) => ({
            key: val.toLowerCase(),
            label: val,
            value: val,
          }));
        }
      });
      return acc;
    },
    {} as Record<string, { key: string; label: string; value: string }[]>
  );

  return (
    <KeyboardAvoidingView
      className="bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      {activePickerKey && (
        <CustomPickerModal
          visible={showCustomPicker}
          title={`Select ${sections
            .flatMap((s) => s.inputs)
            .find((input) => input.key === activePickerKey)?.label || ''}`}
          data={pickerDataMap[activePickerKey] || []}
          initialValue={form[activePickerKey]?.selected || ''}
          onClose={() => {
            setShowCustomPicker(false);
            setActivePickerKey(null);
          }}
          onSave={(selected) => {
            if (activePickerKey) {
              handleSelect(activePickerKey, selected.value);
              setShowCustomPicker(false);
              setActivePickerKey(null);
            }
          }}
        />
      )}

      <TimePickerModal
        visible={showTimePicker}
        initialValue={{ minutes: 0, seconds: 0, milliseconds: 0 }}
        onClose={() => setShowTimePicker(false)}
        onSave={(selected) => {
          const formatted = `${selected.minutes.toString().padStart(2, '0')}:${selected.seconds
            .toString()
            .padStart(2, '0')}:${selected.milliseconds.toString().padStart(2, '0')}`;
          if (activePickerKey) {
            handleSelect(activePickerKey, formatted);
            setShowTimePicker(false);
            setActivePickerKey(null);
          }
        }}
      />

      <FlatList
        data={sections}
        keyExtractor={(section) => section.title}
        ListFooterComponent={
          <View className="px-4">
            <View className="mb-5 -mt-3">
              <AppText>Meet Highlight Link (optional)</AppText>
              <AppInput
                value={form['videoLink']?.input || ''}
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

            <View className="mb-5 -mt-3">
              <AppText>Any additional information</AppText>
              <AppInput
                value={form['additional']?.input || ''}
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
                    (form['additional']?.input?.length || 0) > MAX_CHARS
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {(form['additional']?.input?.length || 0)}/{MAX_CHARS}
                </Text>
              </View>
            </View>

            <ArrowButton text="Continue" onPress={handleSubmit} fullWidth disabled={!isFormValid} />
          </View>
        }
        renderItem={({ item: section }) => (
          <View className="mb-8 bg-[#f7f9f9] rounded-2xl px-5 py-5 border border-gray-300">
            {/* <AppText
              text={section.title}
              size="text-20"
              color="text-primary"
              fontFamily="font-nunitoextrabold"
              className="mb-2 px-4"
            /> */}
                        <View className="flex-row items-center mb-2 px-1">
            <View className='h-14 w-14 mr-3 rounded-full mt-2 -ml-1'>
                        <Image
              source={{
                uri: 'https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-placeholder-line-icon-vector-png-image_6691835.png',
              }}
              className="h-12 w-12 mr-2 rounded-full"
              resizeMode="cover" // better for circle avatars
            />


            </View>
              <AppText
                text={section.title}
                size="text-20"
                color="text-primary"
                fontFamily="font-nunitoextrabold"
              />
            </View>
                  <View className="border-t border-gray-300 mx-2 mb-4" />

            {section.inputs.map(({ key, label, placeholder, type }, idx) => (
              <View key={key}>
                <View className="mb-4 px-2">
                  <View className="flex-row items-center justify-between mb-2">
                    <AppText>{label}</AppText>
                    <TouchableOpacity
                      onPress={() => {
                        setActivePickerKey(key);
                        if (type === 'time') {
                          setShowTimePicker(true);
                        } else {
                          setShowCustomPicker(true);
                        }
                      }}
                      className="px-4 py-2 rounded-full"
                    >
                      <View className="flex-row items-center border border-gray-300 px-2 py-1 rounded-md -mr-3 mt-2">
                      <Text className="text-light font-semibold text-sm mr-1">
                        {/* {form[key]?.selected || 'Select'} */}
                          {form[key]?.selected ||
                     (type === 'Metric' ? 'Metric' : type === 'time' ? '00:00:00' : 'Select')}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#6B7280" />
                    </View>
                    </TouchableOpacity>
                  </View>
                 <View className='-mt-3'> 
                   <AppInput
                    value={form[key]?.input || ''}
                    onPressIn={() => {
                      setActivePickerKey(key);
                    }}
                    placeholder={placeholder}
                    onChangeValue={(text) => handleChange(key, text)}
                  />
                 </View>
                </View>

                {idx < section.inputs.length - 1 && (
                  <View className="border-t border-gray-300 mx-2 mb-4" />
                )}
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
};

export default Athletic;
import React, { useState } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';

type Props = {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  labelInterval?: number; // Controls tick spacing
};

export default function MySliderComponent({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 50,
  labelInterval = 10,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const sliderWidth = Dimensions.get('window').width - 40;

  const generateLabels = () => {
    const labels = [];
    for (let i = min; i <= max; i += labelInterval) {
      labels.push(i);
    }
    return labels;
  };

  const labels = generateLabels();

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 6,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="mb-6 text-lg font-semibold text-primary">
        Value: {step < 1 ? value.toFixed(2) : value.toFixed(0)}
      </Text>

      <View className="bg-white  w-[99%]">
        <Slider
 style={{
    width: '100%',
    height: 40,
    transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }], // enlarges track & thumb
  }}
       minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={setValue}
          minimumTrackTintColor="#1FB28A"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#1FB28A"
        />

        {/* Tick Labels */}
        <View className="flex-row justify-between mt-3 mb-3">
          {labels.map((label, index) => (
            <Text
              key={index}
              style={{
                width: sliderWidth / (labels.length - 1),
                textAlign: 'center',
                color: '#6B7280',
              }}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

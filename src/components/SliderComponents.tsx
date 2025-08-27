import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import AppText from './AppText';

interface SliderComponentsProps {
  onValueChange?: (value: number) => void;
  initialValue?: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  middleLabel?: (value: number) => string;
  valueSuffix?: string;
  disabled?: boolean;
}

const SliderComponents: React.FC<SliderComponentsProps> = ({
  onValueChange,
  initialValue,
  minimumValue = 0,
  maximumValue = 200,
  step = 10,
  minLabel = '0k',
  maxLabel = '200k',
  middleLabel,
  valueSuffix = 'k',
  disabled = false,
}) => {
  const [value, setValue] = useState(initialValue ?? maximumValue / 2);

  useEffect(() => {
    if (typeof initialValue === 'number') {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleValueChange = (newValue: number) => {
    const roundedValue = Math.round(newValue);
    setValue(roundedValue);
    onValueChange?.(roundedValue);
  };

  
  return (
    <View className="p-0">
      <Slider
        className="w-full h-5"
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        minimumTrackTintColor="#235D48"
        maximumTrackTintColor="#E3E4E3"
        thumbTintColor="#647067"
      />
      <View className="flex-row justify-between mt-1">
        <AppText>{minLabel}</AppText>
        <AppText className="px-6 py-1 bg-gray-200 rounded-full">
          {middleLabel ? middleLabel(value) : `${value}${valueSuffix ?? ''}`}
        </AppText>
        <AppText>{maxLabel}</AppText>
      </View>
    </View>
  );
};

export default SliderComponents;

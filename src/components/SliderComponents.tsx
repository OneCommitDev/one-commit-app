import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import AppText from './AppText';

interface SliderComponentsProps {
  onValueChange?: (value: number) => void;
  initialValue?: number;
}

const SliderComponents: React.FC<SliderComponentsProps> = ({ onValueChange, initialValue }) => {
  const [value, setValue] = useState(initialValue ?? 2000);

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
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={10}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#235D48"
        maximumTrackTintColor="#E3E4E3"
        thumbTintColor="#647067"
      />
      <View style={styles.labelContainer}>
        {/* <Text style={styles.label}>0k</Text>
        <Text style={styles.value}>{value}k</Text>
        <Text style={styles.label}>100k</Text> */}
        <AppText>0k</AppText>
        <AppText>{value}k</AppText>
        <AppText>100k</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  slider: {
    width: '100%',
    height: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#235D48',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#235D48',
  },
});

export default SliderComponents;

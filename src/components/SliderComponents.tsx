import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

// Define the props interface
interface SliderComponentsProps {
  onValueChange?: (value: number) => void;
}

const SliderComponents: React.FC<SliderComponentsProps> = ({ onValueChange }) => {
  const [value, setValue] = useState(2000);
  
  const handleValueChange = (newValue: number) => {
    const roundedValue = Math.round(newValue);
    setValue(roundedValue);
    if (onValueChange) {
      onValueChange(roundedValue);
    }
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={60000}
        step={1000}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#235D48"
        maximumTrackTintColor="#E3E4E3"
        thumbTintColor="#647067"
      />
      <View style={styles.labelContainer}>
        <Text style={styles.label}>0</Text>
        <Text style={styles.value}>{Math.round(value)}</Text>
        <Text style={styles.label}>60000</Text>
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
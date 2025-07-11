import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

// Define the props interface
interface AcademicRigorSliderProps {
  onValueChange?: (value: string) => void;
}

const AcademicRigorSlider: React.FC<AcademicRigorSliderProps> = ({ onValueChange }) => {
  const [value, setValue] = useState(0);
  
  const options = ['Low', 'Medium', 'High'] as const;
  
  const handleValueChange = (newValue: number) => {
    const roundedValue = Math.round(newValue);
    setValue(roundedValue);
    if (onValueChange) {
      onValueChange(options[roundedValue]);
    }
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={2}
        step={1}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#235D48"
        maximumTrackTintColor="#E3E4E3"
        thumbTintColor="#647067"
      />
      <View style={styles.labelContainer}>
        {options.map((option, index) => (
          <Text
            key={index}
            style={[
              styles.label,
              Math.round(value) === index ? styles.selectedLabel : null,
            ]}
          >
            {option}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#235D48',
    fontWeight: 'bold',
  },
});

export default AcademicRigorSlider;
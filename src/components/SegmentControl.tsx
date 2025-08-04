import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const segments = ['Academic Fit', 'Athletic Fit' , 'Preference Fit'];

interface SegmentControlProps {
  selectedIndex: number;
  onChange: (index: number) => void;
}

const SegmentControl: React.FC<SegmentControlProps> = ({ selectedIndex, onChange }) => {
  return (
    <View className="flex-row bg-gray-200 rounded-full overflow-hidden border border-gray-200">
      {segments.map((label, index) => (
        <TouchableOpacity
          key={label}
          className={`flex-1 h-10 ${
            selectedIndex === index ? 'bg-white' : ''
          }`}
          onPress={() => onChange(index)}
        >
          <View className="flex-1 justify-center items-center px-2">
            <Text
              className={`font-nunitosemibold text-center ${
                selectedIndex === index ? 'text-primary font-bold text-[14px] ' : 'text-gray-500 text-[13px] '
              }`}
            >
              {label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SegmentControl;

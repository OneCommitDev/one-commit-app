import React, { useRef } from 'react';
import { TextInput, View, TextInputKeyPressEventData, NativeSyntheticEvent } from 'react-native';

type Props = {
  value: string;
  setValue: (val: string) => void;
};

export default function OTPInput({ value, setValue }: Props) {
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = value.split('');

    if (/^\d$/.test(text)) {
      newOtp[index] = text;
      const updated = newOtp.join('').padEnd(6, ''); // <-- Updated to 6 digits
      setValue(updated);

      // Auto move to next input if valid digit
      if (index < 5) {
        inputs.current[index + 1]?.focus(); // <-- Updated limit
      }
    } else if (text === '') {
      newOtp[index] = '';
      setValue(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between gap-2 px-4">
      {Array.from({ length: 6 }).map((_, i) => ( // <-- Updated to 6 inputs
        <TextInput
          key={i}
          ref={(ref) => {
            inputs.current[i] = ref;
          }}
          keyboardType="number-pad"
          maxLength={1}
          value={value[i] || ''}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          className="w-14 h-14 border border-gray-300 rounded-xl text-center text-xl bg-white font-bold text-black shadow-sm"
        />
      ))}
    </View>
  );
}

// AppText.tsx
import React from 'react';
import { Text, TextProps, View } from 'react-native';

type AppTextProps = TextProps & {
  text?: string;
  color?: string;
  size?: string;
  fontFamily?: string;
  className?: string;
};

export default function AppText({
  text,
  color = 'text-primary',
  size = 'text-base',
  fontFamily = 'font-nunitoextrabold',
  className = '',
  ...props
}: AppTextProps) {
  return (
  <View className='mt-2 mb-1'>
      <Text
      {...props}
      className={`${color} ${size} ${fontFamily} ${className}`}
    >
      {text || props.children}
    </Text>
  </View>
  );
}

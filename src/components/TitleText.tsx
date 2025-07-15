// AppText.tsx
import React from 'react';
import { Text, TextProps, View } from 'react-native';

type TitleTextProps = TextProps & {
  text?: string;
  color?: string;
  size?: string;
  fontFamily?: string;
  className?: string;
};

export default function TitleText({
  text,
  color = 'text-primary',
  size = 'text-16',
  fontFamily = 'font-nunitoextrabold',
  className = '',
  ...props
}: TitleTextProps) {
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

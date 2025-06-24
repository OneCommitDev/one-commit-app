// src/components/Logo.tsx

import React from 'react';
import { View, Image, ViewStyle, StyleProp } from 'react-native';

type Props = {
  size?: number;
  borderColor?: string;
  style?: StyleProp<ViewStyle>; // Accept any style externally
};

export default function Logo({ size = 128, borderColor = '#318264', style }: Props) {
  return (
    <View
      className="items-center justify-center rounded-3xl border-2"
      style={[
        {
          width: size,
          height: size,
          backgroundColor: '#185844',
          borderColor,
        },
        style, // allow margin or other styles externally
      ]}
    >
      <Image
        source={require('../../assets/images/logo.png')}
        style={{ width: size * 0.825, height: size * 0.825, borderRadius: 12 }}
        resizeMode="contain"
      />
    </View>
  );
}

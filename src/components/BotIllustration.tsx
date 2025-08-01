import React from 'react';
import { View, Image } from 'react-native';

export default function BotIllustration() {
  return (
    <View className="w-[220px] h-[220px] relative items-center justify-center">
      {/* Center Bot Image */}
      <Image
        source={require('assets/images/bot_Group.png')}
        className="w-[250px] h-[250px] absolute"
        resizeMode="contain"
      />

      {/* Left Heart Bubble */}
      <Image
        source={require('assets/images/Group-1.png')}
        className="w-[80px] h-[80px] absolute left-[0px] top-[30px]"
        resizeMode="contain"
      />

      {/* Right Chat Bubble with Purple Dash */}
      <View className="absolute right-[-10px] top-[-20px] items-center justify-center">
        <Image
          source={require('assets/images/Vector.png')}
          className="w-[80px] h-[80px]"
          resizeMode="contain"
        />
        <View className="absolute w-[50px] h-2 bg-purple-700 rounded-full top-[20px]" />
                <View className="absolute w-[30px] h-2 bg-purple-700 rounded-full top-[30px] -ml-5" />

      </View>
    </View>
  );
}

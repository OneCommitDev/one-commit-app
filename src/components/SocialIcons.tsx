import { Image, TouchableOpacity, View } from 'react-native';
import { Platform } from 'react-native';

type Props = {
  onIconPress: (platform: string) => void;
};

export default function SocialIcons({ onIconPress }: Props) {
    if (Platform.OS === 'ios') {
   // console.log('Running on iOS');
  } else if (Platform.OS === 'android') {
   // console.log('Running on Android');
  } else {
   // console.log('Running on Web or other');
  }
  return (
    <View className="flex-row justify-center mb-4 flex-wrap">
      {/* <TouchableOpacity
        className="p-5 rounded-2xl border border-gray-300 mr-4 mb-2"
        onPress={() => onIconPress('facebook')}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' }}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity> */}

      <TouchableOpacity
        className="p-5 rounded-2xl border border-gray-300 mr-4 mb-2"
        onPress={() => onIconPress('google')}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        className="p-5 rounded-2xl border border-gray-300 mr-4 mb-2"
        onPress={() => onIconPress('instagram')}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png' }}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity> */}
   {Platform.OS === 'ios' && (
      <TouchableOpacity
        className="p-5 rounded-2xl border border-gray-300 mr-4 mb-2"
        onPress={() => onIconPress('apple')}
      > 
        <Image
        source={require("../../assets/images/Apple_Logo_1.png")} // 👈 use require for local assets
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
)}
      <TouchableOpacity
        className="p-5 rounded-2xl border border-gray-300 mb-2"
        onPress={() => onIconPress('microsoft')}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/732/732221.png' }} // Microsoft logo
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

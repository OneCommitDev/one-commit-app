import { Image, TouchableOpacity, View } from 'react-native';
import AppText from './AppText';
import TitleText from './TitleText';

type Props = {
  onIconPress: (platform: string) => void;
};

export default function SocialIconsVertical({ onIconPress }: Props) {
  return (
    <View className="flex justify-center mb-1 w-[90%] ">

             <TouchableOpacity
        className="p-2 rounded-[5px] border border-gray-300  w-full flex-row items-center justify-center"
        onPress={() => onIconPress('apple')}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/179/179309.png' }}
          style={{ width: 26, height: 26, marginRight: 8 }}
          resizeMode="contain"
        />
                <AppText text='Apple' size='text-15'></AppText>

      </TouchableOpacity>
      
      <TouchableOpacity
        className="p-2 rounded-[5px] border border-gray-300  w-full flex-row items-center justify-center mt-2"
        onPress={() => onIconPress('google')}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }}
          style={{ width: 24, height: 24, marginRight: 8 }}
          resizeMode="contain"
        />
        <AppText text='Google' size='text-15'></AppText>
      </TouchableOpacity>

      

      <TouchableOpacity
        className="p-2 rounded-[5px] border border-gray-300  w-full flex-row items-center justify-center mt-3"
        onPress={() => onIconPress('microsoft')}
      >
        <Image
        className='ml-6'
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/732/732221.png' }}
          style={{ width: 24, height: 24, marginRight: 8 }}
          resizeMode="contain"
        />
        <AppText text='Microsoft' size='text-15'></AppText>

      </TouchableOpacity>

 
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import images from '~/components/images';
import AppText from '~/components/AppText';
import { getItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { ProfileResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
 const [loading, setLoading] = useState(false);
 
type GameItem = {
  id: string;
  title: string;
  image: ImageSourcePropType; // ✅ supports both require() and URLs
};

const gamesData: GameItem[] = [
  {
    id: '1',
    title: 'Track & Field',
    image: images.run,
  },
  {
    id: '2',
    title: 'Swimming',
    image: images.swim,
  },
];

const ITEM_WIDTH = Dimensions.get('window').width / 2.5 - 16; // 🔽 Reduced width for smaller grid items

export default function GamesGrid() {
  const [selected, setSelected] = useState<string[]>([]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const toggleSelection = (title: string) => {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleNext = () => {
    navigation.navigate('MultiStepSurvey', { selectedGames: selected });
  };

  const renderItem = ({ item }: { item: GameItem }) => {
    const isSelected = selected.includes(item.title);

      // useEffect(() => {
      //   const fetchGames = async () => {
      //     await GamesApiRequest();
      //   };
      //  fetchGames();
      // }, []);


 const GamesApiRequest = async () => {
    try {
      setLoading(true);
        // const email = getItem(PREF_KEYS.userEmailID);
        // const userId = await getItem(PREF_KEYS.userId);
        const accessToken = await getItem(PREF_KEYS.accessToken);
        const res = await httpRequest2<ProfileResponse>(
          Api_Url.gamesList,
          'get',
          accessToken ?? '',
        );

       if (res.status) {
          
       } else {
        Alert.alert('Error', res.message ?? 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };





    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item.title)}
        style={{
          width: ITEM_WIDTH,
          margin: 8,
          backgroundColor: isSelected ? '#DCFCE7' : 'white',
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? '#15803D' : '#E5E7EB',
          elevation: 2,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 3,
        }}
      >
    <View className="items-center justify-center m-2">
  <Image
    source={item.image}
    className="w-[70px] h-[70px] mb-2 mt-4"
  />
  <AppText size='text-18' className='-mt-2'>
    {item.title}
  </AppText>
</View>

      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 px-2 pt-12 bg-background">
            <Loader show={loading} />
    
      <View className="items-center mb-4 mt-5">
        <Text className="text-24 font-nunitoextrabold text-title text-center mb-1">
          Choose Games
        </Text>
      </View>

     <FlatList
  data={gamesData}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  numColumns={2}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 16,
    justifyContent: 'center',
    alignItems: 'center', // ⬅️ This aligns items horizontally
  }}
/>

      {selected.length > 0 && (
        <View className="mt-2 px-2">
          <Text className="text-green-800 mb-1">Selected</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {selected.map((item) => (
                <View
                  key={item}
                  className="flex-row items-center bg-gray-200 px-4 py-2 rounded-full"
                >
                  <Text className="text-green-800 mr-2">{item}</Text>
                  <TouchableOpacity onPress={() => toggleSelection(item)}>
                    <Ionicons name="close" size={16} color="#1A322E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View className="px-4 my-6 mb-10">
        <ArrowButton text="Continue" onPress={handleNext} fullWidth disabled={selected.length === 0} />
      </View>
    </View>
  );
}



 
 


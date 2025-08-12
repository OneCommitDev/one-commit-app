import React, { useEffect, useState } from 'react';
import {  View,  Text,  FlatList,  Image,  TouchableOpacity,  Dimensions,  ScrollView,  ImageSourcePropType,  Alert,
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
import { Api_Url, base_url_images, httpRequest2 } from '~/services/serviceRequest';
import { GamesResponse } from '~/services/DataModals';
import Loader from '~/components/Loader';
import TitleText from '~/components/TitleText';

// ✅ Define the type for selected game
export type SelectedGame = {
  sportName: string;
  sportId: string;
};

// ✅ Define your internal GameItem type
type GameItem = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  selectedids: any;
};

const gamesData: GameItem[] = [];
const ITEM_WIDTH = Dimensions.get('window').width / 2.5 - 16;

export default function GamesGrid() {
  const [selected, setSelected] = useState<SelectedGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [gamesList, setGamesList] = useState<GameItem[]>(gamesData);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    SportsApiRequest();
  }, []);

  const SportsApiRequest = async () => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const res = await httpRequest2<GamesResponse>(
        Api_Url.gamesList,
        'get',
        {},
        accessToken ?? '',
      );

      if (res.status && Array.isArray(res.data)) {
        const merged: GameItem[] = res.data.map((item) => ({
          id: item.sport_id?.toString() ?? '',
          title: item.display_name || item.sport_name,
          image: {
            uri: `${base_url_images}${
    item.img_path
      ?.replace(/^\/?v1\//, '') // remove leading "v1/" or "/v1/"
  }`,
          },
          selectedids: item.user_selected,
        }));

        

        console.log('mergedmerged', merged);
        setGamesList(merged);

 const preSelectedGames = merged
          .filter((item) => item.selectedids === "1")
          .map((item) => ({
            sportName: item.title,
            sportId: item.id,
          }));

        setSelected(preSelectedGames);


      } else {
        Alert.alert('Error', res.message ?? 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (title: string) =>
    selected.some((item) => item.sportName === title);

  const toggleSelection = (game: GameItem) => {
    setSelected((prev) => {
      const exists = prev.find((g) => g.sportName === game.title);
      if (exists) {
        return prev.filter((g) => g.sportName !== game.title);
      } else {
        return [...prev, { sportName: game.title, sportId: game.id }];
      }
    });
  };

  const handleNext = () => {
   navigation.navigate('MultiStepSurvey', {
  selectedGames: selected,
  stepToEdit: null, // ✅ use colon, not semicolon
});

  };

  const renderItem = ({ item }: { item: GameItem }) => (
    <TouchableOpacity
      onPress={() => toggleSelection(item)}
      style={{
        width: ITEM_WIDTH,
        margin: 8,
        backgroundColor: isSelected(item.title) ? '#DCFCE7' : 'white',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: isSelected(item.title) ? 2 : 1,
        borderColor: isSelected(item.title) ? '#15803D' : '#E5E7EB',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
      }}
    >
      <View className="items-center justify-center m-2">
        <Image source={item.image} className="w-[70px] h-[70px] mb-2 mt-4 rounded-md" />
        <TitleText  className="-mt-2">
          {item.title}
        </TitleText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 px-2 pt-12 bg-background">
      <Loader show={loading} />

      <View className="items-center mb-4 mt-5">
        <Text className="text-24 font-nunitoextrabold text-primary text-center mb-1">
          Choose Games
        </Text>
      </View>

      <FlatList
        data={gamesList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />

      {selected.length > 0 && (
        <View className="mt-2 px-2">
          <Text className="text-green-800 mb-1">Selected</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {selected.map((item) => (
                <View
                  key={item.sportName}
                  className="flex-row items-center bg-gray-200 px-4 py-2 rounded-full mr-2"
                >
                  <Text className="text-green-800 mr-2">{item.sportName}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      toggleSelection({
                        id: item.sportId.toString(),
                        title: item.sportName,
                        image: images.logo,
                        selectedids: null,
                      })
                    }
                  >
                    <Ionicons name="close" size={16} color="#1A322E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View className="px-4 my-6 mb-10">
        <ArrowButton
          text="Continue"
          onPress={handleNext}
          fullWidth
          disabled={selected.length === 0}
        />
      </View>
    </View>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import {  View,  Text,  FlatList,  TouchableOpacity,  Image,  Alert,  ActivityIndicator,  Animated,  Easing,  Dimensions, InteractionManager, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import SchoolDetailModal from '~/components/SchoolDetailModal';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import ArrowButton from '~/components/ArrowButton';
import SchoolMatchModal from '~/components/SchoolMatchModal';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import { Api_Url, base_url_images, httpRequest2 } from '~/services/serviceRequest';
import { MatchCriteria, SchoolMatchItem, SchoolsMatches, SearchSchoolData, SearchSchoolModal, SimpleResponse } from '~/services/DataModals';
import { PREF_KEYS } from '~/utils/Prefs';
import LottieView from 'lottie-react-native';
import ConfirmModal from '~/components/ConfirmModal';
import SchoolCard from '~/components/SchoolCard';
import { RootStackParamList } from '~/navigation/types';
import {  NativeSyntheticEvent,  NativeScrollEvent,  ScrollView,} from 'react-native';
import SuccessModal from '~/components/SuccessModal';
import ExplorCards from '~/components/ExplorCards';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = SCREEN_HEIGHT * 0.73;
  
 type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function ExplorSchools() {
 
  const [matches, setMatches] = useState<SchoolMatchItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSchoolMatchVisible, setSelectedSchoolMatchVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [schoolIdToDelete, setSchoolIdToDelete] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<SchoolMatchItem | null>(null);
  const [flippingCardId, setFlippingCardId] = useState<string | null>(null);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<FlatList>(null);
const [currentIndex, setCurrentIndex] = useState(0);

const [noMoreData, setNoMoreData] = useState(false);



   const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetData, setSheetData] = useState({ subject: '', message: '' });

 const [showOutreach, setShowOutreach] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);
const slideAnim = useRef(new Animated.Value(0)).current;
  const [searchText, setSearchText] = useState('');
const [filteredData, setFilteredData] = useState<SearchSchoolData[]>([]);
const [allSchools, setAllSchools] = useState<SearchSchoolData[]>([]);


  const triggerFlipAndShowDetails = (school: SchoolMatchItem) => {
    flipAnim.setValue(0);
    setSelectedSchool(school);
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowDetails(true);
    });
  };

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '0deg'],
  });

  useEffect(() => {
    SearchSchoolSilientCall();
    fetchColleges(0);
  }, []);

    const SearchSchoolSilientCall = async () => {
     try {
       setFilteredData([]);

      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.searchSchool;
      const res = await httpRequest2<SearchSchoolModal>(
        url,
        'get',
        {},
        accessToken ?? '',
        true
      );
      console.log('search_data', res);
    if (res?.status && Array.isArray(res.data)) {
      setAllSchools(res.data);        // ✅ store all from API
      setFilteredData(res.data);      // also update filtered view
    } else {
      setAllSchools([]);
      setFilteredData([]);
    }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
       
    }
  };


  const fetchColleges = async (offsetToLoad = 0, append = false) => {
    setLoading(true)
    try {
      if (append) setLoadingMore(true);
    else {
      setMatches([]);             
      setCurrentIndex(0);         
      setNoMoreData(false);       
      setLoading(true);
    }

      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.schoolsMatches(offsetToLoad, limit);
      const res = await httpRequest2<SchoolsMatches>(
        url,
        'post',
        {},
        accessToken ?? '',
        true
      );


if (!Array.isArray(res.data) || res.data.length === 0) {
        setNoMoreData(true);
        console.log('no data available', res.data);
                setMatches(prev => append ? [...prev, ...res.data] : res.data);
         setLoading(false)

        return;  
      } else {
         setNoMoreData(false);
            setLoading(false)
            setMatches([]);             
            setCurrentIndex(0);
            setMatches(prev => append ? [...prev, ...res.data] : res.data);
            setOffset(offsetToLoad + limit);
            setTotal(res.pagination.total);

            setTimeout(() => {
              setCurrentIndex(prev => {
                const hasMore = matches.length > prev + 1;
                return hasMore ? prev + 1 : prev;
              });
          }, 300);
      }
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  };

 
  const handleDelete = (schoolId: string, name: string) => {
    setSchoolIdToDelete(schoolId);
    setConfirmMessage(`Are you sure you want to delete “${name}”?`);
    setConfirmVisible(true);
  };

  const deleteColleges = async (deleteId: string , type : string) => {
    try {
      setLoading(true);  

      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.schoolsMatchesDelete(deleteId , type);
      const res = await httpRequest2<SimpleResponse>(url, 'post', {}, accessToken ?? '', true);

      console.log('save_res' , res);
      if (res.status) {
        // setMatches(prev => prev.filter(item => item.school_id !== deleteId));
        // setMatches(prev => prev.filter(item => item.school_id !== deleteId));
        // setTotal(prev => Math.max(prev - 1, 0));
        setMatches(prev => prev.filter(item => item.school_id !== deleteId));
        setTotal(prev => Math.max(prev - 1, 0));
        await fetchColleges(offset, true); // safer
      }
    } catch (err) {
      console.log('Error deleting school', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false); // Hide global loader
    }
  };

  

 const handleSlideCard = () => {
  Animated.timing(slideAnim, {
    toValue: -500,
    duration: 300,
    useNativeDriver: true,
  }).start(async () => {
    const isLastCard = currentIndex === matches.length - 1;

    if (isLastCard) {
      if (!noMoreData) {
        await fetchColleges(offset, true);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }

    slideAnim.setValue(500);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });
};



 

 const handleSearch = (text: string) => {
  setSearchText(text);

  if (!text.trim()) {
    setFilteredData([]);
    return;
  }

  const results = allSchools.filter(item =>
    item.name.toLowerCase().includes(text.toLowerCase())
  );
  setFilteredData(results);
};


const handleSelect = (item: SearchSchoolData) => {
  setSearchText(item.name);
  setFilteredData([]); // Hide dropdown
  console.log('Selected:', item.school_id);
};

 
  return (
  <View className="flex-1 bg-background px-4 pb-6">
  <View className="mt-14">
    <TitleText size="text-24">Explore</TitleText>
  </View>

  <Loader show={loading} />

  <View className="bg-white w-full flex-1 mt-4 rounded-[6]">
          <View className="flex-row items-center bg-gray-200 rounded-full mb-2 h-[45px] px-5">
          <Ionicons name="search" size={20} color="#888" className="mr-2" />
          <TextInput
           value={searchText}
          onChangeText={handleSearch}
            placeholder='Search schools...'
            placeholderTextColor="#888"
            className="flex-1 text-base text-gray-800"
          />
        </View>
{searchText.trim().length > 0 && filteredData.length > 0 && (
  <View
    className="absolute left-4 right-4 top-[50px] bg-white rounded-lg shadow-lg max-h-60 z-50"
    style={{ elevation: 10 }} // For Android shadow
  >
    <FlatList
      data={filteredData}
      keyExtractor={(item, index) => `${item}_${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleSelect(item)} className="p-3 border-b border-gray-100">
          <Text className="text-gray-800">{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
)}

      

      {matches.length > 0 && matches[currentIndex] && noMoreData == false  && (
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
          }}
        >
          <ExplorCards
            item={matches[currentIndex]}
            index={currentIndex}
            flippingCardId={flippingCardId}
            base_url_images={base_url_images}
            onSwipeLeft={() => deleteColleges(matches[currentIndex].school_id, "save")}
            onSwipeRight={() => deleteColleges(matches[currentIndex].school_id, "remove")}
            onSkipCard={handleSlideCard}
          />
        </Animated.View>
      )}

      {noMoreData === true && (
  <View className='flex-1 justify-center text-center items-center'> 
    <AppText>No more data available</AppText>
  </View>
)}

 
  

  </View>
</View>

  );
}
 

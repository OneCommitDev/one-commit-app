import React, { useEffect, useRef, useState } from 'react';
import {  View,  Text,  FlatList,  TouchableOpacity,  Image,  Alert,  ActivityIndicator,  Animated,  Easing,  Dimensions, InteractionManager, TextInput, Platform, UIManager, LayoutAnimation,
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
import NoDataAvailable from '~/components/NoDataAvailable';
import AnimatedCard from '~/components/AnimatedCard';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_HEIGHT = SCREEN_HEIGHT * 0.73;
 type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function ExplorSchools() {
 const [matches, setMatches] = useState<SchoolMatchItem[]>([]);
const [offset, setOffset] = useState(0);
const [limit] = useState(1);
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
const [isArchiveData, setIsArchiveData] = useState(false);


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
     if (res?.status && Array.isArray(res.data)) {
      setAllSchools(res.data);        
      setFilteredData(res.data);       
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
      setSearchText('');
      setIsArchiveData(false); // Not from archive

      if (append) setLoadingMore(true);
      else {
        setMatches([]);             
        setCurrentIndex(0);  
        setNoMoreData(false);       
        setLoading(true);
      }

      try {
        const accessToken = await getItem(PREF_KEYS.accessToken);
        const url = Api_Url.schoolsMatches(offsetToLoad, limit);
        const res = await httpRequest2<SchoolsMatches>(
          url,
          'post',
          {},
          accessToken ?? '',
          true
        );
   
         
        const newData = Array.isArray(res.data) ? res.data : [];

        if (newData.length === 0) {
          setNoMoreData(true);
          setMatches(prev => append ? [...prev, ...newData] : newData);
        //  Alert.alert('sdfsfs');
        fetchArchiveColleges(0);
          return;
        }

        setMatches(prev => append ? [...prev, ...newData] : newData);
        // setOffset(offsetToLoad + limit);
        setTotal(res.pagination.total ?? 0);

            setCurrentIndex(prev => {
              const updatedList = append ? [...matches, ...newData] : newData;
              return updatedList.length > 0 ? Math.min(prev, updatedList.length - 1) : 0;
            });

      } catch (err) {
        Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    };

    const fetchArchiveColleges = async (offsetToLoad = 0, append = false) => {
      setIsArchiveData(true); // This is from archive

              setSearchText('');
            if (append) setLoadingMore(true);
            else {
              setMatches([]);             
              setCurrentIndex(0);  
              setNoMoreData(false);       
              setLoading(true);
            }
            if (!append) {
            setMatches([]);
            setCurrentIndex(0);
            setNoMoreData(false);
            setLoading(true);
          }

      try {
        const accessToken = await getItem(PREF_KEYS.accessToken);
        const url = Api_Url.archiveschoolsMatches(offsetToLoad, limit);
        const res = await httpRequest2<SchoolsMatches>(
          url,
          'get',
          {},
          accessToken ?? '',
          true
        );

        const newData = Array.isArray(res.data) ? res.data : [];

        if (newData.length === 0) {
          setNoMoreData(true);
          setMatches(prev => append ? [...prev, ...newData] : newData);
          return;
        }

          setMatches(prev => append ? [...prev, ...newData] : newData);
          // setOffset(offsetToLoad + limit);
          setOffset(offsetToLoad);

            setCurrentIndex(prev => {
              const updatedList = append ? [...matches, ...newData] : newData;
              return updatedList.length > 0 ? Math.min(prev, updatedList.length - 1) : 0;
            });

        } catch (err) {
          Alert.alert('Error', 'Unexpected error occurred.');
        } finally {
          if (append) setLoadingMore(false);
          else setLoading(false);
        }
      };
 
 
 
      const deleteColleges = async (deleteId: string , type : string) => {
        try {
          setLoading(true);  
          const accessToken = await getItem(PREF_KEYS.accessToken);
          const url = Api_Url.schoolsMatchesDelete(deleteId , type);
          const res = await httpRequest2<SimpleResponse>(url, 'post', {}, accessToken ?? '', true);

          if (res.status) {
            setMatches(prev => prev.filter(item => item.school_id !== deleteId));
            setTotal(prev => Math.max(prev - 1, 0));
            await fetchColleges(offset, true); // safer
          }else{
          //  setMatches(prev => prev.filter(item => item.school_id !== deleteId));
          //  setTotal(prev => Math.max(prev - 1, 0));
            // await fetchColleges(offset, true); // safer
          }
        } catch (err) {
         // console.log('Error deleting school', err);
          Alert.alert('Error', 'Unexpected error occurred.');
        } finally {
          setLoading(false); // Hide global loader
        }
      };
 

      const deleteCollegesTemp = async (deleteId: string , type : string) => {
        try {
          setLoading(true);  

          const accessToken = await getItem(PREF_KEYS.accessToken);
          const url = Api_Url.schoolsMatchesDelete('123', type);
          const res = await httpRequest2<SimpleResponse>(url, 'post', {}, accessToken ?? '', true);

          if (res.status) {
            setMatches(prev => {
              const updated = prev.filter(item => item.school_id !== deleteId);
              // Adjust currentIndex if needed
              if (currentIndex >= updated.length && updated.length > 0) {
                setCurrentIndex(updated.length - 1);
              }
              return updated;
            });
            setTotal(prev => Math.max(prev - 1, 0));
          } else {
            setMatches(prev => prev.filter(item => item.school_id !== deleteId));
            setTotal(prev => Math.max(prev - 1, 0));
          }

          // Optional: fetch fresh data if needed
          await fetchColleges(offset, true);
        } catch (err) {
         // console.log('Error deleting school', err);
          Alert.alert('Error', 'Unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      };

  
/*
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
 
  await fetchColleges(offset, true);
    slideAnim.setValue(500);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });
};

*/

const handleSlideCard = () => {
  Animated.timing(slideAnim, {
    toValue: -500,
    duration: 300,
    useNativeDriver: true,
  }).start(async () => {
    const isLastCard = currentIndex === matches.length - 1;

    if (isLastCard) {
      if (!noMoreData) {
         setOffset(offset + limit);
        await fetchColleges(offset, true);
        // Increment index to show the newly loaded card
        setCurrentIndex(prev => prev + 1);
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
    if (item.school_id) {
    searchschoolByID(item.school_id); // 🔥 Call API with selected ID
  }
};

 const searchschoolByID = async (schoolId: string) => {
  setLoading(true);
  setNoMoreData(false);
  setMatches([]);             
  setCurrentIndex(0);

  try {
    const accessToken = await getItem(PREF_KEYS.accessToken);
    const url = Api_Url.searchSchoolByID;
    const res = await httpRequest2<SchoolsMatches>(
      url,      'post',      {school_id : schoolId},      accessToken ?? '',      true    );

    const resultData = Array.isArray(res.data) ? res.data : [];
    if (resultData.length === 0) {
      setNoMoreData(true);
      setMatches([]);
      return;
    }else{
      setMatches(resultData);
      setTotal(res.pagination?.total ?? resultData.length);
      setCurrentIndex(0);  
      
    }



  } catch (err) {
    Alert.alert('Error', 'Failed to fetch school by ID.');
  } finally {
    setLoading(false);
  }
};
  const scaleAnim = useRef(new Animated.Value(0)).current; // start at 0 (invisible)
 useEffect(() => {
    if (matches[currentIndex]) {
      scaleAnim.setValue(0); // reset before animation

      Animated.spring(scaleAnim, {
        toValue: 1,     // zoom to full size
        friction: 6,    // controls bounce
        tension: 50,    // controls speed
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex]);
  const [showSearch, setShowSearch] = useState(false);
  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const toggleSearch = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setShowSearch(!showSearch);
};
   return (
  <View className="flex-1 bg-background px-4 pb-6 pt-2">
 <View className="mt-14 flex-row items-center justify-between px-4">
  {!showSearch ? (
    <>
      <TitleText size="text-24">Explore</TitleText>
      <TouchableOpacity onPress={toggleSearch}>
        <Ionicons name="search" size={24} color="#333" />
      </TouchableOpacity>
    </>
  ) : (
    <View className="flex-row items-center bg-gray-200 rounded-full h-[45px] px-4 flex-1">
      <Ionicons name="search" size={20} color="#888" className="mr-2" />
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search schools..."
        placeholderTextColor="#888"
        className="flex-1 text-base text-gray-800"
        autoFocus
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={() => setSearchText("")}>
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={toggleSearch}>
        <Ionicons name="close" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  )}
</View>

 

  <Loader show={loading} />

  <View className="bg-white w-full flex-1 mt-4 rounded-[6]">
         {/* <View className="flex-row items-center bg-gray-200 rounded-full mb-2 h-[45px] px-5">
  <Ionicons name="search" size={20} color="#888" className="mr-2" />

  <TextInput
    value={searchText}
    onChangeText={handleSearch}
    placeholder="Search schools..."
    placeholderTextColor="#888"
    className="flex-1 text-base text-gray-800"
  />

  {searchText?.length > 0 && (
    <TouchableOpacity onPress={() => handleSearch("")}>
      <Ionicons name="close-circle" size={20} color="#888" />
    </TouchableOpacity>
  )}
</View> */}

{searchText.trim().length > 0 && filteredData.length > 0 && (
  <View
    className="absolute left-4 right-4 top-[0px] bg-white rounded-lg shadow-lg max-h-60 z-50"
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

        <AnimatedCard matches={matches} currentIndex={currentIndex}>

        <View>
            <ExplorCards
            key={`${matches[currentIndex]?.school_id}_${currentIndex}`}  
            item={matches[currentIndex]}
            index={currentIndex}
            flippingCardId={flippingCardId}
            base_url_images={base_url_images}
            onSwipeLeft={() => deleteColleges(matches[currentIndex].school_id, "save")}
            onSwipeRight={() => deleteColleges(matches[currentIndex].school_id, "remove")}
            onSkipCard={handleSlideCard}
          />
        </View>
        </AnimatedCard>

      {!loading && matches.length > 0 && matches[currentIndex] && noMoreData == false  && (
        <Animated.View
          style={{
            
            transform: [
              { scale: 0.2 }
            ],
          }}
        >

  {/* Show label only if data is from archive */}
    {isArchiveData && (
      <View className="mb-2">
        <TitleText>Archived Cards</TitleText>
      </View>
    )}



        </Animated.View>
      )}

      {noMoreData === true && (
        <View className='flex-1 justify-center text-center items-center'> 
          <NoDataAvailable
          title="No data available"
          subtitle=""
          onRetry={() => fetchColleges(0)}
          showRefresh={false}
          useLottie={true}
        />
        </View>
      )}
  </View>

</View>

  );
}
 

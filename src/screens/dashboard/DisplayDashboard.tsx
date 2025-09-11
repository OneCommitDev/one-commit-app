import { getItem } from 'expo-secure-store';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {  View,  Text,  FlatList,  Image,  TouchableOpacity,  Animated,  Easing,  Alert,} from 'react-native';
import AppText from '~/components/AppText';
import ArrowButton from '~/components/ArrowButton';
import Loader from '~/components/Loader';
import NoDataAvailable from '~/components/NoDataAvailable';
import SchoolCard from '~/components/SchoolCard';
import TitleText from '~/components/TitleText';
import WhiteCustomButton from '~/components/WhiteCustomButton';
import { SchoolMatchItem, SchoolsMatches } from '~/services/DataModals';
import { Api_Url, base_url_images, httpRequest2 } from '~/services/serviceRequest';
import { PREF_KEYS } from '~/utils/Prefs';
import OutreachSheet from '../multi_info_screens/OutreachSheet';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
  import { Ionicons } from '@expo/vector-icons';
import SuccessModal from '~/components/SuccessModal';

export default function DisplayDashboard() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
const [matches, setMatches] = useState<SchoolMatchItem[]>([]);
const [offset, setOffset] = useState(0);
const [limit] = useState(5);
const [total, setTotal] = useState(0);
const [loading, setLoading] = useState(false);
const [connectedEmail, setConnectedEmail] = useState(false);

const [loadingMore, setLoadingMore] = useState(false);
const [sheetVisible, setSheetVisible] = useState(false);
const [sheetData, setSheetData] = useState<{ schoolid: string }>({ schoolid: '' });
 const [showOutreach, setShowOutreach] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);

 const slideAnim = useRef(new Animated.Value(50)).current; // start 50px lower
const opacityAnim = useRef(new Animated.Value(0)).current; // start hidden
  const [screenload, setScreenload] = useState(false);

const runEnterAnimation = () => {
  Animated.parallel([
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }),
  ]).start();
};

  
    useEffect(() => {
      fetchColleges(0);
    }, []);
  
  
    const fetchColleges = async (offsetToLoad = 0, append = false) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);
  
        const accessToken = getItem(PREF_KEYS.accessToken);
        const url = Api_Url.dashboardschools(offsetToLoad, limit);
        const res = await httpRequest2<SchoolsMatches>(
          url,
          'get',
          {},
          accessToken ?? ''
        );
  
        if (res.status && res.data) {
          setConnectedEmail(res.email_conn_data.status);
          setMatches(prev => append ? [...prev, ...res.data] : res.data);
          setOffset(offsetToLoad + limit);
          setTotal(res.pagination.total);
          setScreenload(true);
            runEnterAnimation();

        }
      } catch (err) {
          Alert.alert('Error', 'Unexpected error occurred.');
      } finally {
         if (append) setLoadingMore(false);
        else setLoading(false);
      }
    };


/*
 const renderItem = ({ item, index }: { item: typeof data[0]; index: number }) => (
  <View className="bg-white rounded-[12px] p-4 mb-4 shadow shadow-black/10">
   
 <View className="flex-row justify-between items-start mb-3">
  <View className="flex-1 pr-2">
    <View className="flex-row items-start">
      <TitleText className=" mr-3 ">#{index + 1}</TitleText>
     <View className='flex-row justify-between'>
    <View className='flex-1'>
         <TitleText   numberOfLines={2}       className="flex-1 leading-tight" >
        {item.name}
      </TitleText>
      <Text>jhghghghjg</Text>
    </View>


 <View className='mr-8'>
        <Image
        source={{ uri: item.logo }}
        className="w-[48px] h-[48px] rounded-[8px]"
        resizeMode="contain"
      />
      </View>
     </View>
    </View>







     <View className="flex-row justify-between mt-1">
      <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
         <Text className='text-18 font-nunitoextrabold text-pretty'>79%</Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
                  Match Score
                  </Text>

      </View>
      <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
         <Text className='text-18 font-nunitoextrabold text-pretty'>79%</Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
          Coach Interest
          </Text>
      </View>

      <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
         <Text className='text-18 font-nunitoextrabold text-pretty'>79%</Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
          Progress
          </Text>
      </View>





  
  </View>


  </View>
</View>


 

 

    <WhiteCustomButton height={40}  fullWidth text={item.status} onPress={function (): void {
       
     } } />
    
  </View>
);

*/

 const renderSchoolItem = ({ item, index }: { item: SchoolMatchItem; index: number }) => {
      return (
        <View className="bg-white rounded-[12px] p-4 mb-4 shadow shadow-black/10">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-2">
          <View className="flex-row items-start">
            <TitleText className=" mr-3 ">#{index + 1}</TitleText>
          <View className='flex-row justify-between'>
          <View className='flex-1 mr-[3px]'>
              <TitleText   numberOfLines={2}       className="flex-1 leading-tight" >
              {item.name}
            </TitleText>
            {/* <Text>jhghghghjg</Text> */}
          </View>
      <View className='mr-8'>
              <Image
              source={{ uri: item.img_path }}
              className="w-[48px] h-[48px] rounded-[8px]"
              resizeMode="contain"
            />
            </View>
          </View>
          </View>
          <View className="flex-row justify-between mt-1">
            <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
              <Text className='text-18 font-nunitoextrabold text-pretty'>{item.match_criteria.match_score.match_score_percent}%</Text>
                      <Text className="text-12 text-black -mt-1 font-nunitoregular">
                        Match Score
                        </Text>

            </View>
            <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
              <Text className='text-18 font-nunitoextrabold text-pretty'>{item.coach_interest_percent}%</Text>
                      <Text className="text-12 text-black -mt-1 font-nunitoregular">
                Coach Interest
                </Text>
            </View>

            <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
              <Text className='text-18 font-nunitoextrabold text-pretty'>{item.overall_progress_percent}%</Text>
                      <Text className="text-12 text-black -mt-1 font-nunitoregular">
                Progress
                </Text>
            </View>
        </View>
        </View>
      </View>


      <View>
           <WhiteCustomButton
            height={40}
            fullWidth
            text={item.last_interaction_detail}
       onPress={() => {
  setSheetData({ schoolid: item.school_id ?? '' });

  const interactionDetail = item?.last_interaction_detail?.toLowerCase() ?? '';

  if (interactionDetail === 'start outreach') {
    if (!connectedEmail) {
      Alert.alert(
        'Your email account is not connected.',
        'Go to Profile Settings to link your email and start sending messages.'
      );
    } else {
      setSheetVisible(true);
    }
  } else {
  /*  navigation.navigate('EmailCommunication', {
      id: item.school_id,
      type: item.name,
    }); */
      setSheetVisible(true);
  }
}}

          />
      </View>  
 

{/*  
 <View className='flex-row justify-between'>
      <TouchableOpacity
        onPress={() => {
              navigation.navigate('EmailCommunication' ,   {id : item.school_id , type : 'details'});
            }}
      className='px-2 py-2 rounded-[20px] border border-gray-200 w-[48%] text-center justify-center items-center'>
        <Text className='font-nunitosemibold text-14'>View Detail</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
              if (
                item.last_interaction_detail &&
                item.last_interaction_detail.toLowerCase() === 'waiting for coach reply'
              ) {
                navigation.navigate('EmailCommunication' ,   {id : item.school_id , type : 'email'});
              } else {
                setSheetVisible(true);
              }
            }}
      className='px-2 py-2 rounded-[20px] border border-gray-200 w-[48%] text-center justify-center items-center'>
        <Text className='justify-center text-center'>{item.last_interaction_detail}</Text>
      </TouchableOpacity>

 </View> 
 */}





{/* 
  <View className='flex-row justify-end'>
      <TouchableOpacity
        onPress={() => {
              navigation.navigate('EmailCommunication' ,   {id : item.school_id , type : 'details'});
            }}
      className='rounded-[4px] border border-gray-200 w-[60px] h-[40px] text-center justify-center items-center mr-2 bg-white'>
    <Ionicons name="information-circle-outline" size={24} color="#235D48" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
              if (
                item.last_interaction_detail &&
                item.last_interaction_detail.toLowerCase() === 'waiting for coach reply'
              ) {
                navigation.navigate('EmailCommunication' ,   {id : item.school_id , type : 'email'});
              } else {
                setSheetVisible(true);
              }
            }}
      className='rounded-[4px] border border-gray-200 w-[60px] h-[40px] text-center justify-center items-center bg-white'>
      <Ionicons name="mail-unread-outline" size={24} color="blue" />

      </TouchableOpacity>

 </View>  
    */}


    
        </View>
    );
  };

 

  return (
    <View className="flex-1 bg-[#f5f5f5] pt-14 px-4">
            <Loader show={loading} />
      
      <TitleText size="text-24">Dashboard</TitleText>

      {!loading && connectedEmail === false && (
  <View className="bg-yellow-100 border border-yellow-50 rounded-lg p-4 flex-row items-center mb-1">
    <Ionicons name="warning-outline" size={24} color="#B45309" style={{ marginRight: 8 }} />
    
    <View style={{ flex: 1 }}>
      <TitleText className="text-yellow-800  -mt-3">
        Email account not connected
      </TitleText>
      <AppText className="text-yellow-700 text-sm -mt-[10px]">
        Connect your email to send and receive emails. Go to the profile settings and connect the email account
      </AppText>
    </View>
  </View>
)}
      {screenload ? (
   <> 

       <AppText className="mb-3">{matches.length} Active Schools</AppText>
    <Animated.View
    style={{
    flex: 1,
    opacity: opacityAnim,
    transform: [{ translateY: slideAnim }],
    }}
    >
    <FlatList
    data={matches}
    keyExtractor={(item, index) => `${item.school_id}_${index}`}
    renderItem={renderSchoolItem}
    pagingEnabled
    decelerationRate="fast"
    onEndReachedThreshold={0.8}
    onEndReached={() => {
      if (!loadingMore && matches.length < total && offset < total) {
        setLoadingMore(true);
        fetchColleges(offset, true);
      }
    }}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 0,
      paddingTop: 0,
    }}
    ListEmptyComponent={
      loading ? null : (
        <View style={{ height: 500, justifyContent: 'center', alignItems: 'center' }}>
            <View className='flex-1 justify-center text-center items-center'> 
                <NoDataAvailable
                title="No data available"
                subtitle=""
                onRetry={() => fetchColleges(0)}
                showRefresh={false}
                useLottie={true}
              />
            </View>
        </View>
      )
    }
    ListFooterComponent={
      loadingMore ? (
        <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
            source={require('assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 200, height: 100 }}
          />
        </View>
      ) : null
    }
    scrollEnabled={matches.length > 1}
    />
    </Animated.View>

 </>
) : (
       <View className="flex-1 items-center justify-center">
       {/* <LottieView
        source={require('../../../assets/animations/bot_loading.json')}
        autoPlay
        loop={true}
        style={{ width: 200, height: 200 }} 
      /> */}

      </View>
    )}



     <OutreachSheet
        isVisible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        schoolid={sheetData.schoolid}
        typeIs={''}
        onEmailSent={() => {
          setShowSuccess(true);
        }}
  />

          <SuccessModal
            isVisible={showSuccess}
            onClose={() => {
              setOffset(0);   // reset offset
              setShowSuccess(false);
              fetchColleges(0, false);
            }}
          />

          

    </View>
  );
}

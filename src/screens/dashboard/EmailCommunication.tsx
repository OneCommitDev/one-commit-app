import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import SimpleListSheet from '~/components/SimpleListSheet';
import Loader from '~/components/Loader';
import { getItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import {
  CommunicationHistory,
  Emaildatamodal,
  school_details,
} from '~/services/DataModals';
import OutreachSheet from '../multi_info_screens/OutreachSheet';
import EmailDetails from './EmilDetails';
import SuccessModal from '~/components/SuccessModal';
import NoDataAvailable from '~/components/NoDataAvailable';

type RootStackParamList = {
  EmailCommunication: { id: string; type: string };
};

type EmailRouteProp = RouteProp<RootStackParamList, 'EmailCommunication'>;

const EmailCommunication = () => {
  const navigation = useNavigation();
  const route = useRoute<EmailRouteProp>();
  const { id } = route.params;

  const [showSheet, setShowSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schooldetails, setschooldetails] = useState<school_details[]>([]);
  const [emails, setemails] = useState<CommunicationHistory[]>([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetData, setSheetData] = useState({ reply_type: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<CommunicationHistory | null>(null);
  const [sheetemilVisible, setemailSheetVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(100)).current; // start lower (off-screen)
const opacityAnim = useRef(new Animated.Value(0)).current; // hidden at start


  const handleBack = () => navigation.goBack();

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const accessToken = await getItem(PREF_KEYS.accessToken);
      const url = Api_Url.dashboardDetails(id);
      const res = await httpRequest2<Emaildatamodal>(
        url,
        'get',
        {},
        accessToken ?? ''
      );
      if (res.status && res.data) {
        setschooldetails(res.data.school_details);
        setemails(res.data.communication_history);
          Animated.parallel([
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,   // lower = more bouncy
      tension: 40,   // higher = faster snap
      useNativeDriver: true,
    }),
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }),
  ]).start();
      }
    } catch (err) {
       Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const coachDetails =
    schooldetails.length > 0 && schooldetails[0].school_coaches.length > 0
      ? [
          { key: 'Name', value: schooldetails[0].school_coaches[0].coach_name },
          { key: 'Email', value: schooldetails[0].school_coaches[0].coach_email },
          { key: 'Phone', value: schooldetails[0].school_coaches[0].coach_phone },
        ]
      : [];

  const emailHistory = emails.map((item) => ({
    date: item.email_sent_date,
    subject: item.email_subject,
    status: item.email_status,
    CommunicationHistory: item,
  }));

  const openEmailSheet = (email: CommunicationHistory) => {
    setSelectedEmailId(email);
    setemailSheetVisible(true);
  };

  const closeEmailSheet = () => {
    setemailSheetVisible(false);
    setSelectedEmailId(null);
  };

  return (
    <View className="flex-1 bg-background">
      <Loader show={loading} />
   {/* Header */}
        <View className="flex-row items-center justify-between px-3 pt-12 mb-4 mt-2">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 rounded-full bg-[#E3E9E5] items-center justify-center mr-2"
            >
              <Ionicons name="chevron-back" size={24} color="#1A322E" />
            </TouchableOpacity>
            <TitleText>
              {schooldetails?.[0]?.school_coaches?.[0]?.coach_name ?? ''}
            </TitleText>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center"
              onPress={() => setShowSheet(true)}
            >
              <Ionicons name="information-circle-outline" size={20} color="#1A322E" />
            </TouchableOpacity>
          </View>
        </View>
        <Animated.View
  style={{
    flex: 1,
    opacity: opacityAnim,
    transform: [{ translateY: slideAnim }],
  }}
>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
     

        {/* University Info */}
        {schooldetails.length > 0 && (
          <>
            <View className="px-4 mb-2 bg-white py-4 rounded-[10px] m-3">
              <View className="w-full flex-row justify-between">
                <View className='flex-1'>
                  <AppText className="-mt-2">{schooldetails[0].name}</AppText>
                  <AppText className="-mt-2">
                    {schooldetails[0].ncaa_division} • {schooldetails[0].city},{' '}
                    {schooldetails[0].state}
                  </AppText>
                </View>

                <View className='flex-1'>
                 <Pressable
                  onPress={() => {
                    setSheetData({
                      ...sheetData,
                      reply_type: schooldetails[0].last_interaction_detail ?? '',
                    });
                    setSheetVisible(true);
                  }}
                  className="px-2 py-2 bg-yellow-300 rounded-[10px] active:opacity-80"
                >
                  <AppText className="text-center font-semibold text-black">
                    {schooldetails[0].last_interaction_detail}
                  </AppText>
                </Pressable>
           </View>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row justify-between mt-1 px-3">
              <View className="bg-gray-100 rounded-md w-[33%] items-center h-16 justify-center">
                <Text className="text-18 font-nunitoextrabold">
                  {schooldetails[0].overall_match_percent}%
                </Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
                  Match Score
                </Text>
              </View>
              <View className="bg-gray-100 rounded-md w-[33%] items-center h-16 justify-center">
                <Text className="text-18 font-nunitoextrabold">
                  {schooldetails[0].coach_interest_percent}%
                </Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
                  Coach Interest
                </Text>
              </View>
              <View className="bg-gray-100 rounded-md w-[33%] items-center h-16 justify-center">
                <Text className="text-18 font-nunitoextrabold">
                  {schooldetails[0].overall_progress_percent}%
                </Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
                  Progress
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Communication History */}
        <View className="px-4 mt-6">
          <TitleText className="mb-2">Communication History</TitleText>
          <View className="rounded-xl bg-gray-50 border border-gray-200">
            <FlatList
              data={emailHistory}
              keyExtractor={(item, index) => `${item.subject}_${index}`}
              scrollEnabled={false} // important when inside ScrollView
              ItemSeparatorComponent={() => (
                <View className="h-[1px] bg-gray-200" />
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => openEmailSheet(item.CommunicationHistory)}
                  className="flex-row justify-between items-start px-4 py-3"
                >
                  <View className="flex-row items-center space-x-3 flex-1">
                    <Ionicons name="mail-open-outline" size={26} color="#1A322E" />
                    <View className="flex-1 ml-5">
                      <View className="flex-row justify-between items-center">
                        <Text
                          className="font-nunitosemibold flex-shrink mr-14"
                          numberOfLines={1}
                        >
                          {item.subject}
                        </Text>
                        <Text className="text-sm" numberOfLines={1}>
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                      <Text className="text-sm text-gray-500">
                        {item?.status || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                loading ? null : (
                  <View
                    style={{
                      height: 400,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <NoDataAvailable
                      title="No history available"
                      subtitle=""
                      showRefresh={false}
                      useLottie={true}
                    />
                  </View>
                )
              }
            />
          </View>
        </View>
      </ScrollView>
</Animated.View>
      {/* Sheets & Modals */}
      <SimpleListSheet
        visible={showSheet}
        title="Coach Details"
        data={coachDetails}
        onClose={() => setShowSheet(false)}
      />

      <OutreachSheet
        isVisible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        schoolid={id}
        typeIs={sheetData.reply_type}
        onEmailSent={() => setShowSuccess(true)}
      />

      <SuccessModal
        isVisible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          fetchColleges();
        }}
      />

      {selectedEmailId && (
        <EmailDetails
          isVisible={sheetemilVisible}
          onClose={closeEmailSheet}
          emaildata={selectedEmailId}
        />
      )}
    </View>
  );
};

export default EmailCommunication;

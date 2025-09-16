import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalComponent from 'react-native-modal';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import Loader from '~/components/Loader';
import { CommunicationHistory, Emaildetails, EmailOutreach } from '~/services/DataModals';
import { getItem } from 'expo-secure-store';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { PREF_KEYS } from '~/utils/Prefs';
import RenderHTML from 'react-native-render-html'; // ✅ HTML renderer
import LottieView from 'lottie-react-native';
import NoDataAvailable from '~/components/NoDataAvailable';

type EmailDetailsProps = {
  isVisible: boolean;
  onClose: () => void;
  emaildata: CommunicationHistory;
};

export default function EmailDetails({
  isVisible,
  onClose,
  emaildata,
}: EmailDetailsProps) {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [emailBody, setEmailBody] = useState<string>(''); // ✅ store HTML content

  useEffect(() => {
    if (isVisible) {
      EmilgetApiRequest();
    }
  }, [isVisible]);

  const EmilgetApiRequest = async () => {
    try {
      setLoading(true);

      console.log('emaildata ', emaildata);

      const accessToken = await getItem(PREF_KEYS.accessToken);

      const res = await httpRequest2<Emaildetails>(
        Api_Url.getEmialContent,
        'post',
        {
          message_id: emaildata.email_id,
          provider: emaildata.provider,
        },
        accessToken ?? ''
      );
console.log(res);
      if (res.status) {
        // ✅ store HTML string from API
         setEmailBody(res.data ?? '');
      } else {
        Alert.alert('Error', res.message ?? 'Something went wrong');
      }
    } catch (err) {
      console.log('Error fetching email content:', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const decodeHTML = (html: string) => {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};


  return (
    <ModalComponent
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      backdropOpacity={0.4}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="bg-white rounded-t-2xl p-4 h-[80%]"
      >
        {/* Top Handle */}
        <View className="items-center mb-3">
          <View
            style={{
              width: 40,
              height: 5,
              borderRadius: 3,
              backgroundColor: '#ccc',
            }}
          />
        </View>

        {/* Top Bar */}
        <View className="flex-row justify-between  mb-4">
          <View className='flex-1 mr-10'>
            <TitleText size="text-18">
               {decodeHTML(emaildata.email_subject ?? '')}
            {/* <Ionicons name="checkmark-circle" size={24} color="green" /> */}
            </TitleText>
        
          </View>
           <View className='mt-2'>
             <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="gray" />
          </TouchableOpacity>
           </View>
        </View>

{emailBody ? (
  <ScrollView
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
  >
    <RenderHTML contentWidth={width} source={{ html: emailBody }} />
  </ScrollView>
) : !loading ? (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <NoDataAvailable
                      title="No content available"
                      subtitle=""
                      showRefresh={false}
                      useLottie={true}
                    />
  </View>
) : null}

 
      </KeyboardAvoidingView>

      <Loader show={loading} />
    </ModalComponent>
  );
}

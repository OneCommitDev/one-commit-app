import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
  InteractionManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalComponent from 'react-native-modal';
import ArrowButton from '~/components/ArrowButton';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import SuccessModal from '~/components/SuccessModal';
import Loader from '~/components/Loader';
import { Api_Url, httpRequest2 } from '~/services/serviceRequest';
import { getItem } from 'expo-secure-store';
import { EmailOutreach, EmailOutreachCoachDetails, GamesResponse, SimpleResponse } from '~/services/DataModals';
import { PREF_KEYS } from '~/utils/Prefs';

type OutreachSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  schoolid?: string;
   typeIs?: string;
 onEmailSent?: () => void;  
};

export default function OutreachSheet({
  isVisible,
  onClose,
  schoolid = '',
  typeIs = '',
   onEmailSent,  
}: OutreachSheetProps) {
  const [form, setForm] = useState({
    subject: '',
    message_txt: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
const [showOutreach, setShowOutreach] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [shouldNotifySuccess, setShouldNotifySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
const [coachCount, setCoachCount] = useState<number>(0);
const [coachDetails, setCoachDetails] = useState<EmailOutreachCoachDetails[]>([]);

  // useEffect(() => {
  //   if (isVisible) {
  //     setForm({
  //       subject: initialSubject,
  //       message_txt: '',
  //     });
  //   }
  // }, [isVisible, initialSubject]);

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  useEffect(() => {
  // console.log('OutreachSheet isVisible =', isVisible);
}, [isVisible]);

useEffect(() => {
  if (isVisible) {
    EmilgetApiRequest();
  } else {
    setForm({ subject: '', message_txt: '' });
    setCoachCount(0);
  }
}, [isVisible]);


  const EmilgetApiRequest = async () => {
  try {
    setLoading(true);
    const urlis = Api_Url.getOutreachemail(schoolid);
    const accessToken = await getItem(PREF_KEYS.accessToken); // await required
    const res = await httpRequest2<EmailOutreach>(
     urlis,
      'get',
      {},
      accessToken ?? '',
    );
      setLoading(false);

    if (res.status && res.data) {
      setForm({
        subject: res.data.email_subject,
        message_txt: res.data.email_content.replace(/<br\s*\/?>/gi, '\n'), // Convert HTML to text
      });
      setCoachCount(res.data.coach_count);
        setCoachDetails(res.data.coach_details); // 👈 Save coach_details
    } else {
      Alert.alert('Error', res.message ?? 'Something went wrong');
    }
  } catch (err) {
    Alert.alert('Error', 'Unexpected error occurred.');
  } finally {
    setLoading(false);
  }
};


      const re_write_email = () => {
          RewriteApiRequest();
      }
 
          const RewriteApiRequest = async () => {
          try {
            setLoading(true);
            
            const accessToken = await getItem(PREF_KEYS.accessToken); // await required
            const res = await httpRequest2<EmailOutreach>(
              Api_Url.re_write_email,
              'post',
              {'email_content' : form.message_txt},
              accessToken ?? '',
              true
            );
              setLoading(false);

            if (res.status && res.data) {
                setForm(prev => ({
                  ...prev,
                  message_txt: '',
                }));
              

                     setTimeout(() => {
                        setForm(prev => ({
                        ...prev,
                        message_txt: res.data.email_content.replace(/<br\s*\/?>/gi, '\n'),
                      }));
                }, 300); 

              setCoachCount(res.data.coach_count);
              // console.log('sfsdf', res);
            } else {
              Alert.alert('Error', res.message ?? 'Something went wrong');
            }
          } catch (err) {
            Alert.alert('Error', 'Unexpected error occurred.');
          } finally {
            setLoading(false);
          }
      };


           const SendEmailApiRequest = async () => {
          try {
            setLoading(true);
               const payload = {
               coach_details: JSON.stringify(coachDetails),
                email_subject : form.subject,
                  email_content : form.message_txt
            };

            console.log('payload', Api_Url.send_email_outReach);
            
            const accessToken = await getItem(PREF_KEYS.accessToken);  
            const res = await httpRequest2<SimpleResponse>(
              Api_Url.send_email_outReach,
              'post',
              payload ,
              accessToken ?? '',
              true
            );
              setLoading(false);
              setShowOutreach(false);
              console.log('resresres' , res);
            if (res.status ) {

                InteractionManager.runAfterInteractions(() => {
                  setTimeout(() => {
                  setShouldNotifySuccess(true);  
                  onClose();  
                  }, 300); 
                });

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
      <ModalComponent
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={300}
      onModalHide={() => {
      if (shouldNotifySuccess) {
      onEmailSent?.();
      setShouldNotifySuccess(false); // reset internal flag
      }
      }}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      backdropOpacity={0.4}
      >

          
      <KeyboardAvoidingView
        className="bg-background"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          height: '90%',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
              <Loader show={loading} />
        
          {/* 👇 Handle View */}
  <View className="items-center mt-3 mb-3">
    <View style={{
      width: 60,
      height: 3,
      borderRadius: 999,
      backgroundColor: '#D1D5DB',
    }} />
  </View>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4 mt-4">
          <TitleText size='text-18'>
             {typeIs ? typeIs : 'Start Outreach'}
          </TitleText>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Form */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {/* Subject */}
          <AppText className="mb-1">Subject</AppText>
        <View className='border border-gray-300 py-4 px-4 rounded-3xl'>
            <TextInput
            value={form.subject}
            keyboardType="default"
              onChangeText={(text) => handleChange('subject', text)}
            placeholder=""
          />
        </View>

          {/* Message */}
          <AppText className="mb-1">Message</AppText>
        <View className='border border-gray-300 py-4 px-4 rounded-3xl h-[350]'>
            <TextInput
              value={form.message_txt}
              className="mb-10  h-[90%]"
              keyboardType="default"
              multiline
              numberOfLines={30}
              textAlignVertical="top"
              onChangeText={(text) => handleChange('message_txt', text)}
              placeholder=""
            />
            <View className="absolute bottom-3 right-3 flex-row items-center space-x-1">
              <Ionicons name="document-text-outline" size={14} color="gray" />
              <AppText className="text-xs text-gray-500">
                {form.message_txt.length}/2000
              </AppText>
            </View>
          </View>

    
          <View className="flex-row justify-between items-center mb-10 mt-6">
            <TouchableOpacity className="flex-row items-center space-x-1 bg-gray-200 px-4 py-2 rounded-full" onPress={() => re_write_email()}>
              <Ionicons name="sparkles" size={16} color="#10B981" />
              <AppText>Rewrite with AI</AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setForm({ subject: '', message_txt: '' })}>
              <AppText>Clear</AppText>
            </TouchableOpacity>

            <TouchableOpacity className="bg-gray-200 px-3 py-1.5 rounded-full">
              <AppText>{coachCount} Coach{coachCount === 1 ? '' : 'es'}</AppText>
            </TouchableOpacity>
          </View>
              <View className="mb-24">
         <ArrowButton
          text="Send Email"
          fullWidth
          onPress={() => {
            SendEmailApiRequest();
           
          }}
        />

        </View>
        </ScrollView>

        {/* Sticky Bottom Button */}
    
      </KeyboardAvoidingView>
    </ModalComponent>
  );
}
function setSheetVisible(arg0: boolean) {
  throw new Error('Function not implemented.');
}


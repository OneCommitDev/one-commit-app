import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalComponent from 'react-native-modal';
import ArrowButton from '~/components/ArrowButton';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';
import SuccessModal from '~/components/SuccessModal';

type OutreachSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  initialSubject?: string;
 onEmailSent?: () => void;  
};

export default function OutreachSheet({
  isVisible,
  onClose,
  initialSubject = '',
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

  // Sync form data when modal opens
  useEffect(() => {
    if (isVisible) {
      setForm({
        subject: initialSubject,
        message_txt: '',
      });
    }
  }, [isVisible, initialSubject]);

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

 

  return (
    
    // <ModalComponent
    //   isVisible={isVisible}
    //   onBackdropPress={onClose}
    //   style={{ justifyContent: 'flex-end', margin: 0 }}
    //   backdropOpacity={0.4}
    // >
    <ModalComponent
  isVisible={isVisible}
  onBackdropPress={onClose}
  onModalHide={() => {
    // ✅ Trigger only after modal closes
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
          <TitleText size='text-20'>Start Outreach</TitleText>
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
        <View className='border border-gray-300 py-4 px-4 rounded-3xl h-[400]'>
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
                {form.message_txt.length}/500
              </AppText>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between items-center mb-10 mt-6">
            <TouchableOpacity className="flex-row items-center space-x-1 bg-gray-200 px-4 py-2 rounded-full">
              <Ionicons name="sparkles" size={16} color="#10B981" />
              <AppText>Rewrite with AI</AppText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setForm({ subject: '', message_txt: '' })}>
              <AppText>Clear</AppText>
            </TouchableOpacity>

            <TouchableOpacity className="bg-gray-200 px-3 py-1.5 rounded-full">
              <AppText>5 Coaches</AppText>
            </TouchableOpacity>
          </View>
              <View className="mb-24">
         <ArrowButton
  text="Send Email"
  fullWidth
  onPress={() => {
    setShouldNotifySuccess(true);  
    onClose();  
  }}
/>

        </View>
        </ScrollView>

        {/* Sticky Bottom Button */}
    
      </KeyboardAvoidingView>
    </ModalComponent>
  );
}

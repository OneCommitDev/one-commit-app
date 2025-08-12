import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from './ArrowButton';
import WhiteCustomButton from './WhiteCustomButton';
import TitleText from './TitleText';
import AppText from './AppText';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function SuccessModal({ isVisible, onClose }: Props) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >

 


      <View className="bg-background rounded-t-2xl p-6 pt-4 items-center">

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
            <View className="flex-row justify-between items-center mb-6 w-full">
          <TitleText size="text-20" className="text-left">Compose Your Email</TitleText>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>



        <View className="bg-primary w-14 h-14 rounded-2xl justify-center items-center">
          <Ionicons name="checkmark" size={24} color="white" />
        </View>
        <TitleText size='text-20' className="mb-2">Email Sent Successfully!</TitleText>
        <AppText className="text-center mb-6 px-2 -mt-3">
          Your email to Coach Johnson at Stanford University has been sent.
        </AppText>

        {/* <View className="w-full mb-4 bg-gray-50 border border-border_color p-4 rounded-xl">
          <AppText className="text-center  mb-3">
            Would you like to set a reminder to follow up if you don't get a reply in 7 days?
          </AppText>
      

            <WhiteCustomButton
              text="Set Reminder"
              height={50}
              showArrowIcon={false}
              onPress={() => {
              }}
              fullWidth
            />


        </View> */}

          <View className='w-full'>
                  <ArrowButton
                text="Done"
                fullWidth
               onPress={onClose}
         />
          </View>
      </View>
    </Modal>
  );
}

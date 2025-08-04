import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import ArrowButton from '~/components/ArrowButton';
import Logo from '~/components/Logo';
import BotIllustration from '~/components/BotIllustration';

export default function AssistantScreen() {
  return (
     <View className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-6">
              <View className="flex-1 bg-background">
                {/* Top Logo and Intro Text */}
                <View className="items-center mt-10">
                  {/* <Image
                    source={require('assets/icon.png')}
                    className="h-20 w-20 rounded-2xl"
                  /> */}
                  <Logo size={70} />
                  <TitleText className="mt-2 text-center text-20">Introducing OneBot</TitleText>
                  <AppText className="-mt-2 text-center">
                    An AI recruiting assistant built and trained on your recruiting journey.
                  </AppText>
                </View>

                {/* Center Image */}
              <View className="flex-1 justify-center items-center mt-10 mb-10">
              {/* <Image
                source={require('assets/images/bot_Group.png')}
                className="w-[250px] h-[250px] object-contain"
                resizeMode="contain"
              /> */}
              <BotIllustration />
            </View>


                {/* Bottom Button */}
              <View className="mb-1 items-center mt-30">
                <ArrowButton
                  text="Get Started"
                  onPress={() => Alert.alert('Coming Soon')}
                  fullWidth
                />
          </View>

              </View>
          </ScrollView>
    </View>
  );
}

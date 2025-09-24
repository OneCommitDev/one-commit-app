import React from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import AppText from './AppText';
import TitleText from './TitleText';

type AppWebviewRouteProp = RouteProp<RootStackParamList, 'AppWebview'>;

export default function AppWebview() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<AppWebviewRouteProp>();
  const { url, title } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  // Determine local HTML file (works for both iOS & Android)
  let localFile: any;
  if (title === 'Privacy Policy') {
    localFile = require('../../assets/html/privacy.html');
  } else if (title === 'Terms of Service') {
    localFile = require('../../assets/html/terms.html');
  }

  // Handle mailto links and prevent WebView from opening them
  const handleNavigation = (event: any) => {
    if (event.url.startsWith('mailto:')) {
      Linking.openURL(event.url).catch(err => console.error('Error opening email:', err));
      return false; // prevent WebView from trying to load the mailto link
    }
    return true;
  };

  return (
    // <View className="flex-1 bg-background">
      <View
                  className={`flex-1 bg-background px-4  ${
                    Platform.OS === "ios" ? "pt-14" : "pt-1"
                  }`}
                >
      {/* Header */}
      <View className="flex-row  items-center">
        <TouchableOpacity
          onPress={handleBack}
          className="w-12 h-12 rounded-full bg-[#E3E9E5] items-center justify-center ml-2"
        >
          <Ionicons name="chevron-back" size={24} color="#1A322E" />
        </TouchableOpacity>

        <View className="flex-1 justify-center ml-3">
          <TitleText>{title}</TitleText>
        </View>
      </View>

      {/* WebView */}
      <View className="flex-1 mt-4">
        {localFile ? (
          <WebView
            originWhitelist={['*']}
            source={localFile}
            onShouldStartLoadWithRequest={handleNavigation} // iOS
            onNavigationStateChange={handleNavigation}      // Android
          />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ uri: url }}
            onShouldStartLoadWithRequest={handleNavigation}
            onNavigationStateChange={handleNavigation}
          />
        )}
      </View>
    </View>
  );
}

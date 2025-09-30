import React, { useEffect, useState } from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import TitleText from './TitleText';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

type AppWebviewRouteProp = RouteProp<RootStackParamList, 'AppWebview'>;

export default function AppWebview() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<AppWebviewRouteProp>();
  const { url, title } = route.params;

  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  const handleBack = () => navigation.goBack();

  // Handle mailto links
  const handleNavigation = (event: any) => {
    if (event.url.startsWith('mailto:')) {
      Linking.openURL(event.url).catch(err => console.error('Error opening email:', err));
      return false;
    }
    return true;
  };

  // Load local HTML using expo-file-system
  useEffect(() => {
    const loadHtml = async () => {
      let localAsset;
      if (title === 'Privacy Policy') {
        localAsset = require('../../assets/html/privacy.html');
      } else if (title === 'Terms of Service') {
        localAsset = require('../../assets/html/terms.html');
      }

      if (localAsset) {
        const asset = Asset.fromModule(localAsset);
        await asset.downloadAsync(); // ensure it's available
        const content = await FileSystem.readAsStringAsync(asset.localUri!);
        setHtmlContent(content);
      }
    };

    loadHtml();
  }, [title]);

  return (
    <View className={`flex-1 bg-background px-4 ${Platform.OS === 'ios' ? 'pt-14' : 'pt-1'}`}>
      {/* Header */}
      <View className="flex-row items-center">
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
        {htmlContent ? (
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            onShouldStartLoadWithRequest={handleNavigation} // iOS
            onNavigationStateChange={handleNavigation}      // Android
          />
        ) : url ? (
          <WebView
            originWhitelist={['*']}
            source={{ uri: url }}
            onShouldStartLoadWithRequest={handleNavigation}
            onNavigationStateChange={handleNavigation}
          />
        ) : null}
      </View>
    </View>
  );
}

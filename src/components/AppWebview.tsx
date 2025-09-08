import React from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import AppText from './AppText';
import TitleText from './TitleText';

type AppWebviewRouteProp = RouteProp<RootStackParamList, 'AppWebview'>;


export default function AppWebview() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<AppWebviewRouteProp>();
  const { url , title} = route.params;

    const handleBack = () => {
       navigation.goBack();
    };

    let localFile;
    if (title === 'Privacy Policy') {
      localFile = Platform.OS === 'ios'
        ? require('../../assets/html/privacy.html') // adjust relative to AppWebview.tsx
        : { uri: 'file:///android_asset/html/privacy.html' };
    } else if (title === 'Terms of Service') {
      localFile = Platform.OS === 'ios'
        ? require('../../assets/html/terms.html')
        : { uri: 'file:///android_asset/html/terms.html' };
    }

     const handleNavigation = (event: any) => {
    if (event.url.startsWith('mailto:')) {
      Linking.openURL(event.url).catch(err => console.error('Error opening email:', err));
      return false; // prevent WebView from trying to load the mailto link
    }
    return true;
  };


  return (
<View className='flex-1 bg-background'>
      <View className="flex-row mt-14">
          <TouchableOpacity
            onPress={handleBack}
            className="w-12 h-12 rounded-full bg-[#E3E9E5] items-center justify-center ml-2"
          >
            <Ionicons name="chevron-back" size={24} color="#1A322E" />
          </TouchableOpacity>
  
          <View className="flex-1 justify-center ml-3">
               {/* <TitleText>{title}</TitleText> */}
  
           </View>
        </View>
         <View className='flex-1 mt-4'>
             {/* <WebView source={{ uri: url }} /> */}
               {localFile && (
          <WebView
           onShouldStartLoadWithRequest={handleNavigation} // iOS
      onNavigationStateChange={handleNavigation}      // Android
            originWhitelist={['*']}
            source={localFile}
          />
        )}
         </View>

</View>
  );
}

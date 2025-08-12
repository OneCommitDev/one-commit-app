//  import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import React, { useEffect } from 'react';

// type RootStackParamList = {
//   Splash: undefined;
//   Intro: undefined;
// };

// type SplashScreenProps = {
//   navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
// };

// export default function SplashScreen({ navigation }: SplashScreenProps) {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('Intro');
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.center}>
//         {/* <Image
//           source={{
//             uri: 'https://img.freepik.com/free-vector/people-silhouette-logo_361591-2448.jpg?semt=ais_hybrid&w=740',
//           }}
//           style={styles.logo}
//           resizeMode="contain"
//         /> */}
//          <View className="items-center mb-6">
//                       <View className="bg-[#185844] w-32 h-32 rounded-3xl items-center justify-center">
//                       </View>
//                     </View>
//       </View>
//       <View style={styles.bottom}>
//         <Text style={styles.title}>OneCommit</Text>
//         <Text style={styles.subtitle}>One tool, One decision, One future</Text>
//       </View>
//     </View>
//   );
// }



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1D4C38',
//     justifyContent: 'space-between',
//     paddingVertical: 40,
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bottom: {
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: 'white',
//   },
//   logo: {
//     width: 140,
//     height: 140,
//     marginBottom: 20,
//     borderRadius: 12,
//   },
// });


import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, Image, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import Logo from '~/components/Logo';
import { getItem } from 'expo-secure-store';
import { PREF_KEYS } from '~/utils/Prefs';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import { removeItem } from '~/utils/storage';

 

// type SplashScreenProps = {
//     navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
//     OtpVerification: { method: 'email' | 'mobile' , value : string , typeis : string };
// };


// export default function SplashScreen({ navigation }: SplashScreenProps) {
    // const navigations = useNavigation<NavigationProp<RootStackParamList>>();
    // const route = useRoute<RouteProp<RootStackParamList, 'OtpVerification'>>();
    export default function Splashscreen() {

      const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

 useEffect(() => {
  const checkAndNavigate = async () => {
    const token = await getItem(PREF_KEYS.accessToken);
    const register_redirect = await getItem(PREF_KEYS.register_redirect);
    const login_status = await getItem(PREF_KEYS.login_status);
    const profileCompleted = await getItem(PREF_KEYS.profileCompleted);

    

     setTimeout(() => {
       if ( profileCompleted === 'success') {
        //  navigation.replace('UserProfile' , {src : ''});
         navigation.replace('Dashboard');
      }
     else  if (login_status === 'success' ) {
        navigation.replace('UserProfile' , {src : ''});
      } 
          
      else {
        navigation.replace('Intro');
        //  navigation.replace('CollegePreferences');
      }
    }, 3000);
  };

  checkAndNavigate();
}, []);


  return (
    <View className="flex-1 bg-primary justify-between py-10">

      <View className="flex-1 justify-center items-center">
        {/* Uncomment this block to use image instead of colored box */}
        {/* <Image
          source={{
            uri: 'https://img.freepik.com/free-vector/people-silhouette-logo_361591-2448.jpg?semt=ais_hybrid&w=740',
          }}
          className="w-36 h-36 rounded-xl mb-5"
          resizeMode="contain"
        /> */}
        <View className="items-center mb-6">
        <View className="mt-img-lg">
          <Logo size={110} />
        </View>
        </View>
      </View>

      <View className="items-center mb-30">
        <Text className="text-white text-splashtitle font-nunitoextrabold mb-4">OneCommit</Text>
<Text className="text-white text-splashSubTitle font-nunitoregular text-center">
  One tool, One decision, One future
</Text>
      </View>
    </View>
  );
}

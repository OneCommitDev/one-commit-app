import * as dotenv from "dotenv";
import fs from "fs";



export default ({ config }) => ({
  
  ...config,
  // "scripts": {
  //   "build:android": "eas build --platform android --profile production",
  //   "build:ios": "eas build --platform ios --profile production"
  //   },
  //   "expo": {
  //   "jsEngine": "hermes"
  // },
   extra: {
    appEnv: process.env.EXPO_PUBLIC_APP_ENV,
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    baseImgUrl: process.env.EXPO_PUBLIC_BASE_IMG_URL,
    xKey: process.env.EXPO_PUBLIC_X_KEY,

    fcm_apiKey : 'AIzaSyDvPcP77wTfw2DjaiLcz9lra7HP7rGsqVI',
    fcm_authDomain : 'onecommit.firebaseapp.com',
    fcm_projectId : 'onecommit',
    fcm_storageBucket : 'onecommit.firebasestorage.app',
    fcm_messagingSenderId : '429115153068',
    fcm_appId : '1:429115153068:web:bf3ddb7b230dce9844dd09',
    fcm_measurementId : 'G-6PFWFC5JHC',

    // microssoft clinet ID
    microsoft_clinetid : 'ae251711-526a-487f-9274-d067ca936041',
    google_web_clientid : '156935841607-s3q4q01qhosr3bviecpnuratotulsutm.apps.googleusercontent.com',
    google_ios_clientid : '156935841607-6qjtusg96ddbk3u0n87l7irgh1u3mi31.apps.googleusercontent.com',
    },
  name: 'OneCommit',
  slug: 'OneCommit',
  scheme: "us.onecommit.app",
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  experiments: {
    tsconfigPaths: true,
  },
  assetBundlePatterns: ['**/*'],
 plugins: [
  './withHermesDsyms.js',
   '@react-native-firebase/app',
    '@react-native-firebase/messaging',
     // 🧱 Set useFrameworks for Swift pods like Firebase
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static', // Required for Firebase
          deploymentTarget: '15.1', // Ensure compatibility
        },
         android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,  
        },
      },
    ],
  'expo-web-browser',
  'expo-build-properties',
  [
    '@react-native-google-signin/google-signin',
    {
      iosUrlScheme: 'com.googleusercontent.apps.156935841607-6qjtusg96ddbk3u0n87l7irgh1u3mi31'
    }
  ]
],

  ios: {
    userInterfaceStyle: "light",
    supportsTablet: true,
    usesAppleSignIn: true,
    googleServicesFile: './fcm/GoogleService-Info.plist',
    bundleIdentifier: 'us.onecommit.app',
     entitlements: {
      'aps-environment': 'production', // or 'production' for production builds if foe use 'development' for development
      "com.apple.developer.applesignin": ["Default"],
    },
    infoPlist: {
     NSUserTrackingUsageDescription: 'This identifier will be used to deliver personalized ads to you.',
      NSAppTransportSecurity: {
      NSAllowsArbitraryLoads: false,
    //   NSExceptionDomains: {
    //   'ec2-18-218-15-226.us-east-2.compute.amazonaws.com': {
    //     NSExceptionAllowsInsecureHTTPLoads: true,
    //     NSIncludesSubdomains: true,
    //   },
    // },
    },
        NSPushNotificationUsageDescription: 'This app uses notifications to keep you updated.',
        UIBackgroundModes: ['fetch', 'remote-notification'],
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            'OneCommit',
            'us.onecommit.app',
            'com.googleusercontent.apps.156935841607-6qjtusg96ddbk3u0n87l7irgh1u3mi31',
          ],
        },
      ],
      LSApplicationQueriesSchemes: [
        'google',
        'com-google-gidconsent',
        'com.googleusercontent.apps.156935841607-6qjtusg96ddbk3u0n87l7irgh1u3mi31',
      ],
    },
  },
  android: {
        googleServicesFile: './fcm/google-services.json',
        permissions: [
             'NOTIFICATIONS', 'POST_NOTIFICATIONS',
    ],
     allowBackup: false,
    package: 'us.onecommit.app',
     "userInterfaceStyle": "light",
    usesCleartextTraffic: true,
      manifestPlaceholders: {
       appAuthRedirectScheme: "us.onecommit.app",
    },
    adaptiveIcon: {
       foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F54927',
    },
    intentFilters: [
      {
        action: 'VIEW',
        data: [
          {
            scheme: 'us.onecommit.app',
            host: 'redirect',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
   statusBar: {
    backgroundColor: '#235D48', // 💡 Use your primary color
    barStyle: 'light-content'   // or 'dark-content'
  },
  navigationBar: {
    backgroundColor: '#007BFF',
    barStyle: 'light-content'
  },
    jsEngine: "hermes", 
});

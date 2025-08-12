

export default ({ config }) => ({
  ...config,
  name: 'OneCommit',
  slug: 'OneCommit',
  scheme: "com.onecommit.app",
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
    bundleIdentifier: 'com.onecommit.app',
     entitlements: {
      'aps-environment': 'development', // or 'production' for production builds
    },
    infoPlist: {
     NSUserTrackingUsageDescription: 'This identifier will be used to deliver personalized ads to you.',
      NSAppTransportSecurity: {
      NSAllowsArbitraryLoads: true,
      NSExceptionDomains: {
      'ec2-18-218-15-226.us-east-2.compute.amazonaws.com': {
        NSExceptionAllowsInsecureHTTPLoads: true,
        NSIncludesSubdomains: true,
      },
    },
    },
        NSPushNotificationUsageDescription: 'This app uses notifications to keep you updated.',
        UIBackgroundModes: ['fetch', 'remote-notification'],
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            'OneCommit',
            'com.onecommit.app',
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
             'NOTIFICATIONS', 
    ],
    package: 'com.onecommit.app',
     "userInterfaceStyle": "light",
    usesCleartextTraffic: true,
      manifestPlaceholders: {
      appAuthRedirectScheme: "com.onecommit.app",
    },
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    intentFilters: [
      {
        action: 'VIEW',
        data: [
          {
            scheme: 'OneCommit',
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
  }
});

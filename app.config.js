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
    bundleIdentifier: 'com.onecommit.app',
    infoPlist: {
      NSAppTransportSecurity: {
      NSAllowsArbitraryLoads: true,
      NSExceptionDomains: {
      'ec2-18-218-15-226.us-east-2.compute.amazonaws.com': {
        NSExceptionAllowsInsecureHTTPLoads: true,
        NSIncludesSubdomains: true,
      },
    },
    },
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

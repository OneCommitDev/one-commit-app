const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

config.resolver.extraNodeModules = {
  '~': path.resolve(__dirname, 'src'),
  'assets': path.resolve(__dirname, 'assets'), // 👈 for image requires
};

config.watchFolders = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, 'assets'),
];

module.exports = withNativeWind(config, { input: './global.css' });
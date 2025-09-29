# 📱 OneCommit App

A **React Native** app built using **Expo Framework** and styled with **NativeWind** (Tailwind CSS for React Native).
https://www.nativewind.dev/docs/getting-started/installation
---

## 🚀 Getting Started

### 🧱 Project Setup

Make sure you have React Native, Node and Expo CLI installed:

```bash
npm install -g expo-cli
npx expo install
npx expo prebuild or npx expo prebuild --no-clean
npx expo run:android or npx expo run:ios

For Android use this cmd to craete keystore file for debug and production
keystore craete : keytool -keystore ./android/app/debug.keystore -list -v

keytool -list -v \
-keystore android/app/onecommit.keystore \
-alias key0 \
-storepass onecommit \
-keypass onecommit
or
sudo keytool -genkey -v -keystore onecommit.keystore -alias key0 -keyalg RSA -keysize 2048 -validity 10000 (Recmondad)

For restart the android device
adb kill-server
adb start-server

For iOS native build, follow this process :
npx expo prebuild
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file node_modules/expo/AppEntry.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios


For Android production native build, follow this process :
npx expo prebuild --platform android --clean 

npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file node_modules/expo/AppEntry.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest android

cd android
./gradlew assembleRelease
Production build path :   onecommitapp/android/app/build/outputs/apk-release
install teh prod app on device : adb install app/build/outputs/apk/release/app-release.apk


Clean both ios and android folder
npx expo prebuild --clean


If face some errors due to the new os updates, then try with tese cmd
// start
cd ios
xcodebuild clean
cd ..
npx pod-install
// end


/// start
cd ios
rm -rf Pods Podfile.lock
pod install
arch -x86_64 pod install
cd ..
npx expo run:ios
// end

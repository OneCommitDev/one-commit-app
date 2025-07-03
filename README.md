# 📱 OneCommit App

A **React Native** app built using **Expo** and styled with **NativeWind** (Tailwind CSS for React Native).
https://www.nativewind.dev/docs/getting-started/installation
---

## 🚀 Getting Started

### 🧱 Project Setup

Make sure you have Expo CLI installed:

```bash
npm install -g expo-cli
npx expo prebuild or npx expo prebuild --no-clean
npx expo run:android or npx expo run:ios
# or with cache clear
npx expo start -c

keystore craete : keytool -keystore ./android/app/debug.keystore -list -v

For restart the android device
adb kill-server
adb start-server

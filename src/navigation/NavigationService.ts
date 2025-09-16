import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types'; // wherever you define it

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const resetToLogin = () => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: "Intro" }],
    });
  }
};

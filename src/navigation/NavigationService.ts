// src/navigation/NavigationService.ts
import { CommonActions, createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./types";

// Create a global ref
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Reset navigation to login
export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }], 
      })
    );
  } else {
    console.warn("Navigation not ready yet (resetToLogin)");
  }
}

// Generic navigate helper
export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Login');
  } else {
    console.warn("Navigation not ready yet (navigate)", name);
  }
}

// services/authService.ts
import { getItem, setItem } from "expo-secure-store";
import { decodeAccessToken, isTokenExpiringSoon } from "~/utils/jwt";
import Constants from "expo-constants";
import { resetToLogin } from "~/navigation/NavigationService";
import { clearAllPrefss } from "~/utils/storage";
import { PREF_KEYS } from "~/utils/Prefs";
import { Alert, Platform } from "react-native";
const {  appEnv , xKey , baseImgUrl} = Constants.expoConfig?.extra ?? {};
import * as Application from "expo-application";

const { apiUrl } = Constants.expoConfig?.extra ?? {};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getItem(PREF_KEYS.refreshToken);
    const email = await getItem(PREF_KEYS.userEmailID);

    if (!refreshToken || !email) return null;

     // const url = `${apiUrl.replace(/\/+$/, "")}/token`;
    const url = `https://devapi.onecommit.us:443/v1/token`;

     let deviceId;
      if (Platform.OS === "android") {
        deviceId = Application.getAndroidId();
      } else {
        deviceId = await Application.getIosIdForVendorAsync();
      }

         


    const res = await fetch(url, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`, // or accessToken if required
      "x-api-key": xKey,
      "app-device-id": deviceId ?? '',
    },
      body: JSON.stringify({ email }),
    });
     const result = await res.json();
   
    if (result?.success && result.data?.accessToken) {
      await setItem(PREF_KEYS.accessToken, result.data.accessToken);
      await setItem(PREF_KEYS.refreshToken, result.data.refreshToken);
      return result.data.accessToken;
    } else {
                Alert.alert(
                  "Session Expired",
                  "Please log in again.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                           clearAllPrefss();
                          resetToLogin();
                      },
                    },
                  ],
                  { cancelable: false }
                );
     // await clearAllPrefss();
      // resetToLogin();
    }

    // if (!res.ok) {
    //   console.error("HTTP error", res, res.statusText);
    //   return null;
    // }


    return null;
  } catch (error: any) {
     console.error("Request failed", {
      message: error.message,
      stack: error.stack,
    });
    return null;
  }
};

export const getValidAccessToken = async (): Promise<string | null> => {
  let accessToken = await getItem(PREF_KEYS.accessToken);
  if (accessToken && isTokenExpiringSoon(accessToken)) {
    accessToken = await refreshAccessToken();
  }
  return accessToken;
};

export const saveDetailsAfterLogin = async () => {
  const accessToken = await getItem(PREF_KEYS.accessToken);
  const payload = decodeAccessToken(accessToken ?? "");
  if (payload && payload.email) {
    await setItem(PREF_KEYS.userEmailID, payload.email);
    await setItem(PREF_KEYS.userId, String(payload.id));
  }
};

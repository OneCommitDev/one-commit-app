// services/authService.ts
import { getItem, setItem } from "expo-secure-store";
import { decodeAccessToken, isTokenExpiringSoon } from "~/utils/jwt";
import Constants from "expo-constants";
import { resetToLogin } from "~/navigation/NavigationService";
import { clearAllPrefss } from "~/utils/storage";
import { PREF_KEYS } from "~/utils/Prefs";

const { apiUrl } = Constants.expoConfig?.extra ?? {};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getItem(PREF_KEYS.refreshToken);
    const email = await getItem(PREF_KEYS.userEmailID);

    if (!refreshToken || !email) return null;

    const url = `${apiUrl.replace(/\/+$/, "")}/refresh-token`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (result?.success && result.data?.accessToken) {
      await setItem(PREF_KEYS.accessToken, result.data.accessToken);
      await setItem(PREF_KEYS.refreshToken, result.data.refreshToken);
      return result.data.accessToken;
    } else {
      await clearAllPrefss();
      resetToLogin();
    }

    return null;
  } catch {
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

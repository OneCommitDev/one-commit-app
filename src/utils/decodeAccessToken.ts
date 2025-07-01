import { getItem, setItem } from "expo-secure-store";
import { PREF_KEYS } from "./Prefs";
import { Api_Url, base_url, httpRequest2, TokenRequest } from "~/services/serviceRequest";
import { Applog, Applogerror } from "./logger";
import { LoginResponse, TokenResponse } from "~/services/DataModals";

export const decodeAccessToken = (token: string) => {
  try {
    const [, payloadBase64] = token.split('.');

    if (!payloadBase64) return null;

    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    Applogerror('Failed to decode access token:', error)
    return null;
  }
};

export const isTokenExpiringSoon = (token: string, bufferSeconds = 120): boolean => {
  const decoded = decodeAccessToken(token);
  if (!decoded?.exp) return true;

  const expiry = decoded.exp * 1000; // convert to ms
  const now = Date.now();
  return expiry - now < bufferSeconds * 1000;
};

 


 export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getItem(PREF_KEYS.refreshToken);
    const email = await getItem(PREF_KEYS.userEmailID);
        // const email = 'Pardeep.Kumar@agilite.tech';


    if (!refreshToken || !email) return null;

    const url = `${base_url.replace(/\/+$/, '')}/${Api_Url.refreshToken.replace(/^\/+/, '')}`;
    console.log("Refresh URL:", url);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`, // 👈 Bearer token
      },
      body: JSON.stringify({ email }), // 👈 email in body
    });

    const result = await res.json();

    if (result?.success && result.data?.accessToken) {
      await setItem(PREF_KEYS.accessToken, result.data.accessToken);
      await setItem(PREF_KEYS.refreshToken, result.data.refreshToken);
      return result.data.accessToken;
    }

    return null;
  } catch (error) {
    console.error("Silent token refresh failed:", error);
    return null;
  }
};






export const getValidAccessToken = async (): Promise<string | null> => {
  let accessToken = await getItem(PREF_KEYS.accessToken);
  if (isTokenExpiringSoon(accessToken!)) {
     accessToken = await refreshAccessToken();
        Applog("Access token expired or about to expire. Refreshing...");
  }
  return accessToken;
};

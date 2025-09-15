// src/auth/socialAuth.ts
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform } from 'react-native';
import {  APP_CONFIG_MICROSOFT } from './constants';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession(); // Required for auth flows

// ---------------------------
// 🍎 Apple Login
// ---------------------------
export const handleAppleLogin = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    return {
      user: credential.user,
      email: credential.email,
      fullName: credential.fullName,
      identityToken: credential.identityToken,
    };
  } catch (e: any) {
    if (e.code === 'ERR_CANCELED') {
      Alert.alert('Cancelled', 'User canceled the sign-in.');
    } else {
      Alert.alert('Error', JSON.stringify(e));
    }
    return null;
  }
};


 
 



// ---------------------------
// 💼 Microsoft Login
// ---------------------------
export const useMicrosoftLogin = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: APP_CONFIG_MICROSOFT.CLIENT_ID,
      redirectUri: APP_CONFIG_MICROSOFT.REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      // scopes: ['openid', 'profile', 'email', 'offline_access'],
       scopes: [
        'openid',
        'profile',
        'email',
        'offline_access',
      ],
      usePKCE: false,
    },
    {
      authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    }
  );

  // console.log('request' , request);

// console.log(AuthSession.makeRedirectUri({
//   scheme: 'us.onecommit.app',
//   path: 'oauthredirect',
// }));



  const handleResponse = async () => {
    if (response?.type === 'success') {
      const { code } = response.params;
  // console.log('codecodecodecodecode' , response);

     // exchangeMicrosoftCode(code);
      return { code };
    }
    return null;
  };

  return { request, response, promptAsync, handleResponse };
};

const exchangeMicrosoftCode = async (code: string) => {
  const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: APP_CONFIG_MICROSOFT.CLIENT_ID,
      scope: 'openid profile email offline_access',
      code,
      redirect_uri: APP_CONFIG_MICROSOFT.REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString(),
  });

  const data = await response.json();
 // console.log('Microsoft Token Response:', data);
};





 
const DEFAULT_SCOPES = [
  'openid',
  'profile',
  'email',
  'offline_access',
];

export const useMicrosoftEmailConnect = (extraScopes: string[] = []) => {
  const combinedScopes = [...new Set([...DEFAULT_SCOPES, ...extraScopes])];

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: APP_CONFIG_MICROSOFT.CLIENT_ID,
      redirectUri: APP_CONFIG_MICROSOFT.REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      scopes: combinedScopes,
      usePKCE: false,
    },
    {
      authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    }
  );

  // console.log('Redirect URI:', AuthSession.makeRedirectUri({
  //   scheme: 'us.onecommit.app',
  //   path: 'oauthredirect',
  // }));

  const handleResponse = async () => {
    if (response?.type === 'success') {
      const { code } = response.params;
      return { code };
    }
    return null;
  };

  return { request, response, promptAsync, handleResponse };
};







 
 WebBrowser.maybeCompleteAuthSession();

const APPLE_CLIENT_ID = "5H5G7LRTHJ";
const REDIRECT_URI = AuthSession.makeRedirectUri({
  path: "auth/callback",
});

export const useAppleLogin = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: APPLE_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      responseType: "code id_token",
      scopes: ["name", "email"],
    },
    { authorizationEndpoint: "https://appleid.apple.com/auth/authorize" }
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code, id_token, email } = response.params;
      Alert.alert("Apple Login Success", `Email: ${email ?? "N/A"}`);
      // 👉 Send code or id_token to your backend for verification
    } else if (response?.type === "error") {
      Alert.alert("Error", "Apple Sign-In failed");
    }
  }, [response]);

  // Call this from your button click
  const signIn = async () => {
    if (Platform.OS === "ios") {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        Alert.alert("Apple Login (Native)", `User: ${credential.user}`);
      } catch (e: any) {
        if (e.code === "ERR_CANCELED") {
          Alert.alert("Cancelled", "User cancelled sign in.");
        } else {
          Alert.alert("Error", e?.message ?? JSON.stringify(e));
        }
      }
    } else {
      // Android / Web → Web OAuth
      promptAsync();
    }
  };

  return { signIn, request };
};
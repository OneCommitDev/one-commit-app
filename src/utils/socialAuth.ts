// src/auth/socialAuth.ts
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import {  APP_CONFIG_MICROSOFT } from './constants';

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
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      usePKCE: false,
    },
    {
      authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    }
  );

  //console.log('request' , request);

console.log(AuthSession.makeRedirectUri({
  scheme: 'com.onecommit.app',
  path: 'oauthredirect',
}));



  const handleResponse = async () => {
    if (response?.type === 'success') {
      const { code } = response.params;

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
  console.log('Microsoft Token Response:', data);
};

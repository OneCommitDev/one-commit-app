// constants.ts
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

const {microsoft_clinetid , google_web_clientid , google_ios_clientid} = Constants.expoConfig?.extra ?? {};
const APP_SCHEME = 'OneCommit';
 export const APP_CONFIG_MICROSOFT = {
  CLIENT_ID: microsoft_clinetid,
  REDIRECT_URI: AuthSession.makeRedirectUri({
    scheme: 'us.onecommit.app', 
    path: 'oauthredirect',       
  }),
};

export const APP_CONFIG_GOOGLE = {
  webClient: google_web_clientid,
  iosClient: google_ios_clientid,
    emailLoginScopes: [
    'profile',                              
    'email',                                  
  ],
  emailScopes: [
    'profile',                                
    'email',                                 
    'https://www.googleapis.com/auth/gmail.readonly', 
    'https://www.googleapis.com/auth/gmail.send',     
    'https://www.googleapis.com/auth/gmail.modify',   
  ]
};
// constants.ts
import * as AuthSession from 'expo-auth-session';
const APP_SCHEME = 'OneCommit';
 export const APP_CONFIG_MICROSOFT = {
  CLIENT_ID: 'ae251711-526a-487f-9274-d067ca936041',
  REDIRECT_URI: AuthSession.makeRedirectUri({
    scheme: 'com.onecommit.app', 
    path: 'oauthredirect',       
  }),
};

export const APP_CONFIG_GOOGLE = {
  webClient: '156935841607-s3q4q01qhosr3bviecpnuratotulsutm.apps.googleusercontent.com',
  iosClient: '156935841607-6qjtusg96ddbk3u0n87l7irgh1u3mi31.apps.googleusercontent.com',
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
// constants.ts
import * as AuthSession from 'expo-auth-session';



const APP_SCHEME = 'OneCommit';

 export const APP_CONFIG_MICROSOFT = {
  CLIENT_ID: 'ae251711-526a-487f-9274-d067ca936041',
  REDIRECT_URI: AuthSession.makeRedirectUri({
    scheme: 'com.onecommit.app', // ✅ just the scheme
    path: 'oauthredirect',        // ✅ set path separately
  }),
  
};

// constants.ts
import * as AuthSession from 'expo-auth-session';

// Shared scheme from app.json
const APP_SCHEME = 'OneCommit';

// 📦 Google Login Config
export const APP_CONFIG_GOOGLE = {
  SCHEME: APP_SCHEME,
  GOOGLE_CLIENT_ID: 'google-client-id.apps.googleusercontent.com', // ← Replace with real ID
  REDIRECT_URI: `${APP_SCHEME}:/oauthredirect`,
};




 export const APP_CONFIG_MICROSOFT = {
  CLIENT_ID: 'your-microsoft-client-id',
  REDIRECT_URI: AuthSession.makeRedirectUri({
    scheme: APP_SCHEME, // e.g. com.myapp
  }),
};

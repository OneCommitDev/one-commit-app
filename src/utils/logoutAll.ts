import * as AuthSession from 'expo-auth-session';

export const logoutGoogle = async (accessToken: string) => {
  try {
    // Revoke access from Google using the access token
    await AuthSession.revokeAsync(
      {
        token: accessToken,
      },
      {
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      }
    );

    console.log('✅ Google account access revoked');
  } catch (error) {
    console.error('❌ Google logout error:', error);
  }
};

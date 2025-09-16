// utils/jwt.ts
export const decodeAccessToken = (token: string) => {
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;

    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
   // console.error("❌ Failed to decode access token:", error);
    return null;
  }
};

export const isTokenExpiringSoon = (token: string, bufferSeconds = 86400): boolean => {
  const decoded = decodeAccessToken(token);
  if (!decoded?.exp) return true;

  const expiry = decoded.exp * 1000;
  return expiry - Date.now() < bufferSeconds * 1000;
};

export interface RegisterResponse {
  status: boolean;
  message?: string;
  redirect?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterOTPResponse {
  status: boolean;
  message?: string;

}

export interface LoginResponse {
 status: boolean;
  message?: string;
  redirect?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ResetPasswordResponse {
 status: boolean;
  message?: string;
  redirect?: string;
}

export interface SimpleResponse {
  data: boolean;
 status: boolean;
  message?: string;
}
export interface CreateProfileResponse {
 status: boolean;
  message?: string;
}

export  interface TokenResponse {
 success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SocialTokenResponse {
  token_type: string;
  scope: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
  status?: boolean; // optional fallback if you're returning a fallback object
  message?: string; // optional fallback error
}
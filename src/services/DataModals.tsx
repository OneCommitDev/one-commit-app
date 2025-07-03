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
 status: boolean;
  message?: string;
  redirect?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}
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

export interface ProfileResponse {
 status: boolean;
  message?: string;
  redirect?: string;
  data?: {
        full_name: string;
        prefferred_name: string;
        phone_number: string;
        dob: string;
        city: string;
        state: string;
        zipcode: string;
        gender: string;
        weight: any;
        weight_unit: string;
        height: any;
        height_unit: string;
  };
}

export interface ProfileSaveResponse {
 status: boolean;
  message?: string;
  redirect?: string;
  data?: {
        full_name: string;
        prefferred_name: string;
        phone_number: string;
        dob: string;
        city: string;
        state: string;
        zipcode: string;
        gender: string;
        weight: string;
        weight_unit: string;
        height: string;
        height_unit: string;
  };
}
 
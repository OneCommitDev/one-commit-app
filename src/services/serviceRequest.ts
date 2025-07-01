import axios from 'axios';
import { getItem } from 'expo-secure-store';
import qs from 'qs'; 
import { getValidAccessToken } from '~/utils/decodeAccessToken';
import { PREF_KEYS } from '~/utils/Prefs';

// ✅ Create a reusable Axios instance
export const  base_url = 'http://ec2-18-218-15-226.us-east-2.compute.amazonaws.com:8080/v1/';
const api = axios.create({
  baseURL: base_url, 
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Set token (optional: for auth headers)
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// ✅ GET request
export const getRequest = async (url: string, params?: any) => {
  const response = await api.get(url, { params });
  return response.data;
};

// ✅ POST request
export async function postRequest<T = any>(url: string, data?: any): Promise<T> {
  const response = await api.post<T>(url, data); // ✅ use `api` not `axios`
  return response.data;
}


// ✅ PUT request
export const putRequest = async (url: string, data?: any) => {
  const response = await api.put(url, data);
  return response.data;
};

// ✅ DELETE request
export const deleteRequest = async (url: string) => {
  const response = await api.delete(url);
  return response.data;
};

// ✅ Upload file (e.g., image)
export const uploadFile = async (url: string, fileUri: string) => {
  const formData = new FormData();

  formData.append('file', {
    uri: fileUri,
    name: 'upload.jpg',
    type: 'image/jpeg',
  } as any); // 👈 "as any" to satisfy TS if needed

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};







export async function postFormUrlEncoded<T = any>(
  url: string,
  data?: any,
  token?: string // 👈 optional token param
): Promise<T> {
  const response = await api.post<T>(url, qs.stringify(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(token && { Authorization: `Bearer ${token}` }), // 👈 conditional header
    },
  });
  return response.data;
}


// Common request handler
export async function httpRequest<T>(
  url: string,
  method: 'post' | 'get' | 'put' | 'delete',
  data?: any,
  token?: string,
  isFormUrlEncoded: boolean = false
): Promise<{ status: boolean; data?: T; message?: string ; redirect? : string}> {
   const loginStatus = await getItem(PREF_KEYS.login_status);

    let finalToken = token;
    if (loginStatus === 'success') {
        finalToken = (await getValidAccessToken()) ?? undefined;
    }
  try {
    const headers: any = {
      'Content-Type': isFormUrlEncoded
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
    };

    if (finalToken) {
      headers.Authorization = `Bearer ${finalToken}`;
    }

    const response = await api.request<T>({
      url,
      method,
      data: isFormUrlEncoded ? qs.stringify(data) : data,
      headers,
    });

    return { status: true, data: response.data };
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Request failed';
    return { status: false, message };
  }
}


// export async function httpRequest2<T>(
//   url: string,  method: 'post' | 'get' | 'put' | 'delete',  data?: any,  token?: string,  isFormUrlEncoded: boolean = false ): Promise<T> {
//      const loginStatus = await getItem(PREF_KEYS.login_status);

//     let finalToken = token;
//     if (loginStatus === 'success') {
//         finalToken = (await getValidAccessToken()) ?? undefined;
//     }
//         console.log(finalToken);


//   try {
//     const headers: any = {
//       'Content-Type': isFormUrlEncoded
//         ? 'application/x-www-form-urlencoded'
//         : 'application/json',
//     };

//     if (finalToken) {
//       headers.Authorization = `Bearer ${finalToken}`;
//     }

//    const response = await api.request<T>({
//   url,
//   method,
//   ...(method === 'get'
//     ? { params: data }
//     : { data: isFormUrlEncoded ? qs.stringify(data) : data }),
//   headers,
// });


//     return response.data;
//   } catch (error: any) {
//     const fallback: T = {
//       status: false,
//       message: error?.response?.data?.message || error.message || 'Request failed',
//     } as T;

//     return fallback;
//   }
// }

export async function httpRequest_social_token<T>(
  url: string,
  method: 'post' | 'get' | 'put' | 'delete',
  data?: any,
  authCodeOrToken?: string,
  isFormUrlEncoded: boolean = false
): Promise<T> {
  try {
    const headers: any = {
      'Content-Type': isFormUrlEncoded
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
    };

    const payload =
      method === 'get'
        ? { params: data }
        : {
            data: isFormUrlEncoded ? qs.stringify({
              ...data,
              code: authCodeOrToken,
            }) : {
              ...data,
              code: authCodeOrToken,
            }
          };

    const response = await api.request<T>({
      url,
      method,
      ...payload,
      headers,
    });

    return response.data;
  } catch (error: any) {
    console.log('❌ HTTP error (social token)', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config,
    });

    const fallback: T = {
      status: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Request failed',
    } as T;

    return fallback;
  }
}


 export async function httpRequest2<T>(
  url: string,
  method: 'post' | 'get' | 'put' | 'delete',
  data?: any,
  token?: string,
  isFormUrlEncoded: boolean = false
): Promise<T> {
  try {
    const loginStatus = await getItem(PREF_KEYS.login_status);
    let finalToken = token;

    // If logged in, get a valid access token once
    if (loginStatus === 'success') {
      finalToken = await getValidAccessToken() ?? '';

      if (!finalToken) {
        return {
          status: false,
          message: 'Unable to retrieve valid access token.',
        } as T;
      }
    }

    const headers: any = {
      'Content-Type': isFormUrlEncoded
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
    };

    if (finalToken) {
      headers.Authorization = `Bearer ${finalToken}`;
    }

    const response = await api.request<T>({
      url,
      method,
      ...(method === 'get'
        ? { params: data }
        : { data: isFormUrlEncoded ? qs.stringify(data) : data }),
      headers,
    });

    return response.data;
  } catch (error: any) {
    console.log('❌ HTTP error', {
  message: error.message,
  response: error.response,
  request: error.request,
  config: error.config,
});

    const fallback: T = {
      status: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Request failed',
    } as T;

    return fallback;
  }
}



export async function httpGetWithToken<T>(
  url: string,
  params?: Record<string, any>,
  token?: string
): Promise<T> {

  console.log('GET Request:', {
  url,
  fullUrl: `${api.defaults.baseURL}${url}`,
  params,
  token,
});

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await api.get<T>(url, {
      headers,
      params,
    });

    return response.data;
  } catch (error: any) {
    console.error('GET request failed:', error);

    const fallback: T = {
      status: false,
      message: error?.response?.data?.message || error.message || 'Request failed',
    } as T;

    return fallback;
  }
}


export const Api_Url = {
  login: '/login',
  microsoft_token : '/auth/microsoft/verify',
  google_token : '/auth/google/verify',
  refreshToken: '/token',
  forgotpassword: '/forgot-pass',
  forgotPassverifyUser: '/forgot-pass-verify',
  resendForgotOTP: '/resend-forgot-otp',
  resetPassword: '/reset-pass',
  register: '/register',
  verifyUser: '/register-verify',
  otpResend : '/resend-otp',
  userProfile : `/profile`,


};



export interface RegisterRequest {
  email: string;
  password: string;
}
export interface TokenRequest {
  email: string;
}

export interface RegisterOTPRequest {
  email: string;
  code: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotOTPVerifyRequest {
  email: string;
  code : string;
}

export interface ResetPasswordRequest {
  email: string;
  code : string;
  pass : string;
}

export interface CreateProfileRequest {
  email: string;

}



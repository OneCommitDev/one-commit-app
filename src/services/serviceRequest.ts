import axios from 'axios';
import { getItem } from 'expo-secure-store';
import qs from 'qs'; 
import { getValidAccessToken } from '~/utils/decodeAccessToken';
import { PREF_KEYS } from '~/utils/Prefs';
import Constants from "expo-constants";
import { parseApiError } from './parseApiError';
import { Platform } from 'react-native';
import * as Application from "expo-application";

const { apiUrl, appEnv , xKey , baseImgUrl} = Constants.expoConfig?.extra ?? {};
export const  base_url_images = baseImgUrl;
export const base_url =  apiUrl;

console.log('apiUrl_', apiUrl);
const api = axios.create({
  // baseURL: "https://devapi.onecommit.us:443/v1", 
  baseURL: apiUrl,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',  
    'x-api-key' : xKey,
  },
});

// 👇 Add deviceId dynamically before each request
api.interceptors.request.use(async (config) => {
  let deviceId;
  if (Platform.OS === "android") {
    deviceId = Application.getAndroidId;
  } else {
    deviceId = await Application.getIosIdForVendorAsync();
  }
    config.headers["app-device-id"] = deviceId;   
  //  config.headers.device_ = deviceId;
  //  console.log("➡️ Request Headers:", config.headers);
  return config;
});
export default api;


export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
 
//  GET request
export const getRequest = async (url: string, params?: any) => {
  const response = await api.get(url, { params });
  return response.data;
};

//  POST request
export async function postRequest<T = any>(url: string, data?: any): Promise<T> {
  const response = await api.post<T>(url, data); // ✅ use `api` not `axios`
  return response.data;
}


//  PUT request
export const putRequest = async (url: string, data?: any) => {
  const response = await api.put(url, data);
  return response.data;
};

//  DELETE request
export const deleteRequest = async (url: string) => {
  const response = await api.delete(url);
  return response.data;
};

//  Upload file (e.g., image)
export const uploadFile = async (url: string, fileUri: string) => {
  const formData = new FormData();

  formData.append('file', {
    uri: fileUri,
    name: 'upload.jpg',
    type: 'image/jpeg',
  } as any);

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
    // const message = error?.response?.data?.message || error.message || 'Request failed';
    // return { status: false, message };
    const parsedError = parseApiError(error);
    return { status: false, message: parsedError.message, redirect: parsedError.redirect };
  }
}

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

             let fullUrl = url;
    if (method === 'get' && data) {
      const queryString = qs.stringify(data, { addQueryPrefix: true });
      fullUrl += queryString;
    }

   // console.log(`📡 Requesting [${method.toUpperCase()}] ${fullUrl}`);


    const response = await api.request<T>({
      url,
      method,
      ...payload,
      headers,
    });

    return response.data;
  } catch (error: any) {
     console.log(' HTTP error', {
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
  const controller = new AbortController();

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

     const fullUrl =
      method === 'get' && data
        ? `${url}?${qs.stringify(data)}`
        : url;

    const response = await api.request<T>({
      url,
      method,
      ...(method === 'get'
        ? { params: data }
        : { data: isFormUrlEncoded ? qs.stringify(data) : data }),
      headers,
       timeout: 30000,
       signal: controller.signal,
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

export async function httpSilentRequest<T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  data?: any,
  token?: string,
  isFormUrlEncoded = false
): Promise<T | null> {
  try {
    const loginStatus = await getItem(PREF_KEYS.login_status);
    let finalToken = token;

    if (loginStatus === 'success') {
      finalToken = await getValidAccessToken() ?? '';
      if (!finalToken) return null;
    }

    const headers: Record<string, string> = {
      'Content-Type': isFormUrlEncoded
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
    };

    if (finalToken) {
      headers.Authorization = `Bearer ${finalToken}`;
    }

    const fullUrl =
      method === 'get' && data
        ? `${url}?${qs.stringify(data)}`
        : url;

    const response = await api.request<T>({
      url: fullUrl,
      method,
      ...(method === 'get'
        ? { params: data }
        : { data: isFormUrlEncoded ? qs.stringify(data) : data }),
      headers,
      timeout: 4000, // optional: short timeout for silent calls
    });

    return response.data;
  } catch (error: any) {
    console.log('🕳️ Silent request failed:', {
      url,
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
    });
    return null;
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
  check_emailid: '/auth/register/check',
  login: '/login',
  microsoft_token : '/auth/microsoft/verify',
  google_token : '/auth/google/verify',
  apple_token : '/auth/apple/verify',
  refreshToken: '/token',
  forgotpassword: '/forgot-pass',
  forgotPassverifyUser: '/forgot-pass-verify',
  resendForgotOTP: '/resend-forgot-otp',
  resetPassword: '/reset-pass',
  register: '/register',
  verifyUser: '/register-verify',
  otpResend : '/resend-otp',
  userProfile: (userId: string | number, email: string) =>
  `/user/profile/`,
  gamesList : '/list/sports',
  sportsEvents: (sportsid: string | number) =>
  `/list/${sportsid}/events`,
  save_sports : '/user/profile/sports',
  academic : '/user/academic/', // Use for bothe request types
  collegePreferences : '/user/college-preferences', // Use for both request types
  microsoft_email_connect : '/user/connect/microsoft',
  google_email_connect : '/user/connect/google',
  get_email_connection : '/email/connection',
  profileComplete : '/profile-complete', // school match saving api
  // SCHOOL MATCHING API FUNC WITH PAGINATION
 schoolsMatches : (start: number, limit: number) =>
    `/match/schools/${start}/${limit}`,

  //  SCHOOL REMOVIING FUNC SAVE AND DELETE
 schoolsMatchesDelete : (schoolid: string, type : string) =>
    `/match/school/${type}/${schoolid}`,
 
      getOutreachemail : (schoolID: string) =>
    `/email/load/${schoolID}`,
   re_write_email : '/email/rewrite-with-ai',
   send_email_outReach : '/user/send/email',
    profileSummary : '/user/profile-summary',
    searchSchool : '/list/schools',
    searchSchoolByID : '/match/school',
     dashboardschools : (start: number, limit: number) =>
    `/dashboard/schools/${start}/${limit}`,
      dashboardDetails : (schoolid: any) =>
    `/dashboard/school/${schoolid}`,
  getEmialContent : '/email/content',
  archiveschoolsMatches : (start: number, limit: number) =>
  `/dashboard/archived/schools/${start}/${limit}`,
  homeToDo : '/dashboard/home/todo',
  fcmTokenAPI : '/user/notification',
  fcmTokenDeleteAPI : '/user/notification',
  deactivateAPI : '/user/deactivate',
  removeEmailApi : '/dashboard/remove-email',
   changePassword: '/change-pass',
      quickEditapi: '/user/profile-quick-edit',

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
 full_name: string;
        preferred_name: string;
        phone: string;
        dob: string;
        city: string;
        state: string;
        zipcode: string;
        gender: string;
        weight: string;
        weight_unit: string;
        height: string;
        height_unit: string;

}

export interface AcademicRequest {
      weighted_gpa: string;
      unweighted_gpa: string;
      test_score_type: string;
      sat_score: string;
      act_score: string;
      intended_major: string;
      intended_major_2?: string;
      intended_major_3?: string;
      school_name: string;
      school_type: string;
      ncaa_eligibility_status: string;

}

export interface SaveSportsRequest {
  sports_profile: profilData[];
  additional_info: string;
  media_links: string;
}

export interface profilData {
    sport_id : string;
    event_id : string;
    eventValue : string;
    eventUnit : string;
}

export interface CollegePreferencesRequest {
  what_matter_most: string;
  ncaa_division: string;
  preferred_region: string;
  school_size: string;
  academic_rigor: string;
  campus_type: string;
  need_financial_aid: string;
  early_decision_willingness: string;
  religious_affiliation: string;
  required_financial_aid : any;

}
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
 

export interface AcademicResponse {
 status: boolean;
  message?: string;
  data?: {
        lists: any;
        weighted_gpa: string;
        unweighted_gpa: string;
        test_score_type: string;
        test_score: string;
        intended_major: string;
        intended_major_2: string;
        intended_major_3: string;
        school_name: string;
        school_type: string;
        ncaa_eligibility_status: string;
  };
   lists?: {
      AcademicMajors: AcademicMajor[];
    };
}
export interface AcademicMajor {
  id: string;
  major_name: string;
  display_name: string;
  major_category: string;
}
 

export interface GamesResponse {
 status: boolean;
  message?: string;
  sportMergedData?: {
    sport_id : any;
        sportName: string;
        displayName: string;
        user_selected: string;
        img_path: string;
  };
}

 export interface EventsResponse {
  status: boolean;
  message?: string;
  eventMergedData?: {
    event_id: any;
    sport_id: any;
    display_name: string;
    event_category: string;
    gender: string;
    measurement_type: string;
    measurement_unit: string;
    user_selected: string;
    event_value: string;
    event_unit: string;
  }[];
}
 export type HoldSportsdata = {
   event_id: any;
    sport_id: any;
    display_name: string;
    event_category: string;
    gender: string;
    measurement_type: string;
    measurement_unit: string;
    user_selected: string;
    event_value: string;
    event_unit: string;
      selected: boolean;
};

export interface SavedSportResponse {
 status: boolean;
   requestedSportsProfile? : any;

  message?: string;
}


 export type GetSportsAlldata = {
    status: any;
    message?: string;
    sportUserData: sportUserData[];
};

 export type sportUserData = {
   sport_id: any;
    sport_name: any;
     display_name: any;
    img_path: any;
    events : sportUsereventsData[];
};

 export type sportUsereventsData = {
   event_id: any;
    eventValue: any;
     eventUnit: any;
    event_name: any;
     display_name: any;
     measurement_type: any;
    measurement_unit: any;
};
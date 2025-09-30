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

export interface CheckEmailVerifyResponse {
 status: boolean;
  message?: string;
  registration_status?: {
    status: string;
    is_verified: boolean;
    email: string;
  };
}

 

export interface LoginResponse {
 status: boolean;
  message?: string;
  redirect?: string;
  profile : profileLogin;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

export type profileLogin = {
complete : boolean;
stage : string;
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
  account_status : string;
  redirect?: string;
    profile : profileLogin;

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
        preferred_name: string;
        phone: string;
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
        sat_score: any;
        act_score : any
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
  data?: {
    sport_id : string;
    sport_name: string;
    display_name: string;
    user_selected: string;
    img_path: string;
  };
}

 export interface EventsResponse {
  status: boolean;
  message?: string;
  data?: {
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
      selected?: boolean;
      disabled?: boolean;
};

export interface SavedSportResponse {
 status: boolean;
   requestedSportsProfile? : any;

  message?: string;
}


 export type GetSportsAlldata = {
    status: any;
    message?: string;
    data : SportsData;
};
 export type SportsData = {  
    additional_links : string;
    media_links : string;
  sportUserFormattedData: sportUserData[];

 }

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



export type GetCollegePreferencesResponse = {
  status: boolean;
  data: GetCollegePreferencesData;  
  lists: {
    regions: string[];
    matters: MatterItem[];
     divisions: string[];
  };
  message?: string;
};

export type GetCollegePreferencesData = {
  what_matter_most: string;
  ncaa_division: string;
  preferred_region: string;
  school_size: string;
  academic_rigor: string;
  campus_type: string;
  need_financial_aid: string;
  early_decision_willingness: string;
  religious_affiliation: string;
  required_financial_aid : number;
};

export type MatterItem = {
  key: string;
  value: string;
};
 

export type SchoolsMatches = {
  status: boolean;
  email_conn_data : email_conn_data;
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  data: SchoolMatchItem[];
};

export type email_conn_data= {
  status: boolean;
  provider: boolean;
  email: boolean;
}

export type SchoolMatchItem = {
  school_id: string;
  name: string;
  ncaa_division: string;
  city: string;
  state: string;
  region: string;
  img_path: string;
  banner_path : string;
  school_size: string;
  overall_match_percent: string;
  match_criteria: MatchCriteria;
  match_created_at: string;
  coach_name: string;
  coach_email: string;
  coach_role: string;

  last_interaction_detail : string;
  no_of_interactions : any;
  last_interaction_date : string;
  coach_interest_percent : any;
  overall_progress_percent : any;
};

export type MatchCriteria = {
  match_score: MatchScore;
  academic_fit: AcademicFit;
  athlietic_fit: AthleticFit[];
  preference_fit: PreferenceFit;
};

export type MatchScore = {
  match_score_tier: string;
  match_score_percent: string;
};

export type AcademicFit = {
  act_score : number;
   sat_score : number | null;
  sat_score_avg:  number | null;
  sat_score_min:  number | null;
  act_score_avg:  number | null;
  act_score_min:  number | null;

  unweighted_gpa:  number | null;

    act_score_above_average: boolean;
      sat_score_above_average: boolean;
  test_score_above_average: boolean;
  match_score_tier: string;
  unweighted_gpa_school_avg: string | number | null;
  unweighted_gpa_school_min: string | number | null;
  unweighted_gpa_above_average: boolean;
};

export type AthleticFit = {
  event_name: string;
  within_range: boolean;
  event_available_in_school : boolean;
  event_performance: any;
  event_school_benchmark: string;
  event_school_bm_max: any;
  event_school_bm_min: any;
};

export type PreferenceFit = {
  school_size: string;
  preferred_region: string;
  school_size_match: boolean;
  preferred_region_match: boolean;
};

export interface EmailConnectionResponse {
  data: EmailConnectionResponseData;
 status: boolean;
   message : string;
 }
export interface EmailConnectionResponseData {
  provider: string;
 email: string;
}


 export type EmailOutreach = {
  status: boolean;
  message : string;
  data: EmailOutreachData;
};

export type EmailOutreachData = {
  coach_count: number;
  email_subject: string;
  email_content: string;
  coach_details: EmailOutreachCoachDetails[];
};

export type EmailOutreachCoachDetails = { 
  coach_id: string;
  coach_name: string;
  coach_role: string;
  coach_email: string;
  coach_phone: string;
  school_id: string;
  school_name: string;
};


 export type ProfileComplition = {
  status: boolean;
  profile: {
    complete: boolean;
    stage: string;
  };
  data: ProfileComplitionData;
};

export type ProfileComplitionData = {
  email_connect_status: boolean;
  email_connect_provider: string;
  email_connect_address: string;
  full_name: string;
  preferred_name: string;
  email: string;
  phone: string;
  dob: string;
    gender: string;
  city: string;
  state: string;
  zipcode: string;
  weight: string;
  weight_unit: string;
  height: number;
  height_unit: string;
  weighted_gpa: string;
  unweighted_gpa: string;
  test_score_type: string;
  sat_score: number;
   act_score: number;
  intended_major: string;
  intended_major_2: string;
  intended_major_3: string;
  school_name: string;
  school_type: string;
  what_matter_most: string;
  preferred_region: string;
  school_size: string;
  academic_rigor: string;
  campus_type: string;
  need_financial_aid: string;
  required_financial_aid: number;
  early_decision_willingness: string;
  religious_affiliation: string;
  additional_info: string;
  media_links: string;
  user_id: string;
  is_profile_complete: boolean;
  completion_stage: string;
  ncaa_division: string[];
  sportUserFormattedData: SportUserFormattedData[];
};

export type SportUserFormattedData = {
  sport_id: string;
  sport_name: string;
  display_name: string;
  img_path: string;
  events: SportEvent[];
};

export type SportEvent = {
   sport_id?: string;
  event_id: string;
  eventValue: string;
  eventUnit: string;
  event_name: string;
  display_name: string;
  measurement_type: string;
  measurement_unit: string;
};



export type SearchSchoolModal = {
  status: boolean;
  data: SearchSchoolData[];
};

export type SearchSchoolData = {
  school_id: string;
  short_name: string;
  name: string;
};


export type HomeToDo = {
  status : boolean;
  data : HomeToDoModal;
};

export type HomeToDoModal = {
  todo_items : todo_items[];
  profile : todo_profile;
   connected_email : todo_connected_email;
      communication_history : communication_history;

};

export type communication_history = {
  email_info : string;
  email_id : string;
  email_subject : string;
  email_to : string;
  email_from : string;
  email_status : string;
  email_sent_date : string;
  school_id : string;
}

export type todo_items ={
  id : string;
  school_id : string;
  notification : string;
  redirect_type : string;
}

export type todo_profile ={
name : string;
email : string;
}

export type todo_connected_email ={
provider : string;
email : string;
}

 export type Emaildatamodal = {
  status: boolean;
  data: {
    school_details: school_details[];
    communication_history: CommunicationHistory[];
  };
       email_conn_data: email_conn_data;

};

 
export type school_details = {
  school_id: string | null;
  name: string;
  ncaa_division: string;
  city: string;
  state: string;
  school_size: string;
  overall_match_percent: string;
  last_interaction_detail: string;
  no_of_interactions: string;
  last_interaction_date: string;
  coach_interest_percent: string;
  overall_progress_percent: string;
  school_coaches : school_coaches[];
};

export type school_coaches = {
  coach_id: string | null;
  coach_name: string;
  coach_role: string;
  coach_email: string;
  coach_phone: string;
 
};

 
export type CommunicationHistory = {
  email_id: string | null;
  email_subject: string;
  email_to: string;
  email_from: string;
  email_sent_date: string;
  email_status: string;
  providers? : string; // this is not the part of api call
};


 export type Emaildetails = {
  status: boolean;
  data : string;
  message : string;
};


export type Editprofilemodal ={
 status: boolean;
  profile: {
    complete: boolean;
    stage: string;
  };
  data: ProfileComplitionData;
}


export type DashboardStartOutreachModal = {
  status: boolean;
  email_content : string;
  email_subject : string;
  email_conn_data: {
    email: string;
    provider: string;
    status: boolean;
  };
  data: SchoolItem[];
};

export interface SchoolItem {
  coach_email: string;
  coach_id: string;
  coach_name: string;
  name: string;       // school name
  school_id: string;
}


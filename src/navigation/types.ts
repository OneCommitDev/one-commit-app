import { SelectedGame } from "~/screens/multi_info_screens/GamesGrid";
import { SchoolMatchItem } from "~/services/DataModals";

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Forgotpassword: undefined;
  ForgotEmailMobile: { method: 'email' | 'mobile' };
  OtpVerification: { method: 'email' | 'mobile'; value: string, typeis: string };
  ResetPasswordScreen: { userid: any };
  // MultiStepSurvey: { selectedGames: SelectedGame[] , stepToEdit : any }; // ✅ FIXED
  MultiStepSurvey: {
  selectedGames: SelectedGame[];
  stepToEdit: number | null;
  onGoBack?: (newStep: number) => void; // ✅ add this
};

  GamesGrid: undefined;
  UserProfile: { src: string };
  SuccessScreen: { message: string; title?: string };
  Success: { message: string; title?: string };
  FillProfileInfoScreen: undefined;
  CollegePreferences : undefined;
  EmailConnectionUI : undefined;
  Dashboard : undefined;
  CollegeMatchDetails: { school: SchoolMatchItem };

  AppWebview : {url : string , title : string};
  DeleteAccount : undefined;

  ProfilePreview : { selectedGames: SelectedGame[] , stepToEdit : any };
};

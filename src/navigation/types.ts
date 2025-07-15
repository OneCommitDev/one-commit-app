import { SelectedGame } from "~/screens/multi_info_screens/GamesGrid";

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
  MultiStepSurvey: { selectedGames: SelectedGame[] }; // ✅ FIXED
  GamesGrid: undefined;
  UserProfile: undefined;
  SuccessScreen: { message: string; title?: string };
  Success: { message: string; title?: string };
  FillProfileInfoScreen: undefined;
  CollegePreferences : undefined;
  EmailConnectionUI : undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Forgotpassword: undefined;
  ForgotEmailMobile: { method: 'email' | 'mobile' };
  OtpVerification: { method: 'email' | 'mobile'; value: string, typeis : string };
  ResetPasswordScreen : { userid: any };
  MultiStepSurvey: { selectedGames: string[] };
  GamesGrid : undefined;
  UserProfile : undefined;
};

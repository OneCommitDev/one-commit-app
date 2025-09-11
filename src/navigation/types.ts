import { SelectedGame } from "~/screens/multi_info_screens/GamesGrid";
import { SchoolMatchItem } from "~/services/DataModals";

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Login: undefined;
  EditProfileInfo : {src :string};
  AppSystemSettings : undefined;
  AppPreferences : undefined;
  ChangePassword : undefined;
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
  ContactUs : undefined;
  Dashboard : {onload : string};
  CollegeMatchDetails: { school: SchoolMatchItem };

  AppWebview : {url : string , title : string};
  DeleteAccount : undefined;

    ProfilePreview : { selectedGames: SelectedGame[] , stepToEdit : any , currentSteps : number};
    CollegePreferences : { selectedGames: SelectedGame[] , stepToEdit : any  , currentSteps : number};
    EmailConnectionUI : { selectedGames: SelectedGame[] , stepToEdit : any , currentSteps : number};
    Athletic : { selectedGames: SelectedGame[] , stepToEdit : any , currentSteps : number };

    Academic : { selectedGames: SelectedGame[] , stepToEdit : any ,  currentSteps : number};


  EmailCommunication : {id : string , type : string};
  ExplorSchools : undefined;
  DeleteAccountSuccess : undefined;
  SuccessProfileScreen : undefined;
NewRegister : undefined;
PasswordScreen : {emailid : string};
};

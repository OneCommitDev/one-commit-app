// ✅ MultiStepSurvey.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import EmailConnectionUI from './EmailConnectionUI';
import Academic from './Academic';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import { RootStackParamList } from '~/navigation/types';
import SelectedGames from './SelectedGames';
import Athletic from './Athletic';
import CollegePreferences from './CollegePreferences';
import CollegeMatches from './CollegeMatches';
import TitleText from '~/components/TitleText';
import AppText from '~/components/AppText';
import ProfilePreview from './ProfilePreview';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Step = {
  title: string;
  subtitle: string;
  type: string;
    sportId?: string;  

};
 type SelectedGame = {
  sportName: string;
  sportId: string;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;


// type MultiStepSurveyRouteProp = RouteProp<RootStackParamList, 'MultiStepSurvey'>;
type MultiStepSurveyRouteProp = RouteProp<
  RootStackParamList,
  'MultiStepSurvey'
>;

export type RootStackParamList = {
  MultiStepSurvey: {
    selectedGames: SelectedGame[];
    stepToEdit?: number | null;
    currentSteps : number
  };
   Athletic: {
      selectedGames: SelectedGame[];
      stepToEdit?: number | null;
      currentSteps : number

  };

};



 function generateStepsData(selectedGames: SelectedGame[]): Step[] {
  const dynamicSteps: Step[] = selectedGames.map((sport) => ({
    title: sport.sportName,
    subtitle: 'Select the options as per your specialty.',
    type: 'games',
    sportId: sport.sportId, 
  }));

  const staticSteps: Step[] = [
    {
      title: 'Personal Records',
      subtitle: 'Showcase your physical stats and achievements',
      type: 'PersonalRecords',
    },
    {
      title: 'Academic Information',
      subtitle: 'Help colleges see your academic strengths',
      type: 'Academic',
    },
    {
      title: 'College Preferences',
      subtitle: 'Choose your college preferences',
      type: 'College',
    },
    {
      title: 'Connect Your Email Account',
      subtitle: 'Required to send emails directly to coaches from your own account',
      type: 'Accounts',
    },
    {
      title: 'Profile Summary',
      subtitle: "Please review your details. To make any changes, go back and update them. Once you're ready, tap the button below to finalize your profile.",
      type: 'ProfilePreview',
    },
    // {
    //   title: 'Your Initial College Matches',
    //   subtitle: 'You may remove any schools, but we recommend keeping your list large at first.',
    //   type: 'CollegeMatches',
    // },
    
  ];

  return [...dynamicSteps, ...staticSteps];
}


export default function MultiStepSurvey() {
    const navigation_other = useNavigation<Nav>(); 

  const route = useRoute<MultiStepSurveyRouteProp>();
  const { selectedGames , stepToEdit  } = route.params ?? {};
  const stepsData = generateStepsData(selectedGames);
  const TOTAL_STEPS = stepsData.length;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'MultiStepSurvey'>>();
  const [step, setStep] = useState<number>(stepToEdit ?? 0);

  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[][]>(
    Array(TOTAL_STEPS).fill([]),
  );
  const animation = useRef(new Animated.Value(1)).current;
  const current = stepsData[step];

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setStep((prev) => prev + 1);
        setSearchText('');
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
     // console.log('All steps complete:', selectedItems);
    }
  };

  const handleBack = () => {
    if( stepToEdit === 1 ){     // if user editinging tehrecords then allow them go back to teh profile summary screen
      //  navigation.setParams({ stepToEdit: null }); 
        navigation.goBack();
    }else{
    if (step > 0) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setStep((prev) => prev - 1);
        setSearchText('');
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      navigation.goBack();
    }
  }
  };

    const goToLastStep = () => {
            navigation.setParams({ stepToEdit: null }); 

         Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
             setStep(TOTAL_STEPS - 1);

        setSearchText('');
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });

      };

    const gotToPersonalRecordForcefully = () => {
        setTimeout(() => {
                 setStep(selectedGames.length);
        }, 300);
    };

  return (
    <View className="flex-1 px-3 pt-12">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-1 mt-6">
        {/* <TouchableOpacity
          onPress={handleBack}
          className="w-12 h-12 rounded-full bg-[#E3E9E5] items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#1A322E" />
        </TouchableOpacity> */}
              {stepToEdit ===1 ? (
                <TouchableOpacity
                  onPress={handleBack}
                  className="px-1 py-2  rounded-full"
                >
                  <Ionicons name="close-sharp" size={30} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleBack}
                  className="w-12 h-12 rounded-full bg-[#E3E9E5] items-center justify-center"
                >
                  <Ionicons name="chevron-back" size={24} color="#1A322E" />
                </TouchableOpacity>
              )}

        <View className="flex-1 mx-10 my-5">
          <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <Animated.View
        style={{
          flex: 1,
          opacity: animation,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        }}
      >
        <View className="items-center mb-4 -mt-[6]">
          <TitleText className="text-center">
            {current.title}
          </TitleText>
          <AppText className="text-center mb-5 -mt-2 ml-2 mr-2">
            {current.subtitle}
          </AppText>
        </View>

        <View className="flex-1">
          {renderExtraInfoForStep(
            current.type,
            current.title,
            current.sportId ?? "",  
            searchText,
            setSearchText,
            selectedItems,
            setSelectedItems,
            step,
            handleNext,
            selectedGames  ,
            goToLastStep,
            stepToEdit,
            gotToPersonalRecordForcefully,
             navigation_other   // ✅ pass navigation
          )}
        </View>
      </Animated.View>
    </View>
  );
}

function renderExtraInfoForStep(
    type: string,
    sportName: string,
    sportId: string,
    searchText: string,
    setSearchText: (text: string) => void,
    selectedItems: string[][],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[][]>>,
    step: number,
    onNext?: () => void,
    selectedGames?: SelectedGame[]  ,
    goToLastStep?: () => void,
    stepToEdit?: any,
    gotToPersonalRecordForcefully?: () => void,
    navigation?: NativeStackNavigationProp<RootStackParamList>  
) {
  switch (type) {
    // case 'PersonalRecords':
    //   return <Athletic onNext={onNext} stepToEdit={stepToEdit} goToLastStep={goToLastStep} />;
    // case 'Academic':
    //   return <Academic onNext={onNext} stepToEdit={stepToEdit} goToLastStep={goToLastStep} />;
    // case 'College':
    //   return <CollegePreferences onNext={onNext} stepToEdit={stepToEdit} goToLastStep={goToLastStep} />;
    // case 'Accounts':
    //   return <EmailConnectionUI onNext={onNext}  stepToEdit={stepToEdit} goToLastStep={goToLastStep} />;
    // case 'CollegeMatches':
    //   return <CollegeMatches onNext={onNext} />;
    //  case 'ProfilePreview':
    //   return <ProfilePreview onNext={onNext} />;
    case 'games':
      return (
      
       <SelectedGames
        sportName={sportName}
        sportId={sportId}
        searchText={searchText}
        setSearchText={setSearchText}
        step={step}
        onNext={onNext}
        goToLastStep={goToLastStep}
        selectedGames={selectedGames ?? []} 
        stepToEdit={stepToEdit}
         gotToPersonalRecordForcefully={gotToPersonalRecordForcefully}
         navigation={navigation}
       />
      );
    default:
      return null;
  }
}

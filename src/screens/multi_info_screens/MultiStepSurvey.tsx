import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import EmailConnectionUI from './EmailConnectionUI';
import Academic from './Academic';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/types';
import SelectedGames from './SelectedGames';
import Athletic from './Athletic';

const sportOptions: Record<string, string[]> = {
  'Track & Field': ['100m Sprint', '200m Sprint', '400m Run', '500m Run', '600m Run', '700m Run', '800m Run', '900m Run', '1000m Run', 'Long Jump', 'High Jump'],
  Swimming: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly'],
  Soccer: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
  Basketball: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
  Baseball: ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Shortstop', 'Outfielder'],
  Hockey: ['Goalie', 'Defenseman', 'Winger', 'Center'],
  Tennis: ['Singles', 'Doubles'],
};

type Step = {
  title: string;
  subtitle: string;
  options: string[];
  type: string;
};

type MultiStepSurveyRouteProp = RouteProp<RootStackParamList, 'MultiStepSurvey'>;

function generateStepsData(selectedGames: string[]): Step[] {
  const dynamicSteps: Step[] = selectedGames.map((sport) => ({
    title: sport,
    subtitle: 'Select the options as per your specialty.',
    options: sportOptions[sport] || [],
    type: 'games',
  }));

  const staticSteps: Step[] = [
    {
      title: 'Athletic Information',
      subtitle: 'Showcase your physical stats and achievements',
      options: ['Build Muscle', 'Lose Fat', 'Endurance', 'Flexibility', 'Balance'],
      type: 'Athletic',
    },
    {
      title: 'Academic Information',
      subtitle: 'Help colleges see your academic strengths',
      options: ['Beginner', 'Intermediate', 'Advanced', 'Pro'],
      type: 'Academic',
    },
    
    {
      title: 'College Preferences',
      subtitle: 'Choose your college preferences',
      options: ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'No Preference'],
      type: 'College',
    },
    {
      title: 'Connect Your Email Account',
      subtitle: 'Required to send emails directly to coaches from your own account',
      options: ['Morning', 'Afternoon', 'Evening', 'Late Night'],
      type: 'Accounts',
    },
    {
      title: 'Your Top College Matches',
      subtitle: 'Choose best one & start outreach',
      options: ['Protein', 'Creatine', 'Multivitamins', 'None'],
      type: 'CollegeMatches',
    },
  ];

  return [...dynamicSteps, ...staticSteps];
}

export default function MultiStepSurvey() {
  const route = useRoute<MultiStepSurveyRouteProp>();
  const { selectedGames } = route.params;

  const stepsData = generateStepsData(selectedGames);
  const TOTAL_STEPS = stepsData.length;

  const navigation = useNavigation();
  const [step, setStep] = useState(0);
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
      console.log('All steps complete:', selectedItems);
    }
  };

  const handleBack = () => {
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
  };

  return (
        <View className="flex-1 px-3 pt-12">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-1 mt-6">
            <TouchableOpacity
              onPress={handleBack}
              className="w-12 h-12 rounded-full bg-[#E3E9E5] items-center justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="#1A322E" />
            </TouchableOpacity>
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
            <View className="items-center mb-4 mt-5">
              <Text className="text-20 font-nunitosemibold text-black text-center mb-1">
                {current.title}
              </Text>
              <Text className="text-16 text-light text-center mb-5">
                {current.subtitle}
              </Text>
            </View>

            <View className="flex-1 px-3">
              {renderExtraInfoForStep(
                current.type,
                current.options,
                searchText,
                setSearchText,
                selectedItems,
                setSelectedItems,
                step
              )}
            </View>

            {selectedItems[step].length > 0 && (
              <View className="mt-1 px-1 py-1">
                <Text className="text-green-800 mb-2">Selected:</Text>
                <View className="flex-row flex-wrap gap-1">
                  {selectedItems[step].map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        const newSelection = [...selectedItems];
                        newSelection[step] = newSelection[step].filter(
                          (i) => i !== item
                        );
                        setSelectedItems(newSelection);
                      }}
                      className="flex-row items-center px-4 py-2 bg-gray-200 rounded-full"
                    >
                      <Text className="text-pretty mr-1">{item}</Text>
                      <Ionicons name="close" size={14} color="#065F46" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View className="px-2 py-4 mb-20">
              <ArrowButton
                text={
                  current.title === 'Connect Your Email Account'
                    ? 'Find My Matches'
                    : current.title === 'Your Top College Matches'
                    ? 'Finish & Go to Dashboard'
                    : 'Continue'
                }
                onPress={handleNext}
                fullWidth
              />
            </View>
          </Animated.View>
        </View>
  );
}

function renderExtraInfoForStep(
  type: string,
  options: string[],
  searchText: string,
  setSearchText: (text: string) => void,
  selectedItems: string[][],
  setSelectedItems: React.Dispatch<React.SetStateAction<string[][]>>,
  step: number
) {
  switch (type) {
    case 'Academic':
      return <Academic />;
    case 'Athletic':
      return <Athletic />;
    case 'College':
      return <Text className="text-blue-700">College Preferences</Text>;
    case 'Accounts':
      return <EmailConnectionUI />;
    case 'games':
      return (
        <SelectedGames
          options={options}
          searchText={searchText}
          setSearchText={setSearchText}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          step={step}
        />
      );
    default:
      return null;
  }
}

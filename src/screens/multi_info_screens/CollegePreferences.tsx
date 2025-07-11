import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import Loader from '~/components/Loader';
import AppText from '~/components/AppText';
import SliderComponents from '~/components/SliderComponents';
import AcademicRigorSlider from '~/components/AcademicRigorSlider';
import TestTypeToggle from './TestTypeToggle';
import AppInput from '~/components/AppInput';
import ReligiousAffiliationSlider from '~/components/ReligiousAffiliationSlider';
import FinancialAidSlider from '~/components/FinancialAidSlider';

type Props = {
  onNext?: () => void;
};

const recruitingOptions = [
  'Play at the highest level I can',
  'Get into the best academic school I can',
  'Use my sport to help pay for college',
  'Just want to keep playing and enjoy the experience',
];

// const divisionOptions = ['D1', 'D2', 'D3', 'NAIA', 'NJCAA'];
 const divisionOptions = ['D1', 'D2', 'D3'];


export default function CollegePreferences({ onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedRigor, setSelectedRigor] = useState('Just get me in');
  const [selectedValue, setSelectedValue] = useState<number>(2000);
  const [campusType, setCampusType] = useState<'Urban' | 'Suburban' | 'Rural'>('Urban');
  const [aidType, setAidType] = useState<'Yes' | 'No' | 'Not Sure'>('Yes');
  const [decisionType, setDecisionType] = useState<'Yes' | 'No' | 'Maybe'>('Yes');

    const [selectedReligious, setSelectedReligious] = useState('Doesn’t matter');
    const [selectedFinancial, setSelectedFinancial] = useState('None');


     


    const [form, setForm] = useState({
      campusType: '',
      aidType: '',
    });

    const handleChange = (key: string, val: string) => {
      setForm((prev) => ({ ...prev, [key]: val }));
    };

  const toggleDivision = (division: string) => {
    setSelectedDivisions(prev =>
      prev.includes(division)
        ? prev.filter(d => d !== division)
        : [...prev, division]
    );
  };

  const showDivisionAdvice = () => {
    Alert.alert(
      'Advice',
      "We don’t recommend limiting yourself to just one division.",
      [{ text: 'OK' }],
    );
  };

  const handleRigorChange = (value: React.SetStateAction<string>) => {
    setSelectedRigor(value);
    console.log('Selected Academic Rigor:', value);
  };

  const handleValueChange = (value: number) => {
    setSelectedValue(value);
    console.log('Selected Value:', value);
  };


    const handleReligiousChanges = (value: React.SetStateAction<string>) => {
    setSelectedReligious(value);
    console.log('Selected Academic Rigor:', value);
  };
        const handleFinancialChanges = (value: React.SetStateAction<string>) => {
    setSelectedFinancial(value);
    console.log('Selected Academic Rigor:', value);
  };
    

 

  return (
    <ScrollView
      className="bg-background"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      style={{ marginHorizontal: 12 }}
    >
      <Loader show={loading} />

          <View className="flex-1">
        {/* Recruiting Priorities */}
        <AppText size="text-18" className="mb-3">
          When it comes to recruiting, what matters most to you?
        </AppText>

        {recruitingOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedOption(option)}
            className="flex-row items-center mb-4"
          >
            <View
              className={`w-6 h-6 rounded-full mx-3 border-2 items-center justify-center ${
                selectedOption === option ? 'border-[#007AFF] bg-[#007AFF]' : 'border-gray-400'
              }`}
            >
              {selectedOption === option && (
                <View className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </View>
            <AppText className="text-16 text-light">
              {option}
            </AppText>
          </TouchableOpacity>
        ))}

        {/* NCAA Division Interest */}
        <View className="mt-1">
          <View className="flex-row items-center justify-between mb-3">
            <AppText  className="font-semibold">
              NCAA Division Interest
            </AppText>
            <TouchableOpacity onPress={showDivisionAdvice}>
              <Ionicons name="information-circle-outline" size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap rounded-xl p-1 align-center">
            {divisionOptions.map((division, index) => {
              const isSelected = selectedDivisions.includes(division);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleDivision(division)}
                  className={`flex-row items-center justify-between px-4 py-1 m-1 rounded-full min-w-[80px] ${
                    isSelected ? 'bg-white' : 'bg-transparent'
                  }`}
                  style={{
                    borderWidth: 1,
                    borderColor: isSelected ? '#007AFF' : '#E5E7EB',
                  }}
                >
                  <AppText
                    className={isSelected ? 'text-[#007AFF]' : 'text-gray-600'}
                  >
                    {division}
                  </AppText>
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={isSelected ? '#007AFF' : '#9CA3AF'}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preferred Region Placeholder */}
        <View className="mt-2">
            <AppText>
              Preferred Region
            </AppText>
         <AppInput
              value=''
              keyboardType="numeric"
              onChangeValue={(text) => handleChange('test_score', text)}
              placeholder={`Select Preferred Region`}
            />
        </View>
            

        {/* School Size Slider */}
           <View className="flex-1">
            <AppText>
              School Size
            </AppText>
                      <SliderComponents onValueChange={handleValueChange} />

          </View>
 
        {/* Academic Rigor */}
           <View className="flex-1 mt-2">
            <AppText>
              Academic Rigor
            </AppText>
                      {/* <AcademicRigorSlider onValueChange={handleRigorChange} /> */}

          </View>
 

  {/* Campus Type */}
           <View className="flex-1 mt-3">
            <AppText>
              Campus Type
            </AppText>
             <TestTypeToggle
              options={['Urban', 'Suburban', 'Rural']}
              initialValue={campusType}
              onSelect={(selected) => {
                setCampusType(selected as 'Urban' | 'Suburban' | 'Rural');
                handleChange('campusType', selected);
              }}
            />
          </View>
          
 

        {/* Aid */}
            <View className="flex-1 mb-2">
              <AppText>
                Do you need financial aid?
              </AppText>

              <TestTypeToggle
                options={['Yes', 'No', 'Not Sure']}
                initialValue={aidType}
                onSelect={(selected) => {
                  setAidType(selected as 'Yes' | 'No' | 'Not Sure');
                  handleChange('aidType', selected);
                }}
              />

              {aidType === 'Yes' && (
                 <SliderComponents onValueChange={handleValueChange} />
              )}
            </View>

          
 







          {/* Early Decision Willingness */}
           <View className="flex-1 mb-2">
            <AppText>
              Early Decision Willingness
            </AppText>
             <TestTypeToggle
              options={['Yes', 'No', 'Maybe']}
              initialValue={decisionType}
              onSelect={(selected) => {
                setDecisionType(selected as 'Yes' | 'No' | 'Maybe');
                handleChange('aidType', selected);
              }}
            />
          </View>






            {/* Religious Affiliation */}
           <View className="flex-1 mb-2">
            <AppText>
              Religious Affiliation
            </AppText>
            <ReligiousAffiliationSlider onValueChange={handleReligiousChanges} />

          </View>
          
 
 


        {/* Continue Button */}
        <View style={{ paddingHorizontal: 8, marginTop: 32 }}>
          <ArrowButton
            text="Continue"
            onPress={() => {
              onNext?.();
            }}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}
 


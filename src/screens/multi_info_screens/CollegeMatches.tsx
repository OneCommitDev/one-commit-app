import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArrowButton from '~/components/ArrowButton';
import AppText from '~/components/AppText';
import WhiteCustomButton from '~/components/WhiteCustomButton';
import images from '~/components/images';
import TitleText from '~/components/TitleText';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/types';
import OutreachSheet from './OutreachSheet';
import SuccessModal from '~/components/SuccessModal';

type College = {
  id: string;
  name: string;
  division: string;
  location: string;
  tag: string;
  match: string;
  logoUrl: ImageSourcePropType;
};

type Props = {
  onNext?: () => void;
};
type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


const colleges: College[] = [
  {
    id: '1',
    name: 'Stanford University',
    division: 'NCAA Division I',
    location: 'Stanford, CA',
    tag: 'Target',
    match: '92%',
    logoUrl: images.run,
  },
  {
    id: '2',
    name: 'University of Florida',
    division: 'NCAA Division I',
    location: 'Gainesville, FL',
    tag: 'Safe',
    match: '88%',
    logoUrl: images.run,
  },
  {
    id: '3',
    name: 'Harvard University',
    division: 'NCAA Division I',
    location: 'Cambridge, MA',
    tag: 'Reach',
    match: '75%',
    logoUrl: images.run,
  },
];

export default function CollegeMatches({ onNext }: Props) {
  const navigation = useNavigation<DashboardNavProp>();
  const [sheetVisible, setSheetVisible] = useState(false);
const [sheetData, setSheetData] = useState({ subject: '', message: '' });

const [showOutreach, setShowOutreach] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);

  const [selected, setSelected] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) =>
      college.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <View className="flex-1 bg-background px-2 pt-2">

 <OutreachSheet
  isVisible={sheetVisible}
  onClose={() => setSheetVisible(false)}
  initialSubject={sheetData.subject}
  onEmailSent={() => {
    setShowSuccess(true);
  }}
/>

<SuccessModal
  isVisible={showSuccess}
  onClose={() => setShowSuccess(false)}
/>


      <SuccessModal
      isVisible={showSuccess}
      onClose={() => setShowSuccess(false)}
    />

      {/* 🔍 Search Box */}
      <View className="flex-row items-center bg-white h-14 rounded-full px-4 mb-2">
        <TextInput
          placeholder="Search schools..."
          className="flex-1 text-black"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color="gray" />
      </View>

      {/* 📊 Match Count + Filter */}
      <View className="flex-row justify-between items-center mt-2 mb-2">
        <AppText>
          {filteredColleges.length} College Matches
        </AppText>
        {/* <TouchableOpacity>
          <Ionicons name="filter" size={20} color="gray" />
        </TouchableOpacity> */}
      </View>

      {/* 📋 Scrollable College List */}
      <View className="flex-1">
        <FlatList
  data={filteredColleges}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ gap: 10, paddingBottom: 40 }}
  renderItem={({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item.id)}
        className={`rounded-xl p-4 bg-white space-y-2 shadow-sm ${
          isSelected ? 'border-2 border-green-700' : 'border border-transparent'
        }`}
      >
        <View className="flex-row items-center space-x-4">
         <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
             {/* <Image
            source={item.logoUrl}
            className="w-8 h-8 rounded-full"
            resizeMode="contain"
          /> */}
         </View>
          <View className="flex-1 ml-2">
            <TitleText  color='text-primary'>
              {item.name}
            </TitleText>
            <AppText  className="-mt-3">
              {item.division} - {item.location}
            </AppText>
            <View className="flex-row space-x-2 -mt-1">
              <View
                className={`px-2 py-0.5 rounded-full ${
                  item.tag === 'Safe'
                    ? 'bg-blue-100'
                    : item.tag === 'Target'
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                }`}
              >
                <Text className="text-xs text-gray-700">{item.tag}</Text>
              </View>
               <View className='-mt-2 ml-3'>
                 <AppText size='text-12'>
                {item.match} Match
              </AppText>
               </View>
            </View>
          </View>
        </View>

        <View className="mt-3">
        <WhiteCustomButton
            text="Start Outreach"
            onPress={() => {
              setSheetData({
                subject: 'Testing subject',
                message: 'I’m excited to connect with your program.',
              });
              setSheetVisible(true);
            }}
            fullWidth
          />
        
        </View>
      </TouchableOpacity>
    );
  }}
  ListFooterComponent={
    <View className="px-2 pt-6 space-y-3">
      {selected.length > 0 && (
        <View className="bg-gray-200 px-3 py-2 rounded-full self-center">
          <Text className="text-center text-sm text-gray-700">
            {selected.length} schools selected
          </Text>
        </View>
      )}

     <View className='mb-5 mt-5'>
      
       <WhiteCustomButton
        text="Send Email to all"
            onPress={() => onNext?.()}
            fullWidth
            height={50}
          />
     </View>

      <ArrowButton
        text="Finish & Go to Dashboard"
         onPress={() => navigation.replace('Login')}
        fullWidth
      />
    </View>
  }
/>

      </View>

     
    </View>
  );
}

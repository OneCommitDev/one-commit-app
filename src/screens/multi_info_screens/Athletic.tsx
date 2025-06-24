import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TestTypeToggle from './TestTypeToggle';
import AppText from '~/components/AppText';
import AppInput from '~/components/AppInput';

const schoolTypes = ['Public', 'Private', 'Boarding'];
const ncaaStatuses = ['Yes', 'No', 'Unsure'];
 

const Athletic = () => {
  const [testType, setTestType] = useState<'SAT' | 'ACT'>('SAT');
  const [selectedMajor, setSelectedMajor] = useState('Business Administration');
  const [showMajorsDropdown, setShowMajorsDropdown] = useState(false);

  const [form, setForm] = useState({
      championships: [],
      swim1 : '',
      swim2 : '',

  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 0, paddingBottom: 100 }}
    >
    
 
     
        <AppText text="Personal Records/Track & Field" size="text-20" color='text-light' />

        <View>
        <View className="flex-row space-x-4">
        {/* Weight */}
        <View className="flex-1">
        <AppText text="100m Sprint" size="text-base" className="mb-1" />
        <AppInput
        value={form.weightis}
        onChangeValue={(text) => handleChange('weightis', text)}
        placeholder="Enter value"
        />
        </View>

        {/* Height */}
        <View className="flex-1 ml-5">
        <AppText text="Long Jump" size="text-base" className="mb-1" />
        <AppInput
        value={form.heightis}
        onChangeValue={(text) => handleChange('heightis', text)}
        placeholder="Enter value"
        className="h-12"
        />
        </View>
        </View>

        </View>

  <AppText text="Personal Records/Swimming" size="text-20" color='text-light' />

        <View className='bg-white px-5 py-5 rounded-t-2xl'>
        <View className="flex-row space-x-4">
        {/* Weight */}
        <View className="flex-1">
        <AppText text="100m Sprint" size="text-base" className="mb-1" />
        <AppInput
        value={form.swim1}
        onChangeValue={(text) => handleChange('swim1', text)}
        placeholder="Enter value"
        />
        </View>

        {/* Height */}
        <View className="flex-1 ml-5">
        <AppText text="Long Jump" size="text-base" className="mb-1" />
        <AppInput
        value={form.swim2}
        onChangeValue={(text) => handleChange('swim2', text)}
        placeholder="Enter value"
        className="h-12"
        />
        </View>
        </View>

        </View>



        <AppText text="Championship Experience" size="text-base" className="mb-1" />




      

      

     
 
    </ScrollView>
  );
};

export default Athletic;

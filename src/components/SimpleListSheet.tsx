import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TitleText from './TitleText';
import AppText from './AppText';

const { height } = Dimensions.get('window');

type Item = {
  key: string;
  value: string;
};

type Props = {
  visible: boolean;
  title?: string;
  data: Item[];
  onClose: () => void;
};

const SimpleListSheet: React.FC<Props> = ({
  visible,
  title = 'Details',
  data,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <View
          className="bg-white rounded-t-2xl pt-4 px-5 pb-8 max-h-[70%]"
          style={{ minHeight: height * 0.4 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4 mt-4">
            <Text className="text-center flex-1 font-nunitoextrabold text-primary text-18">
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} className="absolute right-0">
              <Ionicons name="close" size={24} color="#1A322E" />
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={data}
            keyExtractor={(item) => item.key}
            ItemSeparatorComponent={() => (
              <View className="h-[1px] bg-gray-100" />
            )}
            renderItem={({ item }) => (
              <View>
                <TitleText>{item.key}</TitleText>
                <AppText>
                  {item.value}
                </AppText>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SimpleListSheet;

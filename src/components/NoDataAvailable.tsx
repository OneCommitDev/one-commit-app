import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import AppText from './AppText';
import TitleText from './TitleText';

type Props = {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
  showRefresh?: boolean;
  useLottie?: boolean;
};

const NoDataAvailable: React.FC<Props> = ({
  title = 'No data available',
  subtitle = 'Please try again later or refresh the page.',
  onRetry,
  showRefresh = false,
  useLottie = true,
}) => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <LottieView
        source={require('../../assets/animations/no data.json')}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
      />

      <TitleText className="text-center -mt-0">
        {title}
      </TitleText>

      <Text className="text-sm text-gray-500 mt-2 text-center">
        {subtitle}
      </Text>

      {showRefresh && onRetry && (
        <TouchableOpacity
          className="mt-5 px-6 py-2 bg-blue-500 rounded-full"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold text-sm">Refresh</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NoDataAvailable;

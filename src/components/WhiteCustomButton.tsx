// import React from 'react';
// import { Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
// import { Feather } from '@expo/vector-icons';

// type Props = {
//   text: string;
//   onPress: () => void;
//   fullWidth?: boolean;
//   width?: number;
//   height?: number;
//   disabled?: boolean;
// };

// export default function WhiteCustomButton({
//   text,
//   onPress,
//   fullWidth = false,
//   width,
//   height,
//   disabled = false,
// }: Props) {
//   return (
//     <TouchableOpacity
//       className={`rounded-full px-2 py-2 flex-row items-center justify-center ${
//         fullWidth ? 'w-full' : 'self-start'
//       } bg-white border`}
//       onPress={onPress}
//       disabled={disabled}
//       style={
//         {
//           width,
//           height,
//           borderColor: '#C5C8C6',
//           borderWidth: 1,
//         } as StyleProp<ViewStyle>
//       }
//     >
//       <Text
//         className={`text-16  mr-2 font-nunitosemibold ${
//           disabled ? 'text-gray-500' : 'text-primary'
//         }`}
//       >
//         {text}
//       </Text>
//       <Feather name="arrow-right" size={20} color={disabled ? '#9CA3AF' : 'black'} />
//     </TouchableOpacity>
//   );
// }

import React from 'react';
import { Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  text: string;
  onPress: () => void;
  fullWidth?: boolean;
  width?: number;
  height?: number;
  disabled?: boolean;
  showArrowIcon?: boolean; // NEW: control icon visibility
};

export default function WhiteCustomButton({
  text,
  onPress,
  fullWidth = false,
  width,
  height,
  disabled = false,
  showArrowIcon = true, // NEW: default to true
}: Props) {
  return (
    <TouchableOpacity
      className={`rounded-full px-2 py-2 flex-row items-center justify-center ${
        fullWidth ? 'w-full' : 'self-start'
      } bg-white border`}
      onPress={onPress}
      disabled={disabled}
      style={
        {
          width,
          height,
          borderColor: '#C5C8C6',
          borderWidth: 1,
        } as StyleProp<ViewStyle>
      }
    >
      <Text
        className={`text-16 mr-2 font-nunitosemibold ${
          disabled ? 'text-gray-500' : 'text-primary'
        }`}
      >
        {text}
      </Text>

      {showArrowIcon && (
        <Feather name="arrow-right" size={20} color={disabled ? '#9CA3AF' : 'black'} />
      )}
    </TouchableOpacity>
  );
}

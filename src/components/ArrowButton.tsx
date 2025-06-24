// import React from 'react';
// import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
// import { Feather } from '@expo/vector-icons';

// type Props = {
//   text: string;
//   onPress: () => void;
//   fullWidth?: boolean; // optional prop to control width
// };

// export default function ArrowButton({ text, onPress, fullWidth = false }: Props) {
//   return (
//     <TouchableOpacity
//       style={[styles.button, fullWidth && styles.fullWidth]}
//       onPress={onPress}
//     >
//       <View style={styles.inner}>
//         <Text style={styles.text}>{text}</Text>
//         <Feather name="arrow-right" size={20} color="white" />
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#235D48',
//     paddingVertical: 15,
//     paddingHorizontal: 24,
//     borderRadius: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'flex-start', // prevent auto-stretch unless fullWidth
//   },
//   fullWidth: {
//     alignSelf: 'stretch', // makes it full width of parent
//   },
//   inner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 8,
//   },
// });


// import React from 'react';
// import { Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
// import { Feather } from '@expo/vector-icons';

// type Props = {
//   text: string;
//   onPress: () => void;
//   fullWidth?: boolean;
//   width?: number;
//   height?: number;
//    disabled?: boolean;
// };

// export default function ArrowButton({ text, onPress, fullWidth = false, width, height, disabled = false }: Props) {
//   return (
//     <TouchableOpacity
//       className={`bg-[#235D48] rounded-full px-6 py-4 flex-row items-center justify-center ${
//         fullWidth ? 'w-full' : 'self-start'
//       }`}
//       onPress={onPress}
//       disabled={disabled}
//       style={
//         {
//           width,
//           height,
//         } as StyleProp<ViewStyle>
//       }
//     >
//       <Text className="text-white text-btntextsize font-semibold mr-2 font-nunitoextrabold">{text}</Text>
//       <Feather name="arrow-right" size={20} color="white" />
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
};

export default function ArrowButton({
  text,
  onPress,
  fullWidth = false,
  width,
  height,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      className={`rounded-full px-6 py-4 flex-row items-center justify-center ${
        fullWidth ? 'w-full' : 'self-start'
      } ${disabled ? 'bg-gray-300' : 'bg-primary'}`}
      onPress={onPress}
      disabled={disabled}
      style={
        {
          width,
          height,
        } as StyleProp<ViewStyle>
      }
    >
      <Text
        className={`text-16 font-semibold mr-2 font-nunitoextrabold ${
          disabled ? 'text-gray-500' : 'text-white'
        }`}
      >
        {text}
      </Text>
      <Feather name="arrow-right" size={20} color={disabled ? '#9CA3AF' : 'white'} />
    </TouchableOpacity>
  );
}

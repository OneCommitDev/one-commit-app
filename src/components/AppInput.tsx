import React, { useState, ReactNode } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

type AppInputProps = TextInputProps & {
  value: string;
  onChangeValue: (val: string) => void;
  placeholder?: string;
  color?: string;
  size?: string;
  fontFamily?: string;
  className?: string;
  leftIcon?: ReactNode; // ✅ Optional left icon
};

export default function AppInput({
  value,
  onChangeValue,
  placeholder = '',
  color = 'text-black',
  size = 'text-base',
  fontFamily = 'font-nunitoregular',
  className = '',
  leftIcon, // ✅ Optional prop
  ...props
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`px-1 py-1 rounded-xl mt-2 mb-2 ${
        isFocused ? 'border-2 border-border_color bg-white' : 'bg-white'
      }`}
    >
      <View className="flex-row items-center">
        {/* Optional Left Icon */}
        {leftIcon && <View className="ml-3 mr-2">{leftIcon}</View>}
        
        <TextInput
          {...props}
          value={value}
          onChangeText={onChangeValue}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);  
            }}
          // onBlur={() => setIsFocused(false)}
          className={`flex-1 rounded-xl px-4 py-3 ${color} ${size} ${fontFamily} ${className}`}
        />
      </View>
    </View>
  );
}




// import React from 'react';
// import { TextInput, TextInputProps, View } from 'react-native';

// type AppInputProps = TextInputProps & {
//   value: string;
//   onChangeValue: (val: string) => void;
//   isFocused?: boolean;
//   onFocus?: () => void;
//   onBlur?: () => void;
//   placeholder?: string;
//   color?: string;
//   size?: string;
//   fontFamily?: string;
//   className?: string;
//   leftIcon?: React.ReactNode;
// };

// export default function AppInput({
//   value,
//   onChangeValue,
//   isFocused = false,
//   onFocus,
//   onBlur,
//   placeholder = '',
//   color = 'text-black',
//   size = 'text-base',
//   fontFamily = 'font-sans',
//   className = '',
//   leftIcon,
//   ...props
// }: AppInputProps) {
//   return (
//     <View
//       className={`px-1 py-1 rounded-xl mt-2 mb-2 ${
//         isFocused ? 'border-2 border-border_color bg-white' : 'bg-white'
//       }`}
//     >
//       <View className="flex-row items-center">
//         {leftIcon && <View className="ml-3 mr-2">{leftIcon}</View>}
//         <TextInput
//           {...props}
//           value={value}
//           onChangeText={onChangeValue}
//           placeholder={placeholder}
//           onFocus={onFocus}
//           onBlur={onBlur}
//           className={`flex-1 rounded-xl px-4 py-3 ${color} ${size} ${fontFamily} ${className}`}
//         />
//       </View>
//     </View>
//   );
// }

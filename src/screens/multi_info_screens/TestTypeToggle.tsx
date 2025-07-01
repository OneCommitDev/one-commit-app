// import React, { useEffect, useState } from 'react';
// import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from 'react-native-reanimated';

// type Props = {
//   options: string[];
//   initialValue?: string;
//   onSelect: (selected: string) => void;
// };

// export default function TestTypeToggle({ options, initialValue, onSelect }: Props) {
//   const screenWidth = Dimensions.get('window').width;
//   const sideMargin = 32; // px-4 on each side
//   const containerWidth = screenWidth - sideMargin;
//   const buttonWidth = containerWidth / options.length;

//   const [selected, setSelected] = useState(initialValue || options[0]);
//   const translateX = useSharedValue(0);

//   useEffect(() => {
//     const index = options.indexOf(selected);
//     translateX.value = withTiming(index * buttonWidth, { duration: 200 });
//   }, [selected]);

//   const highlightStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: translateX.value }],
//   }));

//   const handleSelect = (value: string) => {
//     setSelected(value);
//     onSelect(value);
//   };

//   return (
//     <View className="mt-3 mb-3 items-center ">
//       <View
//         className="relative flex-row bg-gray-200 rounded-full overflow-hidden"
//         style={{ width: containerWidth, height: 50 }}
//       >
//         {/* Highlight Animated Background */}
//         <Animated.View
//           style={[
//             {
//               position: 'absolute',
//               width: buttonWidth,
//               height: '100%',
//               backgroundColor: 'white',
//               borderRadius: 999,
//               zIndex: 1,
//             },
//             highlightStyle,
//           ]}
//         />

//         {options.map((item) => (
//           <TouchableOpacity
//             key={item}
//             onPress={() => handleSelect(item)}
//             style={{
//               width: buttonWidth,
//               height: '100%',
//               justifyContent: 'center',
//               alignItems: 'center',
//               zIndex: 2, // on top of highlight
//             }}
//           >
//             <Text
//               className={`text-[16px] font-nunitoextrabold ${
//                 selected === item ? 'text-black' : 'text-gray-500'
//               }`}
//             >
//               {item}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }






import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  options: string[];
  initialValue?: string;
  onSelect: (selected: string) => void;
};

export default function TestTypeToggle({ options, initialValue, onSelect }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [selected, setSelected] = useState(initialValue || options[0]);

  const translateX = useSharedValue(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const buttonWidth = containerWidth / options.length;

  useEffect(() => {
    const index = options.indexOf(selected);
    translateX.value = withTiming(index * buttonWidth, { duration: 200 });
  }, [selected, containerWidth]);

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <View className="mt-3 mb-3 items-center">
      <View
        onLayout={handleLayout}
        className="relative flex-row bg-gray-200 rounded-full overflow-hidden"
        style={{ height: 50 }}
      >
        {/* Animated highlight */}
        {containerWidth > 0 && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: buttonWidth,
                height: '100%',
                backgroundColor: 'white',
                borderRadius: 999,
                zIndex: 1,
              },
              highlightStyle,
            ]}
          />
        )}

        {/* Buttons */}
        {options.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => handleSelect(item)}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <Text
              className={`text-[16px] font-nunitoextrabold ${
                selected === item ? 'text-black' : 'text-gray-500'
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

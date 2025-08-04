// import React, { useState } from 'react';
// import { View, Text, LayoutChangeEvent } from 'react-native';
// import TitleText from './TitleText';
// import AppText from './AppText';

// interface PerformanceBarProps {
//   title: string;
//   score: number;
//   min: number;
//   max: number;
// }

// const PerformanceBar: React.FC<PerformanceBarProps> = ({ title, score, min, max }) => {
//   const totalRange = max - min;
//   const fixedMinPercent = 33;
//   const remainingPercent = 100 - fixedMinPercent;

//   const greenPercent = remainingPercent - fixedMinPercent;

//   const [labelWidth, setLabelWidth] = useState(0);
//   const onLabelLayout = (e: LayoutChangeEvent) => {
//     setLabelWidth(e.nativeEvent.layout.width);
//   };

//   return (
//     <View className="mt-1">
//       {/* Title */}
//       <TitleText className='mb-2'>{title}</TitleText>

//       <View className="relative w-full items-center">
//         {/* Floating Score Label */}
//         <View
//           onLayout={onLabelLayout}
//           className="absolute -top-8"
//           style={{
//             left: `${greenPercent + 30}%`,
//             marginLeft: -labelWidth / 2,
//           }}
//         >
//           <View className="px-4 py-1 rounded-md bg-[#34a853]">
//             <Text className="text-white text-[14px] font-normal">{score}</Text>
//           </View>
//           <View
//             className="self-center mt-[-1px]"
//             style={{
//               width: 0,
//               height: 0,
//               borderLeftWidth: 8,
//               borderRightWidth: 8,
//               borderTopWidth: 8,
//               borderLeftColor: 'transparent',
//               borderRightColor: 'transparent',
//               borderTopColor: '#34a853',
//             }}
//           />
//         </View>

//         {/* Bar */}
//         <View className="flex-row w-full h-2 rounded-full overflow-hidden bg-[#fbbc04]">
//           {/* Yellow Part */}
//           <View className="h-full" style={{ width: `${fixedMinPercent}%`, backgroundColor: '#fbbc04' }} />
//           {/* Green Part */}
//           <View className="h-full" style={{ width: `${greenPercent}%`, backgroundColor: '#34a853' }} />
//         </View>

//         {/* Min & Max Labels */}
//         <View className="flex-row justify-between w-full -mt-1">
//           <AppText className='ml-[75px]'>{min}</AppText>
//           <AppText className='mr-[75]'>{max}</AppText>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default PerformanceBar;


// import React, { useState } from 'react';
// import { View, Text, LayoutChangeEvent } from 'react-native';
// import TitleText from './TitleText';
// import AppText from './AppText';

// interface PerformanceBarProps {
//   title: string;
//   score: number;
//   min: number;
//   max: number;
// }

// const PerformanceBar: React.FC<PerformanceBarProps> = ({ title, score, min, max }) => {
//   const totalRange = max - min;
//   const fixedMinPercent = 33; // yellow bar
//   const greenPercent = 100 - fixedMinPercent;

//   const [labelWidth, setLabelWidth] = useState(0);
//   const onLabelLayout = (e: LayoutChangeEvent) => {
//     setLabelWidth(e.nativeEvent.layout.width);
//   };

//   // Position the tooltip based on score within the green range
//   const scorePercentWithinGreen = ((score - min) / (max - min)) * greenPercent;
//   const tooltipLeft = fixedMinPercent + scorePercentWithinGreen;

//   return (
//     <View className="mt-1">
//       {/* Title */}
//       <TitleText className="mb-2">{title}</TitleText>

//       <View className="relative w-full items-center">
//         {/* Floating Score Label */}
//         <View
//           onLayout={onLabelLayout}
//           className="absolute -top-8"
//           style={{
//             left: `${tooltipLeft}%`,
//             marginLeft: -labelWidth / 2,
//           }}
//         >
//           <View className="px-4 py-1 rounded-md bg-[#34a853]">
//             <Text className="text-white text-[14px] font-normal">{score}</Text>
//           </View>
//           <View
//             className="self-center mt-[-1px]"
//             style={{
//               width: 0,
//               height: 0,
//               borderLeftWidth: 8,
//               borderRightWidth: 8,
//               borderTopWidth: 8,
//               borderLeftColor: 'transparent',
//               borderRightColor: 'transparent',
//               borderTopColor: '#34a853',
//             }}
//           />
//         </View>

//         {/* Bar */}
//         <View className="flex-row w-full h-2 rounded-full overflow-hidden bg-[#fbbc04]">
//           {/* Yellow (min) */}
//           <View className="h-full" style={{ width: `${fixedMinPercent}%`, backgroundColor: '#fbbc04' }} />
//           {/* Green (range between min and max) */}
//           <View className="h-full" style={{ width: `${greenPercent}%`, backgroundColor: '#34a853' }} />
//         </View>

//         {/* Min & Max Labels under Green bar */}
//         <View className="absolute bottom-[-18px] left-0 w-full">
//           <View className="flex-row w-full justify-between">
//             {/* Min label at start of green bar */}
//             <AppText style={{ position: 'absolute', left: `${fixedMinPercent}%`, transform: [{ translateX: -10 }] }}>
//               {min}
//             </AppText>

//             {/* Max label at end of green bar */}
//             <AppText style={{ position: 'absolute', left: `100%`, transform: [{ translateX: -20 }] }}>
//               {max}
//             </AppText>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default PerformanceBar;





// import React, { useState } from 'react';
// import { View, Text, LayoutChangeEvent } from 'react-native';
// import TitleText from './TitleText';
// import AppText from './AppText';

// interface PerformanceBarProps {
//   title: string;
//   score: number;
//   min: number;
//   max: number;
// }

// const PerformanceBar: React.FC<PerformanceBarProps> = ({ title, score, min, max }) => {
//   const [labelWidth, setLabelWidth] = useState(0);

//   // Tooltip movement restricted within green area (middle 33%)
//   const greenStart = 33.33;
//   const greenWidth = 33.33;
//   const clampedScore = Math.max(min, Math.min(max, score));
//   const relativeProgress = (clampedScore - min) / (max - min); // 0 to 1
//   const tooltipLeft = greenStart + (relativeProgress * greenWidth);

//   const onLabelLayout = (e: LayoutChangeEvent) => {
//     setLabelWidth(e.nativeEvent.layout.width);
//   };

//   return (
//     <View className="mt-4">
//       {/* Title */}
//       <TitleText className="mb-2">{title}</TitleText>

//       <View className="relative w-full items-center">
//         {/* Tooltip */}
//         <View
//           onLayout={onLabelLayout}
//           className="absolute -top-8"
//           style={{
//             left: `${tooltipLeft}%`,
//             marginLeft: -labelWidth / 2,
//           }}
//         >
//           <View className="px-4 py-1 rounded-md bg-[#34a853]">
//             <Text className="text-white text-[14px] font-normal">{score}</Text>
//           </View>
//           <View
//             className="self-center mt-[-1px]"
//             style={{
//               width: 0,
//               height: 0,
//               borderLeftWidth: 8,
//               borderRightWidth: 8,
//               borderTopWidth: 8,
//               borderLeftColor: 'transparent',
//               borderRightColor: 'transparent',
//               borderTopColor: '#34a853',
//             }}
//           />
//         </View>

//         {/* Performance Bar */}
//         <View className="flex-row w-full h-2 rounded-full overflow-hidden">
//           {/* Left Yellow (Min) */}
//           <View className="h-full" style={{ width: '33.33%', backgroundColor: '#fbbc04' }} />
//           {/* Middle Green (Score) */}
//           <View className="h-full" style={{ width: '33.33%', backgroundColor: '#34a853' }} />
//           {/* Right Yellow (Max) */}
//           <View className="h-full" style={{ width: '33.33%', backgroundColor: '#fbbc04' }} />
//         </View>

//         {/* Min & Max under Green Segment */}
//         <View className="flex-row justify-between w-full -mt-1 px-[33.33%]">
//           <AppText>{min}</AppText>
//           <AppText>{max}</AppText>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default PerformanceBar;






// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, LayoutChangeEvent } from 'react-native';

// interface PerformanceBarProps {
//   title: string;
//   score: number;
//   min: number;
//   max: number;
// }

// const PerformanceBar: React.FC<PerformanceBarProps> = ({ title, score, min, max }) => {
//   const [labelWidth, setLabelWidth] = useState(0);
//   const barRef = useRef<View>(null);
//   const [barWidth, setBarWidth] = useState(0);

//   const handleLabelLayout = (event: LayoutChangeEvent) => {
//     setLabelWidth(event.nativeEvent.layout.width);
//   };

//   const handleBarLayout = (event: LayoutChangeEvent) => {
//     setBarWidth(event.nativeEvent.layout.width);
//   };

//   // Ensure score is clamped between min and max
//   const clampedScore = Math.max(min, Math.min(score, max));
//   const totalRange = max - min;

//   // Tooltip label position: Only between (score - min) to max
//   const progress = (clampedScore - min) / totalRange;
//   const labelLeft = (barWidth * progress) - (labelWidth / 2);

//   const thirdWidth = barWidth / 3;

//   return (
//     <View className="w-full">
//       <Text className="text-base font-medium mb-2">{title}</Text>

//       <View className="relative w-full h-6 rounded-full overflow-hidden flex-row" onLayout={handleBarLayout}>
//         {/* Min (Yellow - Left) */}
//         <View style={{ width: '33.33%', backgroundColor: '#fbbc04' }} />

//         {/* Score (Green - Middle) */}
//         <View style={{ width: '33.33%', backgroundColor: '#4CAF50' }} />

//         {/* Max (Yellow - Right) */}
//         <View style={{ width: '33.33%', backgroundColor: '#fbbc04' }} />
//       </View>

//       {/* Tooltip Label */}
//       {barWidth > 0 && (
//         <View
//           className="absolute top-0"
//           style={{
//             left: Math.min(barWidth - labelWidth / 2, Math.max(thirdWidth, labelLeft)),
//           }}
//           onLayout={handleLabelLayout}
//         >
//           <Text className="text-xs font-semibold text-black bg-white px-2 py-1 rounded-full border border-gray-300">
//             {score}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default PerformanceBar;







// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, LayoutChangeEvent } from 'react-native';

// interface PerformanceBarProps {
//   title: string;
//   score: number;
//   min: number;
//   max: number;
// }

// const PerformanceBar: React.FC<PerformanceBarProps> = ({ title, score, min, max }) => {
//   const [labelWidth, setLabelWidth] = useState(0);
//   const barRef = useRef<View>(null);
//   const [barWidth, setBarWidth] = useState(0);

//   const handleLabelLayout = (event: LayoutChangeEvent) => {
//     setLabelWidth(event.nativeEvent.layout.width);
//   };

//   const handleBarLayout = (event: LayoutChangeEvent) => {
//     setBarWidth(event.nativeEvent.layout.width);
//   };

//   // Ensure score is clamped between min and max
//   const clampedScore = Math.max(min, Math.min(score, max));
//   const totalRange = max - min;

//   // Tooltip label position: Only between (score - min) to max
//   const progress = (clampedScore - min) / totalRange;
//   const labelLeft = (barWidth * progress) - (labelWidth / 2);

//   const thirdWidth = barWidth / 3;

//   return (
//     <View className="w-full mt-5">
//       <Text className="text-base font-medium mb-2">{title}</Text>

//       <View className="relative w-full h-2 rounded-full overflow-hidden flex-row" onLayout={handleBarLayout}>
//         {/* Min (Yellow - Left) */}
//         <View style={{ width: '33.33%', backgroundColor: '#fbbc04' }} />

//         {/* Score (Green - Middle) */}
//         <View style={{ width: '33.33%', backgroundColor: '#4CAF50' }} />

//         {/* Max (Yellow - Right) */}
//         <View style={{ width: '33.33%', backgroundColor: '#fbbc04' }} />
//       </View>

//        {/* Min / Max Labels */}
//       <View className="flex-row justify-between mt-1 px-1">
//         <Text className="text-14 text-black ml-[82px]">{Number(min).toFixed(1)}</Text>
//         <Text className="text-black mr-[80px]">{Number(max).toFixed(1)}</Text>
//       </View>

//       {/* Tooltip Label */}
//       {barWidth > 0 && (
//      <View>
//          <View
//           className="absolute -top-[55px]    rounded-[2]"
//           style={{
//             // left: Math.min(barWidth - labelWidth / 2, Math.max(thirdWidth, labelLeft)),
//             left: Math.min(barWidth, Math.max(thirdWidth, labelLeft)),

//           }}
//           onLayout={handleLabelLayout}
//         >
//           <Text className="text-12  text-white bg-[#34a853] px-4 py-1 rounded-[6px]">
//             {score}
//           </Text>
//                  <View
//       style={{
//         width: 0,
//         height: 0,
//         borderLeftWidth: 8,
//         borderRightWidth: 8,
//         borderTopWidth: 8,
//         borderLeftColor: 'transparent',
//         borderRightColor: 'transparent',
//         borderTopColor: '#34a853',
//         marginTop: 0,
//         justifyContent : 'center',
//         marginLeft : 10
//       }}
//     />
//         </View>
      
//       </View>
        
//       )}

  
//     </View>
//   );
// };

// export default PerformanceBar;






import React, { useRef, useState } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';

interface PerformanceBarProps {
  title: string;
  score: number;
  min: number;
  max: number;
}

const PerformanceBar: React.FC<PerformanceBarProps> = ({ title, score, min, max }) => {
  const [labelWidth, setLabelWidth] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const barRef = useRef<View>(null);

  // Handle layout measurements
  const handleBarLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const handleLabelLayout = (event: LayoutChangeEvent) => {
    setLabelWidth(event.nativeEvent.layout.width);
  };

  // Clamp score between min and max
  const clampedScore = Math.max(min, Math.min(score, max));
  const totalRange = max - min;

  // Calculate section boundaries (each section is 1/3 of bar width)
  const sectionWidth = barWidth / 3;

  // Determine tooltip position
  let labelLeft: number;
  let tooltipColor: string;

  if (clampedScore <= min) {
    // Position in min section (left yellow)
    labelLeft = 0; // Align to start of min section
    tooltipColor = '#fbbc04'; // Yellow to match min section
  } else if (clampedScore >= max) {
    // Position in max section (right yellow)
    labelLeft = barWidth - labelWidth; // Align to end of max section
    tooltipColor = '#fbbc04'; // Yellow to match max section
  } else {
    // Position in score section (green)
    const progress = (clampedScore - min) / totalRange; // Progress in range [0, 1]
    // Map progress to green section (33.33% to 66.66%)
    const greenProgress = (progress * sectionWidth) + sectionWidth; // Start at second third
    labelLeft = greenProgress - (labelWidth / 2); // Center tooltip in green section
    tooltipColor = '#4CAF50'; // Green to match score section
  }

  // Ensure tooltip stays within bar boundaries
  const boundedLabelLeft = Math.max(0, Math.min(barWidth - labelWidth, labelLeft));

  return (
    <View className="w-full mt-5">
      {/* Title */}
      <Text className="text-base font-medium mb-2">{title}</Text>

      {/* Bar with three sections */}
      <View
        className="relative w-full h-2 rounded-full overflow-hidden flex-row"
        onLayout={handleBarLayout}
        ref={barRef}
      >
        {/* Min section (Yellow - Left) */}
        <View style={{ width: '33.33%', backgroundColor: '#fbbc04' }} />
        {/* Score section (Green - Middle) */}
        <View style={{ width: '33.33%', backgroundColor: '#4CAF50' }} />
        {/* Max section (Yellow - Right) */}
        <View style={{ width: '33.33%', backgroundColor: '#fbbc04' }} />
      </View>

      {/* Min and Max labels */}
      <View className="flex-row justify-between mt-1 px-1">
        {/* <Text className="text-sm text-black">{Number(min).toFixed(1)}</Text>
        <Text className="text-sm text-black">{Number(max).toFixed(1)}</Text> */}

        <Text className="text-sm text-black ml-[90px]">{Number(min).toFixed(1)}</Text>
        <Text className="text-sm text-black mr-[90px]">{Number(max).toFixed(1)}</Text>
        
      </View>

      {/* Tooltip */}
      {barWidth > 0 && (
        <View
          className="absolute -top-2"
          style={{ left: boundedLabelLeft }}
          onLayout={handleLabelLayout}
        >
          <Text
            className="text-sm text-white px-3 py-1 rounded-md"
            style={{ backgroundColor: '#34a853' }}
          >
            {Number(score).toFixed(1)}
          </Text>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 6,
              borderRightWidth: 6,
              borderTopWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: '#34a853',
              alignSelf: 'center',
            }}
          />
        </View>
      )}
    </View>
  );
};

export default PerformanceBar;
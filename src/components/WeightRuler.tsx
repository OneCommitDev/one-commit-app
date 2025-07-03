// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Dimensions,
//   TouchableOpacity,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
// } from 'react-native';

// const { width } = Dimensions.get('window');
// const ITEM_WIDTH = 14;
// const VISIBLE_ITEMS = Math.floor(width / ITEM_WIDTH);

// const generateWeights = (unit: 'kg' | 'lb') => {
//   const data = [];
//   const max = unit === 'kg' ? 200 : 440;
//   const step = 0.1;
//   for (let i = 0; i <= max; i += step) {
//     data.push(Number(i.toFixed(1)));
//   }
//   return data;
// };

// const WeightRuler = () => {
//   const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
//   const [selectedWeight, setSelectedWeight] = useState<number>(60);
//   const flatListRef = useRef<FlatList>(null);

//   const weights = generateWeights(unit);
//   const selectedIndex = weights.findIndex(w => w === selectedWeight);

//   const scrollToIndex = (index: number) => {
//     flatListRef.current?.scrollToIndex({
//       index,
//       animated: true,
//       viewPosition: 0.5,
//     });
//   };

//   const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const offsetX = event.nativeEvent.contentOffset.x;
//     const index = Math.round(offsetX / ITEM_WIDTH);
//     setSelectedWeight(weights[index]);
//   };

//   const toggleUnit = () => {
//     const newUnit = unit === 'kg' ? 'lb' : 'kg';
//     const convertedWeight =
//       unit === 'kg'
//         ? Number((selectedWeight * 2.20462).toFixed(1))
//         : Number((selectedWeight / 2.20462).toFixed(1));

//     setUnit(newUnit);
//     setSelectedWeight(convertedWeight);

//     setTimeout(() => {
//       const newWeights = generateWeights(newUnit);
//       const newIndex = newWeights.findIndex(w => w >= convertedWeight);
//       scrollToIndex(newIndex);
//     }, 50);
//   };

//   return (
//     <View className="items-center justify-center w-full mt-4">
//       {/* Toggle & Label */}
//       <View className="flex-row items-center justify-center mb-4">
//         <TouchableOpacity
//           onPress={toggleUnit}
//           className="bg-gray-200 px-4 py-2 rounded-full mr-2"
//         >
//           <Text className="text-black">{unit === 'kg' ? 'Switch to lb' : 'Switch to kg'}</Text>
//         </TouchableOpacity>
//         <Text className="text-lg font-semibold text-green-700">
//           {selectedWeight} {unit}
//         </Text>
//       </View>

//       {/* Ruler */}
//       <FlatList
//         ref={flatListRef}
//         data={weights}
//         keyExtractor={(item) => item.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         snapToInterval={ITEM_WIDTH}
//         decelerationRate="fast"
//         onMomentumScrollEnd={onScrollEnd}
//         getItemLayout={(_, index) => ({
//           length: ITEM_WIDTH,
//           offset: ITEM_WIDTH * index,
//           index,
//         })}
//         initialScrollIndex={selectedIndex}
//         contentContainerStyle={{
//           paddingHorizontal: width / 2 - ITEM_WIDTH / 2,
//         }}
//         renderItem={({ item }) => {
//           const isMajorTick = item % 1 === 0;
//           const isLabeledTick = item % 10 === 0;

//           return (
//             <View style={{ width: ITEM_WIDTH, alignItems: 'center' }}>
//               <View
//                 style={{
//                   height: isMajorTick ? 20 : 10,
//                   width: 2,
//                   backgroundColor: isMajorTick ? '#065F46' : '#9CA3AF',
//                 }}
//               />
//               {isLabeledTick && (
//                 <Text
//                   style={{
//                     fontSize: 10,
//                     marginTop: 4,
//                     color: '#4B5563',
//                     textAlign: 'center',
//                     width: 40,
//                     marginLeft: -13, // shift to center under tick
//                   }}
//                 >
//                   {item}
//                 </Text>
//               )}
//             </View>
//           );
//         }}
//       />

//       {/* Center Marker */}
//       <View
//         style={{
//           position: 'absolute',
//           top: 0,
//           bottom: 0,
//           left: width / 2 - 1,
//           width: 2,
//           backgroundColor: 'limegreen',
//         }}
//       />
//     </View>
//   );
// };

// export default WeightRuler;



 import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 16;
const VISIBLE_ITEMS = Math.floor(width / ITEM_WIDTH);
const LABEL_WIDTH = 40;

interface WeightRulerProps {
  initialUnit?: 'kg' | 'lb';
  initialValue?: number;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  onWeightChange?: (weight: number, unit: 'kg' | 'lb') => void;
}

const generateWeights = (unit: 'kg' | 'lb'): number[] => {
  const max = unit === 'kg' ? 200 : 440;
  const step = 0.1;
  return Array.from({ length: Math.floor(max / step) + 1 }, (_, i) =>
    Number((i * step).toFixed(1))
  );
};

const WeightRuler: React.FC<WeightRulerProps> = ({
  initialUnit = 'kg',
  initialValue = 60,
  primaryColor = '#007bff',
  secondaryColor = '#6b7280',
  backgroundColor = '#f3f4f6',
  onWeightChange,
}) => {
  const [unit, setUnit] = useState<'kg' | 'lb'>(initialUnit);
  const [selectedWeight, setSelectedWeight] = useState<number>(initialValue);
  const flatListRef = useRef<FlatList>(null);
  const weights = generateWeights(unit);
  const isProgrammaticScroll = useRef<boolean>(false);

const [flatListReady, setFlatListReady] = useState(false);

useEffect(() => {
  if (!flatListReady) return;

  const index = weights.findIndex((w) => Math.abs(w - selectedWeight) < 0.1);
  if (index >= 0 && index < weights.length && flatListRef.current) {
    // Delay to ensure layout is ready
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: false,
        viewPosition: 0.5,
      });
    }, 50); // small delay fixes race condition
  }
}, [unit, flatListReady]);



  useEffect(() => {
    if (onWeightChange) {
      onWeightChange(selectedWeight, unit);
    }
  }, [selectedWeight, unit]);

  const scrollToIndex = (index: number) => {
    if (!flatListRef.current || index < 0 || index >= weights.length) return;
    try {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    } catch (error) {
      console.warn('Scroll to index failed:', error);
    }
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    if (index >= 0 && index < weights.length) {
      const newWeight = weights[index];
      setSelectedWeight(newWeight);
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
      }
      AccessibilityInfo.announceForAccessibility(
        `Selected weight: ${newWeight.toFixed(1)} ${unit}`
      );
    }
  };

  const renderItem = ({ item }: { item: number }) => {
    const isMajorTick = item % 1 === 0;
    const isLabeledTick = item % 1 === 0;

    return (
      <View style={styles.tickContainer}>
        <View
          style={[
            styles.tick,
            {
              height: isMajorTick ? 26 : 12,
              backgroundColor: isMajorTick ? primaryColor : secondaryColor,
            },
          ]}
        />
        {isLabeledTick && (
          <View style={styles.labelContainer}>
            <Text style={[styles.tickLabel, { color: secondaryColor }]}>
              {item.toFixed(0)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Weight Display */}
      <View style={styles.weightContainer}>
      <Text
        style={[styles.weightText, { color: primaryColor }]}
        accessibilityLiveRegion="polite"
      >
        {selectedWeight.toFixed(1)} {unit}
      </Text>
</View>
      {/* Ruler */}
      <FlatList
      onLayout={() => setFlatListReady(true)}
        ref={flatListRef}
        data={weights}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        initialScrollIndex={weights.findIndex((w) => Math.abs(w - selectedWeight) < 0.1)}
        contentContainerStyle={styles.rulerContent}
        renderItem={renderItem}
        extraData={unit}
      />

      {/* Center Marker */}
      <View style={[styles.centerMarker, { backgroundColor: primaryColor }]} />

      {/* Floating Unit Toggle */}
      <View style={styles.unitToggleContainer}>
        <AnimatedTouchableOpacity
          style={[
            styles.unitButton,
            unit === 'kg' && styles.unitButtonActive,
          ]}
          onPress={() => {
            if (unit !== 'kg') {
              setUnit('kg');
              setSelectedWeight(Number((selectedWeight / 2.20462).toFixed(1)));
            }
          }}
          accessibilityLabel="Select kilograms"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.unitText,
              unit === 'kg' && styles.unitTextActive,
            ]}
          >
            kg
          </Text>
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity
          style={[
            styles.unitButton,
            unit === 'lb' && styles.unitButtonActive,
          ]}
          onPress={() => {
            if (unit !== 'lb') {
              setUnit('lb');
              setSelectedWeight(Number((selectedWeight * 2.20462).toFixed(1)));
            }
          }}
          accessibilityLabel="Select pounds"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.unitText,
              unit === 'lb' && styles.unitTextActive,
            ]}
          >
            lb
          </Text>
        </AnimatedTouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  weightText: {
    alignItems: 'flex-end',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:20
  },
  rulerContent: {
    paddingHorizontal: width / 2 - ITEM_WIDTH / 2,
    marginTop:30
  },
  tickContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    position: 'relative',
  },
  tick: {
    width: 2,
    borderRadius: 1,
  },
  labelContainer: {
    width: LABEL_WIDTH,
    position: 'absolute',
    alignItems: 'center',
     justifyContent: 'center',
  },
  tickLabel: {
    fontSize: 12,
    textAlign: 'center',
    width: LABEL_WIDTH,
    marginTop: 30,
  },
  centerMarker: {
    position: 'absolute',
    top: '38%',
    bottom: '38%',
    left: '50%',
    width: 3,
    transform: [{ translateX: -1.5 }],
    opacity: 0.8,
    zIndex: 1,
  },
  unitToggleContainer: {
    position: 'absolute',
    top: '38%',
    left: '45%',
    transform: [{ translateX: -60 }, { translateY: -50 }],
    flexDirection: 'row',
    backgroundColor: '#e5e7e9', // default
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 2,
    elevation: 6,
    borderColor: '#bfc9ca',
  borderWidth: 1,  
  },
  unitButton: {
    paddingVertical: 5,
    minWidth: 80,  
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#fdfefe',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  unitTextActive: {
  },


  weightContainer: {
  width: '90%',
  alignItems: 'flex-end',
  marginBottom: 20,
  marginTop:20
},

 
});

export default WeightRuler;

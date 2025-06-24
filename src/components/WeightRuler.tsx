import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 14;
const VISIBLE_ITEMS = Math.floor(width / ITEM_WIDTH);

const generateWeights = (unit: 'kg' | 'lb') => {
  const data = [];
  const max = unit === 'kg' ? 200 : 440;
  const step = 0.1;
  for (let i = 0; i <= max; i += step) {
    data.push(Number(i.toFixed(1)));
  }
  return data;
};

const WeightRuler = () => {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [selectedWeight, setSelectedWeight] = useState<number>(60);
  const flatListRef = useRef<FlatList>(null);

  const weights = generateWeights(unit);
  const selectedIndex = weights.findIndex(w => w === selectedWeight);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const onScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    setSelectedWeight(weights[index]);
  };

  const toggleUnit = () => {
    const newUnit = unit === 'kg' ? 'lb' : 'kg';
    const convertedWeight = unit === 'kg'
      ? Number((selectedWeight * 2.20462).toFixed(1))
      : Number((selectedWeight / 2.20462).toFixed(1));

    setUnit(newUnit);
    setSelectedWeight(convertedWeight);
    setTimeout(() => {
      const newWeights = generateWeights(newUnit);
      const newIndex = newWeights.findIndex(w => w >= convertedWeight);
      scrollToIndex(newIndex);
    }, 50);
  };

  return (
    <View className="items-center justify-center w-full mt-4">
      {/* Toggle & Label */}
      <View className="flex-row items-center justify-center mb-4">
        <TouchableOpacity
          onPress={toggleUnit}
          className="bg-gray-200 px-4 py-2 rounded-full mr-2"
        >
          <Text className="text-black">{unit === 'kg' ? 'Switch to lb' : 'Switch to kg'}</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-green-700">
          {selectedWeight} {unit}
        </Text>
      </View>

      {/* Ruler */}
      <FlatList
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
        initialScrollIndex={selectedIndex}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        renderItem={({ item }) => (
          <View style={{ width: ITEM_WIDTH, alignItems: 'center' }}>
            <View
              style={{
                height: item % 1 === 0 ? 20 : 10,
                width: 2,
                backgroundColor: item % 1 === 0 ? '#065F46' : '#9CA3AF',
              }}
            />
            {item % 10 === 0 && (
              <Text
                style={{
                  fontSize: 10,
                  marginTop: 4,
                  color: '#4B5563',
                }}
              >
                {item}
              </Text>
            )}
          </View>
        )}
      />

      {/* Center Marker */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: width / 2 - 1,
          width: 2,
          backgroundColor: 'limegreen',
        }}
      />
    </View>
  );
};

export default WeightRuler;

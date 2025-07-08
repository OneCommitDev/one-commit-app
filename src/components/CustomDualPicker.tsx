import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const ITEM_HEIGHT = 40;
const VISIBLE_HEIGHT = 300;
const CENTER_INDEX_OFFSET = VISIBLE_HEIGHT / 2 - ITEM_HEIGHT / 2;

export const weightValues_kg = Array.from({ length: 200 }, (_, i) => i.toString());
export const weightValues_lb = Array.from({ length: 400 }, (_, i) => i.toString());

const dividerTopOffset = VISIBLE_HEIGHT / 2 - ITEM_HEIGHT / 2;
const dividerBottomOffset = VISIBLE_HEIGHT / 2 + ITEM_HEIGHT / 2;

type Props = {
  selectedUnit: 'kg' | 'lbs';
  setSelectedUnit: (unit: 'kg' | 'lbs') => void;
  highlightedKgIndex: number;
  setHighlightedKgIndex: (index: number) => void;
  highlightedLbIndex: number;
  setHighlightedLbIndex: (index: number) => void;
  onValueChange?: (value: string, unit: 'kg' | 'lbs') => void;
};

export default function CustomDualPicker({
  selectedUnit,
  setSelectedUnit,
  highlightedKgIndex,
  setHighlightedKgIndex,
  highlightedLbIndex,
  setHighlightedLbIndex,
  onValueChange,
}: Props) {
  const renderItem = (
    item: string,
    index: number,
    highlightedIndex: number,
    isDisabled: boolean
 ) => (
    <View style={[styles.item, isDisabled && { opacity: 0.3 }]}>
      <Text
        style={[
          styles.text,
          index === highlightedIndex && !isDisabled && styles.selectedText,
        ]}
      >
        {item}
      </Text>
    </View>
  );

  const handleMomentumScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    setHighlightedIndex: (index: number) => void,
    isKg: boolean
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setHighlightedIndex(index);

    const unit = isKg ? 'kg' : 'lbs';
    const value = isKg ? weightValues_kg[index] : weightValues_lb[index];
    if (onValueChange) {
      onValueChange(`${value} ${unit}`, unit);
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>

    <View style={styles.container}>
      {/* Toggle Buttons */}
   <View style={styles.toggleContainer}>
  <TouchableOpacity
    activeOpacity={0}
    onPress={() => setSelectedUnit('lbs')}
    style={[
      styles.toggleButton,
      selectedUnit === 'lbs' && styles.toggleSelected,
    ]}
  >
    <Text style={styles.toggleText}>LBS</Text>
  </TouchableOpacity>

  <TouchableOpacity
    activeOpacity={0}
    onPress={() => setSelectedUnit('kg')}
    style={[
      styles.toggleButton,
      selectedUnit === 'kg' && styles.toggleSelected,
    ]}
  >
    <Text style={styles.toggleText}>KG</Text>
  </TouchableOpacity>
</View>


      {/* Wheels */}
      <View style={styles.row}>
        {/* LBS Wheel */}
        <View style={styles.unitContainer}>
          <Text style={styles.unitLabel}>LBS</Text>
          <View style={styles.wheelWrapper}>
            <FlatList
              data={weightValues_lb}
              keyExtractor={(item) => item}
              initialScrollIndex={highlightedLbIndex}
              renderItem={({ item, index }) =>
                renderItem(item, index, highlightedLbIndex, selectedUnit !== 'lbs')
              }
              scrollEnabled={selectedUnit === 'lbs'}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(e) =>
                handleMomentumScroll(e, setHighlightedLbIndex, false)
              }
              contentContainerStyle={{
                paddingTop: CENTER_INDEX_OFFSET,
                paddingBottom: CENTER_INDEX_OFFSET,
              }}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              style={styles.wheel}
            />
            <View style={[styles.divider, { top: dividerTopOffset }]} />
            <View style={[styles.divider, { top: dividerBottomOffset }]} />
          </View>
        </View>

        {/* KG Wheel */}
        <View style={styles.unitContainer}>
          <Text style={styles.unitLabel}>KG</Text>
          <View style={styles.wheelWrapper}>
            <FlatList
              data={weightValues_kg}
              keyExtractor={(item) => item}
              initialScrollIndex={highlightedKgIndex}
              renderItem={({ item, index }) =>
                renderItem(item, index, highlightedKgIndex, selectedUnit !== 'kg')
              }
              scrollEnabled={selectedUnit === 'kg'}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(e) =>
                handleMomentumScroll(e, setHighlightedKgIndex, true)
              }
              contentContainerStyle={{
                paddingTop: CENTER_INDEX_OFFSET,
                paddingBottom: CENTER_INDEX_OFFSET,
              }}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              style={styles.wheel}
            />
            <View style={[styles.divider, { top: dividerTopOffset }]} />
            <View style={[styles.divider, { top: dividerBottomOffset }]} />
          </View>
        </View>
      </View>
    </View>
      </SafeAreaView>

  );
}

 const styles = StyleSheet.create({
    safeArea: {
  flex: 1,
  backgroundColor: '#f0f0f0', // Full screen gray background
},
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // <-- set full screen background
    alignItems: 'center',
    paddingTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginTop:20
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    color: 'black',
    backgroundColor : '#fdfefe'
  },
  toggleSelected: {
    backgroundColor: '#d0d3d4',
  },
toggleText: {
  color: '#000', // always black
  fontWeight: 'bold',
},

  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  unitContainer: {
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 0,
  },
  wheelWrapper: {
    position: 'relative',
  },
  wheel: {
    height: VISIBLE_HEIGHT,
    width: screenWidth / 3,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 28,
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#999',
  },
});


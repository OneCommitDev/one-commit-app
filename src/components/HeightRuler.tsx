import React, { useEffect, useRef, useState } from 'react';
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

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 16;
const LABEL_WIDTH = 40;

interface HeightRulerProps {
  initialValue?: number; // in inches
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  onHeightChange?: (inches: number, formatted: string) => void;
}

const HeightRuler: React.FC<HeightRulerProps> = ({
  initialValue = 65, // 5'5"
  primaryColor = '#007bff',
  secondaryColor = '#6b7280',
  backgroundColor = '#f3f4f6',
  onHeightChange,
}) => {
  const [selectedInches, setSelectedInches] = useState<number>(initialValue);
  const flatListRef = useRef<FlatList>(null);
  const isProgrammaticScroll = useRef(false);
  const [flatListReady, setFlatListReady] = useState(false);

  const inchesArray = Array.from({ length: 97 }, (_, i) => i); // 0–96 inches

  useEffect(() => {
    if (!flatListReady) return;
    const index = inchesArray.findIndex(i => i === selectedInches);
    if (index >= 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index,
          animated: false,
          viewPosition: 0.5,
        });
      }, 50);
    }
  }, [flatListReady]);

  useEffect(() => {
    if (onHeightChange) {
      const feet = Math.floor(selectedInches / 12);
      const inches = selectedInches % 12;
      onHeightChange(
        selectedInches,
        `${feet}'${inches}"`
      );
    }
  }, [selectedInches]);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    if (index >= 0 && index < inchesArray.length) {
      const newHeight = inchesArray[index];
      setSelectedInches(newHeight);
      AccessibilityInfo.announceForAccessibility(`Selected height: ${formatHeight(newHeight)}`);
    }
  };

  const formatHeight = (inches: number) => {
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${ft}'${inch}"`;
  };

  const renderItem = ({ item }: { item: number }) => {
    const isFootMark = item % 12 === 0;

    return (
      <View style={styles.tickContainer}>
        <View
          style={[
            styles.tick,
            {
              height: isFootMark ? 26 : 12,
              backgroundColor: isFootMark ? primaryColor : secondaryColor,
            },
          ]}
        />
        {isFootMark && (
          <View style={styles.labelContainer}>
            <Text style={[styles.tickLabel, { color: secondaryColor }]}>
              {Math.floor(item / 12)}'
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Height display */}
      <View style={styles.heightContainer}>
        <Text style={[styles.heightText, { color: primaryColor }]}>
          {formatHeight(selectedInches)}
        </Text>
      </View>

      {/* Ruler */}
      <FlatList
        ref={flatListRef}
        data={inchesArray}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        onLayout={() => setFlatListReady(true)}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        contentContainerStyle={styles.rulerContent}
        renderItem={renderItem}
      />

      {/* Center Marker */}
      <View style={[styles.centerMarker, { backgroundColor: primaryColor }]} />
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
  heightContainer: {
    width: '90%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  heightText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  rulerContent: {
    paddingHorizontal: width / 2 - ITEM_WIDTH / 2,
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
});

export default HeightRuler;

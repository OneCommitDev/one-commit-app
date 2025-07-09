import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WheelPickerExpo from 'react-native-wheel-picker-expo';

const screenWidth = Dimensions.get('window').width;

type CustomDualPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedUnit: 'kg' | 'lbs';
  onUnitChange: (unit: 'kg' | 'lbs') => void;
  onSave: (mainValue: number, decimalValue: number, unit: 'kg' | 'lbs') => void;
};

export const CustomDualPickerModal: React.FC<CustomDualPickerModalProps> = ({
  visible,
  onClose,
  selectedUnit,
  onUnitChange,
  onSave,
}) => {
  const [mainIndex, setMainIndex] = useState(149); // lbs default (index for 150)
  const [decimalIndex, setDecimalIndex] = useState(0);

  // Update indexes based on unit toggle
  useEffect(() => {
    if (selectedUnit === 'kg') {
      setMainIndex(69); // index for 70
    } else {
      setMainIndex(149); // index for 150
    }
    setDecimalIndex(5); // ✅ Reset to 5 whenever modal opens or unit changes
  }, [selectedUnit, visible]);

  const generateRange = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => ({
      label: (start + i).toString(),
      value: start + i,
      key: (start + i).toString(),
    }));

  const mainItems = selectedUnit === 'kg'
    ? generateRange(1, 150) // 1 to 150 kg
    : generateRange(1, 300); // 1 to 300 lbs

  const decimalItems = generateRange(0, 9); // 0 to 9

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <View
          style={{
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 12,
            paddingBottom: 24,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>

            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>Select Weight</Text>

            <TouchableOpacity
              onPress={() => {
                const mainValue = mainItems[mainIndex]?.value ?? 1;
                const decimalValue = decimalItems[decimalIndex]?.value ?? 0;
                onSave(mainValue, decimalValue, selectedUnit);
                onClose();
              }}
            >
              <Ionicons name="checkmark" size={26} color="#235D48" />
            </TouchableOpacity>
          </View>

          {/* Toggle */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 999,
                borderWidth: 1,
                borderColor: '#ccc',
                backgroundColor: '#fff',
                overflow: 'hidden',
              }}
            >
              <TouchableOpacity
                onPress={() => onUnitChange('lbs')}
                activeOpacity={1}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  backgroundColor: selectedUnit === 'lbs' ? '#E5E7EB' : '#FFFFFF',
                }}
              >
                <Text style={{ color: '#000', fontWeight: '500' }}>LBS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onUnitChange('kg')}
                activeOpacity={1}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  backgroundColor: selectedUnit === 'kg' ? '#E5E7EB' : '#FFFFFF',
                }}
              >
                <Text style={{ color: '#000', fontWeight: '500' }}>KG</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pickers */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
              backgroundColor: '#eaeded',
            }}
          >
            <WheelPickerExpo
              key={`main-${selectedUnit}`} // ✅ forces re-render on unit switch

              height={250}
              width={screenWidth / 3}
              items={mainItems}
              initialSelectedIndex={mainIndex}
              onChange={({ index }) => setMainIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
            />

            <Text style={{ fontSize: 28, fontWeight: '600', marginHorizontal: 8 }}>.</Text>

            <WheelPickerExpo
              key={`decimal-${selectedUnit}`} // ✅ optional if you also want decimal to reset
              height={250}
              width={screenWidth / 3}
              items={decimalItems}
              initialSelectedIndex={decimalIndex}
              onChange={({ index }) => setDecimalIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: '#647067', borderWidth: 0.3 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

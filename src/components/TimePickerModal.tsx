// components/TimePickerModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const screenHeight = Dimensions.get('window').height;

type Props = {
  visible: boolean;
  initialValue?: string; // format "mm:ss:ms"
  onClose: () => void;
  onSave: (value: string) => void;
};

const TimePickerModal: React.FC<Props> = ({ visible, initialValue = "00:00:00", onClose, onSave }) => {
  const [minute, setMinute] = useState("00");
  const [second, setSecond] = useState("00");
  const [millisecond, setMillisecond] = useState("00");

  // Parse initial value
  React.useEffect(() => {
    const [mm = "00", ss = "00", ms = "00"] = initialValue.split(':');
    setMinute(mm.padStart(2, '0'));
    setSecond(ss.padStart(2, '0'));
    setMillisecond(ms.padStart(2, '0'));
  }, [initialValue]);

  const handleSave = () => {
    const value = `${minute.padStart(2, '0')}:${second.padStart(2, '0')}:${millisecond.padStart(2, '0')}`;
    onSave(value);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select Time</Text>

          <View style={styles.pickerRow}>
            <Picker
              selectedValue={minute}
              onValueChange={(itemValue) => setMinute(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
              ))}
            </Picker>
            <Text style={styles.colon}>:</Text>
            <Picker
              selectedValue={second}
              onValueChange={(itemValue) => setSecond(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
              ))}
            </Picker>
            <Text style={styles.colon}>:</Text>
            <Picker
              selectedValue={millisecond}
              onValueChange={(itemValue) => setMillisecond(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 100 }, (_, i) => (
                <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.save}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000088',
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: 80,
    height: screenHeight * 0.2,
  },
  colon: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  cancel: {
    fontSize: 16,
    color: 'gray',
  },
  save: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

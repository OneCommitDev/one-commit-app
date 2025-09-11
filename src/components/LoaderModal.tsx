// LoaderModal.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

type LoaderProps = {
  show: boolean; // 👈 renamed from 'visible' to 'show'
};

export default function LoaderModal({ show }: LoaderProps) {
  return (
    <Modal
      visible={show}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
});
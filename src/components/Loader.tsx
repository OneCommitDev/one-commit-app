// import React from 'react';
// import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

// type LoaderProps = {
//   show: boolean; // 👈 renamed from 'visible' to 'show'
// };

// export default function Loader({ show }: LoaderProps) {
//   return (
//     <Modal
//       visible={show}
//       transparent={true}
//       animationType="fade"
//       statusBarTranslucent={true}
//     >
//       <View style={styles.overlay}>
//         <ActivityIndicator size="large" color="#ffffff" />
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });



// import React from 'react';
// import {
//   View,
//   ActivityIndicator,
//   StyleSheet,
//   Modal,
//   Text,
// } from 'react-native';

// type LoaderProps = {
//   show: boolean;
//   message?: string;
// };

// export default function Loader({ show, message = 'Please wait...' }: LoaderProps) {
//   return (
//     <Modal
//       visible={show}
//       transparent
//       animationType="fade"
//       statusBarTranslucent
//     >
//       <View style={styles.overlay}>
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#124D3A" />
//           <Text style={styles.message}>{message}</Text>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)', // Slightly lighter background
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loaderContainer: {
//     width: 140,
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 8,
//   },
//   message: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#124D3A',
//     fontWeight: '500',
//     textAlign: 'center',
//   },
// });


// components/LoaderOverlay.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

type Props = { show: boolean };

export default function Loader({ show }: Props) {
  if (!show) return null; // completely unmount when not showing

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.spinnerBox}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', // semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999, // Android
  },
  spinnerBox: {
    padding: 12,
    borderRadius: 8,
      // backgroundColor: 'rgba(0,0,0,0.35)', // optional box
  },
});

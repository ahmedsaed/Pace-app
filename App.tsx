import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DemoHomeScreen from './src/app/screens/DemoHomeScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <DemoHomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});

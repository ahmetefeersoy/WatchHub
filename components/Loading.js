import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function Loading({ message }) {
  return (
    <LinearGradient
      colors={['#173d39', '#000000']} 
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
        <ActivityIndicator color="white" size="large" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute', // Ekranın tamamını kaplamak için
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
});

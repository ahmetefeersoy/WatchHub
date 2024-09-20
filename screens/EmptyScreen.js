import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';


export default function BookMarkScreen() {
  return (
    <LinearGradient colors={['#173d39', '#000000']} // Renk geçişlerini buraya ekleyin
    style={styles.gradient}>
    <View style={styles.container}>
      <Text style={styles.text}>EmptyScreen</Text>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  gradient: {
    flex:1,
  }
});

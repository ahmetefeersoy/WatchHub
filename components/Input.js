import { StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';

export default function Input({ label, keyboardType, secureTextEntry, onUpdateValue, value, isInvalid }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label,isInvalid && styles.labelInvalid]}>{label}</Text>
      <TextInput style={styles.input}

        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={onUpdateValue}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor : "white",
  },
  label: {
    color: "white",
    marginBottom: 3,
  },
  labelInvalid: {
    color: "red",
    marginBottom: 3,
  }
});

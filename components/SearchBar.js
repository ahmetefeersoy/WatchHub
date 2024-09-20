import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

export default function SearchBar({ term, onTermChange, onTermSubmit, placeholder, onClear }) {
  // Handle end of editing
  const handleEndEditing = () => {
    Keyboard.dismiss(); // Close keyboard
    if (onTermSubmit) {
      onTermSubmit(); // Trigger submit action
    }
  };

  // Handle touch outside input
  const handleTouchOutside = () => {
    Keyboard.dismiss(); // Close keyboard
    if (onTermSubmit) {
      onTermSubmit(); // Trigger submit action
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchOutside}>
      <View style={styles.backgroundStyle}>
        <AntDesign 
          style={styles.iconStyle} 
          name="search1" 
          size={30}  
          color="black" 
        />
        <TextInput 
          style={styles.inputStyle} 
          placeholder={placeholder || 'Find films'}
          autoCorrect={false}
          autoCapitalize='none'
          value={term}
          onChangeText={onTermChange}
          onEndEditing={handleEndEditing}
          onSubmitEditing={handleEndEditing}
        />
        {term.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Fontisto name="close" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: "white",
    flexDirection: "row",
    margin: 10,
    height: 40,
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  iconStyle: {
    marginHorizontal: 10,
  },
  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
  clearButton: {
    marginLeft: 10,
  },
});

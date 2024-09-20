import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function MyListDetail({ result }) {
  
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={ { uri: result.coverImageUrl } }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
   marginVertical:10,
  },
  image: {
    width: 60,
    height: 120,
    borderRadius: 8,
    marginVertical:10,
  },
 
});
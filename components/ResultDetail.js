import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function ResultDetail({ result }) {
  
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={ { uri: result.coverImageUrl } }
      />
      <Text style={styles.name}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
  },
  image: {
    width: 95,
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
  },
});
import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default function ResultDetail2({ result }) {
  
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
        marginBottom:-10, // Alt boşluk ekleyin
        alignItems: 'center', // Görseli ortalayın
      },
      image: {
        width: width/4,
        height: height/6.1,
        borderRadius: 8,
      },
      name: {
        fontWeight: 'bold',
        marginTop: 5, // Görsel ve başlık arasına boşluk ekleyin
      },
});
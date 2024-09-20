import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <View style={styles.imageview}>
      <Image
        source={require('../assets/image/Default_A_modern_sleek_logo_for_the_watchHub_film_recommendati_3-removebg.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150, 
      },
      imageview: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }
});

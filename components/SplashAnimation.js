import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashAnimation = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('WatchHub'); // 2 saniye sonra WatchHub'a yönlendirme
    }, 2000);

    return () => clearTimeout(timer); // Temizleme işlemi
  }, [navigation]);

  return (
    <LinearGradient colors={['#173d39', '#000000']} style={styles.gradient}>
      <View style={styles.container}>
        <Image
          source={require('../assets/image/setGif.gif')} // GIF dosyasını Image ile yükleme
          style={styles.gif}
        />
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
  gif: {
    width: '20%',
    height: '10%',
  },
  gradient: {
    flex: 1,
  },
});

export default SplashAnimation;

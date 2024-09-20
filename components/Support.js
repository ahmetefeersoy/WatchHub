import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView } from 'react-native';
import React from 'react';

export default function Support() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageView}>
          <Image 
            source={require('../assets/image/Default_A_modern_sleek_logo_for_the_watchHub_film_recommendati_3-removebg.png')} 
            style={styles.image} 
          />
        </View>
        <Text style={styles.header}>Support & Contact</Text>
        <Text style={styles.description}>
          If you need any assistance or have questions, please refer to the information below or contact us directly.
        </Text>
        
        <Text style={styles.subHeader}>Contact Us:</Text>
        <Text style={styles.text}>Email: iletisimwatchhub@gmail.com</Text>
        
        <Text style={styles.subHeader}>Frequently Asked Questions:</Text>
        <Text style={styles.text}>
          Q: How do I reset my password?{'\n'}
          A: Go to the 'Settings' section and click on Password & Authentication. Follow the instructions to reset your password.
        </Text>
        <Text style={styles.text}>
          Q: How can I update my account information?{'\n'}
          A: Log in to your account and go to the 'Settings' section or 'Profile' section. You can update your information.
        </Text>
        <Text style={styles.text}>
          Q: How can I delete my account?{'\n'}
          A: If you wish to delete your account, please contact us via email at iletisimwatchhub@gmail.com with your request. We will assist you in the process.
        </Text>
        <Text style={styles.text}>
          Q: How often is new content added to the app?{'\n'}
          A: We regularly update the app with new content and features. Check our app updates for the latest additions and improvements.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  imageView: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200, 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
    color: '#333',
  },
});

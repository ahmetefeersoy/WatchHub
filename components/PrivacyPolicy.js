import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>

      <Text style={styles.sectionHeader}>1. General Information</Text>
      <Text style={styles.text}>
        This Privacy Policy describes how we collect, use and protect your personal data through WatchHub Application. We have created this policy to show you how we value your privacy and how we protect your personal data.
      </Text>

      <Text style={styles.sectionHeader}>2. Data We Collect</Text>
      <Text style={styles.text}>
        Your personal data is the data we collect in the following situations:
      </Text>
      <Text style={styles.subHeader}>Identity Data:</Text>
      <Text style={styles.text}>
        Your first name, last name, email address.
      </Text>
      <Text style={styles.subHeader}>Account Information:</Text>
      <Text style={styles.text}>
        Username, password.
      </Text>
      <Text style={styles.subHeader}>Usage Data:</Text>
      <Text style={styles.text}>
        Application usage, IP address, browser information, login information.
      </Text>
      <Text style={styles.subHeader}>Communication Data:</Text>
      <Text style={styles.text}>
        Messages sent to you, feedback.
      </Text>

      <Text style={styles.sectionHeader}>3. Use of Data</Text>
      <Text style={styles.text}>
        We may use the personal data we collect for the following purposes:
      </Text>
      <Text style={styles.text}>
        • Providing, managing and improving the Application and services.
      </Text>
      <Text style={styles.text}>
        • Creating and managing user accounts.
      </Text>
      <Text style={styles.text}>
        • Sending you newsletters, promotions and other communications.
      </Text>
      <Text style={styles.text}>
        • Providing user support and receiving feedback.
      </Text>
      <Text style={styles.text}>
        • Fulfilling legal obligations and ensuring security.
      </Text>

      <Text style={styles.sectionHeader}>4. Sharing of Data</Text>
      <Text style={styles.text}>
        We may share your personal data in the following cases:
      </Text>
      <Text style={styles.text}>
        • Service Providers: We may share your data with our service providers, such as cloud service providers and payment processors. These parties may use your data only to provide our services.
      </Text>
      <Text style={styles.text}>
        • Legal Requirements: We may share your data in accordance with legal requirements or when requested by legal processes, government authorities or other competent authorities.
      </Text>
      <Text style={styles.text}>
        • Corporate Changes: We may share your data with relevant third parties in the event of a merger, acquisition or bankruptcy of our company.
      </Text>

      <Text style={styles.sectionHeader}>5. Security</Text>
      <Text style={styles.text}>
        We take appropriate technical and organizational measures to protect your personal data. However, we cannot guarantee that the methods of transmission over the Internet and electronic storage are 100% secure.
      </Text>

      <Text style={styles.sectionHeader}>6. User Rights</Text>
      <Text style={styles.text}>
        You may have the right to access your personal data and request that your data be corrected or deleted. You can submit these requests to us via [contact information].
      </Text>

      <Text style={styles.sectionHeader}>7. Children's Privacy</Text>
      <Text style={styles.text}>
        Our App is not directed to children under the age of 18. If we become aware that we have collected personal data from a child under the age of 18, we will promptly delete that data.
      </Text>

      <Text style={styles.sectionHeader}>8. Changes to Privacy Policy</Text>
      <Text style={styles.text}>
        This Privacy Policy may be updated from time to time. When any changes are made, the updated policy will be posted within the App. We encourage you to check the policy regularly for changes.
      </Text>

      <Text style={styles.sectionHeader}>9. Contact</Text>
      <Text style={styles.text}>
        If you have any questions about our privacy policy, please contact us:
      </Text>
      <Text style={styles.text}>WatchHub</Text>
      <Text style={styles.text}>iletisimwatchhub@gmail.com</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
});

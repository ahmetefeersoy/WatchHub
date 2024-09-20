import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

export default function TermsConditions() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Terms and Conditions</Text>

      <Text style={styles.sectionHeader}>1. Introduction</Text>
      <Text style={styles.text}>
        These Terms and Conditions govern your use of the WatchHub Application. By accessing or using the Application, you agree to comply with and be bound by these terms.
      </Text>

      <Text style={styles.sectionHeader}>2. Use of the Application</Text>
      <Text style={styles.text}>
        You agree to use the Application in accordance with all applicable laws and regulations. You are responsible for ensuring that your use of the Application does not violate any local, state, or federal laws.
      </Text>

      <Text style={styles.sectionHeader}>3. User Account</Text>
      <Text style={styles.text}>
        To access certain features of the Application, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
      </Text>
      <Text style={styles.text}>
        You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
      </Text>

      <Text style={styles.sectionHeader}>4. Intellectual Property</Text>
      <Text style={styles.text}>
        The content and materials provided through the Application, including but not limited to text, graphics, logos, and software, are the property of WatchHub or its licensors and are protected by intellectual property laws.
      </Text>
      <Text style={styles.text}>
        You may not reproduce, distribute, or create derivative works of any content from the Application without our prior written consent.
      </Text>

      <Text style={styles.sectionHeader}>5. Limitation of Liability</Text>
      <Text style={styles.text}>
        To the fullest extent permitted by law, WatchHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Application.
      </Text>
      <Text style={styles.text}>
        We do not guarantee the accuracy, completeness, or reliability of any content or information provided through the Application.
      </Text>

      <Text style={styles.sectionHeader}>6. Termination</Text>
      <Text style={styles.text}>
        We reserve the right to terminate or suspend your access to the Application at any time, without prior notice, for any reason, including but not limited to violations of these Terms and Conditions.
      </Text>

      <Text style={styles.sectionHeader}>7. Changes to Terms</Text>
      <Text style={styles.text}>
        We may update these Terms and Conditions from time to time. When changes are made, the updated terms will be posted within the Application. Your continued use of the Application after any changes constitutes your acceptance of the new terms.
      </Text>

      <Text style={styles.sectionHeader}>8. Governing Law</Text>
      <Text style={styles.text}>
        These Terms and Conditions shall be governed by and construed in accordance with the laws of [Your Country/State]. Any disputes arising out of or related to these terms shall be resolved in the courts located in [Your Country/State].
      </Text>

      <Text style={styles.sectionHeader}>9. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions or concerns about these Terms and Conditions, please contact us at:
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
  text: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
});

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

export default function TermAndPolicies() {
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
        These Terms and Conditions shall be governed by and construed in accordance with the laws of Turkey. Any disputes arising out of or related to these terms shall be resolved in the courts located in Turkey.
      </Text>

      <Text style={styles.sectionHeader}>9. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions or concerns about these Terms and Conditions, please contact us at:
      </Text>
      <Text style={styles.text}>WatchHub</Text>
      <Text style={styles.text}>iletisimwatchhub@gmail.com</Text>

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
  Your first name, last name, email address, phone number.
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
  text: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
});

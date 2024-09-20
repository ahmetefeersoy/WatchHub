import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONTS } from "../constants/theme";
import Loading from "../components/Loading";
import { AuthContext } from "../store/auth-context";
import { CommonActions } from "@react-navigation/native";
import TermAndPolicies from "../components/TermAndPolicies";
import Support from "../components/Support";
import { sendContactMessage } from "../util/Auth";
import Fontisto from '@expo/vector-icons/Fontisto';

const { width, height } = Dimensions.get("window");

const SettingsScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isPrivacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
  const [isTermsVisible, setTermsVisible] = useState(false);
  const [isHelpVisible, setHelpVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isContactVisible, setContactVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    authContext.logout();
    setLoading(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "WatchHub" }],
      })
    );
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  const navigateToSecurity = () => {
    navigation.navigate("SecurityScreen");
  };

  const navigateToSupport = () => {
    setHelpVisible(true);
  };

  const navigateToTermAndPolicies = () => {
    setPrivacyPolicyVisible(true);
  };

  const navigateToReportProblem = () => {
    setContactVisible(true);
  };

  const handleSendMessage = async () => {
    try {
      await sendContactMessage(firstName, lastName, message);
      setContactVisible(false);
      Alert.alert("Your message successfully sent.");
      setFirstName("");
      setLastName("");
      setMessage("");
    } catch (error) {
      // Handle the error
      console.error(error);
    }
  };

  const logout = () => {
    confirmLogout();
  };

  const closeContactModel = () => {
    setContactVisible(false);
  };

  const handleTouchOutside = () => {
    Keyboard.dismiss(); // Close keyboard
  };

  const accountItems = [
    {
      icon: "person-outline",
      text: "Edit Profile",
      action: navigateToEditProfile,
    },
    authContext.isAuthenticated
      ? {
          icon: "lock-outline",
          text: "Password & Authentication",
          action: navigateToSecurity,
        }
      : null,
  ].filter((item) => item !== null);

  const supportItems = [
    { icon: "help-outline", text: "Help & Support", action: navigateToSupport },
    {
      icon: "info-outline",
      text: "Term & Policies",
      action: navigateToTermAndPolicies,
    },
  ];

  const actionItems = [
    {
      icon: "outlined-flag",
      text: "Report & Contact Us",
      action: navigateToReportProblem,
    },
    authContext.isAuthenticated
      ? { icon: "logout", text: "Log out", action: logout }
      : null,
  ].filter((item) => item !== null);

  const renderSettingsItem = ({ item }) => (
    <TouchableOpacity onPress={item.action} style={styles.settingsItem}>
      <MaterialIcons name={item.icon} size={24} color="white" />
      <Text style={styles.settingsText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#173d39", "#000000"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Account Settings */}
        <View style={styles.accountContainer}>
          <Text style={styles.accountTitle}>Account</Text>
          <View style={styles.accountContent}>
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem({ item })}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Support Settings */}
        <View style={styles.accountContainer}>
          <Text style={styles.accountTitle}>Support & About</Text>
          <View style={styles.accountContent}>
            {supportItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem({ item })}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Action Settings */}
        <View style={styles.accountContainer}>
          <Text style={styles.accountTitle}>Actions</Text>
          <View style={styles.accountContent}>
            {actionItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem({ item })}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal for Logout Confirmation */}
      <Modal
        visible={showLogoutConfirm}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={cancelLogout}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Privacy Policy */}
      <Modal
        visible={isPrivacyPolicyVisible}
        animationType="slide"
        onRequestClose={() => setPrivacyPolicyVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer2}>
          <TermAndPolicies />
          <TouchableOpacity onPress={() => setPrivacyPolicyVisible(false)}>
            <Text style={styles.closeButton2}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal for Terms and Conditions */}
      <Modal
        visible={isTermsVisible}
        animationType="slide"
        onRequestClose={() => setTermsVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer2}>
          <TermAndPolicies />
          <TouchableOpacity onPress={() => setTermsVisible(false)}>
            <Text style={styles.closeButton2}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal for Help */}
      <Modal
        visible={isHelpVisible}
        animationType="slide"
        onRequestClose={() => setHelpVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer2}>
          <Support />
          <TouchableOpacity onPress={() => setHelpVisible(false)}>
            <Text style={styles.closeButton2}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal for Contact Us */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isContactVisible}
        onRequestClose={closeContactModel}
      >
        <TouchableWithoutFeedback onPress={handleTouchOutside}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer1}>
              <Text style={styles.modalTitle}>Contact Us</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Name"
                placeholderTextColor="lightgrey"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Surname"
                placeholderTextColor="lightgrey"
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                style={[styles.modalInput, styles.messageInput]} // Mesaj inputu için genişletilmiş stil
                placeholder="Add Message"
                placeholderTextColor="lightgrey"
                multiline={true}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeContactModel} style={styles.closeButton1}>
                <Fontisto name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Loading Screen */}
      {loading && <Loading message="Logging out, please wait..." />}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  gradient: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  accountContainer: {
    marginVertical: 10,
  },
  accountTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginLeft: 20,
  },
  accountContent: {
    marginTop: 10,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#a9a9a9",
  },
  settingsText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 20,
    fontFamily: FONTS.regular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    marginBottom: 15,
    color: 'white', // Yazı rengi beyaz
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%", // Butonlar arasındaki boşluğun tam genişliğe yayılmasını sağlar
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#006400",
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arkaplanı şeffaf yapıyoruz
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  modalContainer1: {
    backgroundColor: '#222', // Koyu bir arka plan rengi
    padding: 20,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton1: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButton2: {
    color: '#0066cc',
    marginTop: 40,
  },
  contactForm: {
    padding: 20,
  },
  messageInput: {
    height: 100,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  
  sendButton: {
    backgroundColor: "#006400",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
  messageInput: {
    height: 100, // Mesaj alanı için daha geniş bir yükseklik
    textAlignVertical: 'top',
  },

});

export default SettingsScreen;

import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput, Button } from "react-native-paper";
import {
  disableTwoFactor,
  enableTwoFactor,
  changePassword,
} from "../util/Auth";
import { AuthContext } from "../store/auth-context";
import { useNavigation } from "@react-navigation/native";

export default function SecurityScreen() {
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isTwoFactorModalVisible, setIsTwoFactorModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { token, username, logout, twoFactorEnabled } = useContext(AuthContext);
  const navigation = useNavigation();
  const [secureTextEntryCurrent, setSecureTextEntryCurrent] = useState(true);
  const [secureTextEntryNew, setSecureTextEntryNew] = useState(true);
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);

  const toggleSecureTextEntryCurrent = () =>
    setSecureTextEntryCurrent(!secureTextEntryCurrent);
  const toggleSecureTextEntryNew = () =>
    setSecureTextEntryNew(!secureTextEntryNew);
  const toggleSecureTextEntryConfirm = () =>
    setSecureTextEntryConfirm(!secureTextEntryConfirm);
  const openPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalVisible(false);
  };
  const handle2FA = async () => {
    try {
      if (twoFactorEnabled) {
        await disableTwoFactor(username);
        Alert.alert(
          "Two-Factor Authentication has been successfully disable. Please log in again."
        );
      } else {
        await enableTwoFactor(username);
        Alert.alert(
          "Two-Factor Authentication has been successfully enabled. Please log in again."
        );
      }
      setIsTwoFactorModalVisible(false);
      logout();
      navigation.navigate("WatchHub");
    } catch (error) {
      console.error("2FA error:", error);
    }
  };

  const saveAndClosePasswordModal = async () => {
    if (validatePassword()) {
      try {
        await changePassword(token,currentPassword, newPassword,username);
        closePasswordModal();
        Alert.alert("Password change successful. Please log in again.");
        logout();
        navigation.navigate("WatchHub");
      } catch (error) {
        Alert.alert("Failed to change your password. An error occurred.");
      }
    }
  };

  const openTwoFactorModal = () => {
    setIsTwoFactorModalVisible(true);
  };

  const closeTwoFactorModal = () => {
    setIsTwoFactorModalVisible(false);
  };

  const validatePassword = () => {
    const errors = [];
    if (newPassword.length < 8) {
      errors.push("• Password must be at least 8 characters.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>-_]/.test(newPassword)) {
      errors.push("• Password must contain at least ONE special character.");
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      errors.push(
        "• Password must contain at least ONE uppercase and one lowercase character."
      );
    }
    if (!/[0-9]/.test(newPassword)) {
      errors.push("• Password must contain at least ONE digit.");
    }
    if (newPassword !== confirmNewPassword) {
      errors.push("• Passwords do not match.");
    }
    if (newPassword == currentPassword) {
      errors.push("• New password cannot be the same as old password.");
    }
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const [passwordErrors, setPasswordErrors] = useState([]);

  return (
    <LinearGradient colors={["#173d39", "#000000"]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PASSWORD</Text>
          <TouchableOpacity
            style={styles.subsection}
            onPress={openPasswordModal}
          >
            <Text style={styles.title}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Two-Factor Authentication Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TWO-FACTOR AUTH</Text>
          <TouchableOpacity
            style={styles.subsection}
            onPress={openTwoFactorModal}
          >
            <Text style={styles.title}>Set up Two-Factor Authentication</Text>
          </TouchableOpacity>
        </View>
        {/* Change Password Modal */}
        <Modal
          visible={isPasswordModalVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>

              <TextInput
                label="Current Password"
                value={currentPassword}
                secureTextEntry={secureTextEntryCurrent}
                mode="outlined"
                onChangeText={setCurrentPassword}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={secureTextEntryCurrent ? "eye-off" : "eye"}
                    onPress={toggleSecureTextEntryCurrent}
                  />
                }
              />
              <TextInput
                label="New Password"
                value={newPassword}
                secureTextEntry={secureTextEntryNew}
                mode="outlined"
                onChangeText={setNewPassword}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={secureTextEntryNew ? "eye-off" : "eye"}
                    onPress={toggleSecureTextEntryNew}
                  />
                }
              />
              <TextInput
                label="Confirm New Password"
                value={confirmNewPassword}
                secureTextEntry={secureTextEntryConfirm}
                mode="outlined"
                onChangeText={setConfirmNewPassword}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={secureTextEntryConfirm ? "eye-off" : "eye"}
                    onPress={toggleSecureTextEntryConfirm}
                  />
                }
              />

              {passwordErrors.length > 0 && (
                <View style={styles.errorContainer}>
                  {passwordErrors.map((error, index) => (
                    <Text key={index} style={styles.error}>
                      {error}
                    </Text>
                  ))}
                </View>
              )}

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={saveAndClosePasswordModal}
                  style={styles.modalButton}
                >
                  Save
                </Button>
                <Button
                  mode="text"
                  onPress={closePasswordModal}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Two-Factor Authentication Modal */}
        <Modal
          visible={isTwoFactorModalVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Two-Factor Authentication</Text>
              <Text style={styles.description}>
                Two-factor authentication (2FA) adds an additional layer of
                security to your account. You will need to verify your identity
                using a second method, such as a verification code sent to your
                email.
              </Text>
              <Button
                mode="contained"
                onPress={() => {
                  handle2FA();
                  closeTwoFactorModal(); // Close modal after action
                }}
                style={[
                  styles.modalButton,
                  { backgroundColor: twoFactorEnabled ? "red" : "green" },
                ]}
              >
                {twoFactorEnabled ? "Disable" : "Enable"}
              </Button>

              <Button
                mode="text"
                onPress={closeTwoFactorModal}
                style={styles.modalButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  subsection: {
    padding: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 5,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    marginTop: 10,
  },
  errorContainer: {
    marginBottom: 10,
  },
  error: {
    fontSize: 14,
    color: "red",
  },
  description: {
    fontSize: 16,
    color: "black",
    marginBottom: 15,
    textAlign: "center",
  },
});

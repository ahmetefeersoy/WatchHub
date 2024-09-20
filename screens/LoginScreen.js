import React, { useState, useContext, useRef } from 'react';
import { StyleSheet, Alert, View, TextInput, Button, Modal, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AuthContent from '../components/AuthContent';
import { createUser, loginAccount, verify2FA } from '../util/Auth'; 
import Loading from '../components/Loading';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../store/auth-context';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  // Refs for the 2FA input fields
  const inputRefs = useRef([]);

  async function signUpHandler({ username, email, password }) {
    try {
      setIsAuthenticating(true);
      setIsRegistering(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const token1 = await createUser(username, email, password);
      // authContext.authenticate(token1, username);
      setIsAuthenticating(false);
      setIsRegistering(false);
      Alert.alert('Successful!', 'Verification email sent. Please check your email.');
      setIsLogin(true);
    } catch (error) {
      setIsAuthenticating(false);
      setIsRegistering(false);
      Alert.alert('Error!', error.message);
    }
  }

  async function loginHandler({ username, password }) {
    try {
      setIsAuthenticating(true);
      setIsLoggingIn(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      const response = await loginAccount(username, password);
      if (response.twoFactorRequired) {
        authContext.setTwoFactorEnabled(true);
        setUsername(username); 
        setShow2FAModal(true);
        setIsAuthenticating(false);
        setIsLoggingIn(false);
        return; 
      }else{
        authContext.setTwoFactorEnabled(false);
        authContext.authenticate(response.token, username);
      }

      setIsAuthenticating(false);
      setIsLoggingIn(false);
      Alert.alert('Successful!', 'Logged in successfully!');
    } catch (error) {
      setIsAuthenticating(false);
      setIsLoggingIn(false);
      Alert.alert('Error!', error.message);
    }
  }

  async function verify2FACode() {
    try {
      setIsAuthenticating(true);
      const token3= await verify2FA(username, verificationCode);
      setVerificationCode('')
      setShow2FAModal(false);
      setIsAuthenticating(false);
      authContext.authenticate(token3, username);
      Alert.alert('Successful!', 'Logged in successfully!');
      // Navigate or update context after successful 2FA verification
    } catch (error) {
      setIsAuthenticating(false);
      Alert.alert('Error!', error.message);
    }
  }

  const handleCodeChange = (index, value) => {
    const newVerificationCode = verificationCode.split('');
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode.join(''));

    // Move to the next field
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  if (isAuthenticating) {
    if (isRegistering) {
      return <Loading message="Creating a user..." />;
    } else if (isLoggingIn) {
      return <Loading message="Logging in..." />;
    }
  }

  return (
    <LinearGradient colors={['#173d39', '#000000']} style={styles.gradient}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AuthContent 
          isLogin={isLogin}
          onAuthenticateSignUp={signUpHandler}
          onAuthenticateLogin={isLogin ? loginHandler : undefined} 
        />
        <Modal visible={show2FAModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter the code from the verification email</Text>
            <View style={styles.codeContainer}>
              {Array.from({ length: 6 }, (_, index) => (
                <TextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  value={verificationCode[index] || ''}
                  onChangeText={text => handleCodeChange(index, text)}
                  maxLength={1}
                  keyboardType="numeric"
                  style={styles.input}
                />
              ))}
            </View>
            <Button title="Verify" onPress={verify2FACode} />
            <Button title="Cancel" onPress={() => setShow2FAModal(false)} />
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background with transparency
    padding: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: 40,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginHorizontal: 5,
    textAlign: 'center',
    backgroundColor: 'white',
    fontSize: 18,
  },
});

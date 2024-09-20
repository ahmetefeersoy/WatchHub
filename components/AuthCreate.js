import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch,Modal, Image, SafeAreaView,  } from 'react-native';
import Input from './Input';
import JoinButton from './JoinButton';
import { LinearGradient } from 'expo-linear-gradient';
import PrivacyPolicy from '../components/PrivacyPolicy';
import TermsConditions from '../components/TermsConditions';

export default function AuthCreate({ isLogin, onsubmitCreate, credentialsInValid }) {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPass, setEnteredPass] = useState('');
    const [enteredPassConfirm, setEnteredPassConfirm] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isPrivacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
    const [isTermsVisible, setTermsVisible] = useState(false);

    
   

    function submitHandlerCreate() {
        if (!enteredEmail || !enteredPass || !enteredPassConfirm || !enteredUsername) {
            alert('Please fill in all the required fields.');
            return;
        }
        if (enteredPass.length < 8 || !/[!@#$%^&*(),.?":{}|<>-_]/.test(enteredPass) || !/[A-Z]/.test(enteredPass) || !/[a-z]/.test(enteredPass) || !/[0-9]/.test(enteredPass)) {
            alert('Password does not meet the required criteria.');
            return;
        }
        if (enteredPass !== enteredPassConfirm) {
            alert('Passwords do not match.');
            return;
        }   
        if (!isAgreed) {
            alert('You must agree to the Privacy Policy and Terms and Conditions.');
            return;
        }
      // Call the onsubmitCreate function
    onsubmitCreate({
        email: enteredEmail,
        username: enteredUsername,
        password: enteredPass,
        confirmPassword: enteredPassConfirm,
    });
    }

    function updateInput(inputType, enteredValue) {
        switch (inputType) {
            case 'email':
                setEnteredEmail(enteredValue);
                break;
            case 'password':
                setEnteredPass(enteredValue);
                break;
            case 'passwordConfirm':
                setEnteredPassConfirm(enteredValue);
                break;
            case 'username':
                setEnteredUsername(enteredValue);
                break;
        }
    }

    return (
        <LinearGradient colors={['#173d39', '#000000']} style={styles.gradient}>
            <View style={styles.container}>
                <SafeAreaView>
                    <View style={styles.imageView}>
                        <Image 
                            source={require('../assets/image/Default_A_modern_sleek_logo_for_the_watchHub_film_recommendati_3-removebg.png')} 
                            style={styles.image} 
                        />
                    </View>
                </SafeAreaView>
                <View>
                    <Input 
                        label="Email" 
                        keyboardType="email-address" 
                        onUpdateValue={updateInput.bind(this, 'email')} 
                        value={enteredEmail}
                        autoCapitalize='none' 
                        autoCorrect={false}
                    />                    
                    <Input 
                        label="Username" 
                        onUpdateValue={updateInput.bind(this, 'username')}
                        value={enteredUsername} 
                        autoCapitalize='none' 
                        autoCorrect={false}
                    />
                    
                    <Input 
                        label="Password" 
                        secureTextEntry
                        onUpdateValue={updateInput.bind(this, 'password')}
                        value={enteredPass}
                        autoCorrect={false}
                        autoCapitalize='none' 
                        autoCompleteType='off'  // Otomatik şifre önerilerini kapatır
                    />
                    
                    <Input 
                        label="Confirm Password" 
                        secureTextEntry
                        onUpdateValue={updateInput.bind(this, 'passwordConfirm')}
                        value={enteredPassConfirm}
                        autoCorrect={false}
                        autoCapitalize='none' 
                        autoCompleteType='off'  // Otomatik şifre önerilerini kapatır
                    />
                    
                    {enteredPass.length < 8 && <Text style={styles.error}>• Password must be at least 8 characters.</Text>}
                    {!/[!@#$%^&*(),.?":{}|<>-_]/.test(enteredPass) && <Text style={styles.error}>• Password must contain at least ONE special character.</Text>}
                    {!/[A-Z]/.test(enteredPass) && !/[a-z]/.test(enteredPass) && <Text style={styles.error}>• Password must contain at least ONE uppercase and one lowercase character.</Text>}
                    {enteredPass !== enteredPassConfirm && <Text style={styles.error}>• Passwords do not match.</Text>}
                    {!/[0-9]/.test(enteredPass) && <Text style={styles.error}>• Password must contain at least ONE digit.</Text>}
                </View>
                <View style={styles.checkboxContainer}>
                <Switch
                        value={isAgreed}
                        onValueChange={setIsAgreed}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isAgreed ? "#0066cc" : "#f4f3f4"}
                    />

                    <Text style={styles.checkboxText}>
                        I have read and agree to
                        <Text style={styles.link} onPress={() => setPrivacyPolicyVisible(true)}> Privacy Policy</Text> and
                        <Text style={styles.link} onPress={() => setTermsVisible(true)}> Terms and Conditions</Text>
                    </Text>
                </View>
                <View style={styles.buttons}>
                    <JoinButton onPress={submitHandlerCreate}>
                        {!isLogin ? "Create Account" : "Login"}
                    </JoinButton>
                </View>

                {/* Modal for Privacy Policy */}
                <Modal
                    visible={isPrivacyPolicyVisible}
                    animationType="slide"
                    onRequestClose={() => setPrivacyPolicyVisible(false)}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        <PrivacyPolicy />
                        <TouchableOpacity onPress={() => setPrivacyPolicyVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Modal>

                {/* Modal for Terms and Conditions */}
                <Modal
                    visible={isTermsVisible}
                    animationType="slide"
                    onRequestClose={() => setTermsVisible(false)}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        <TermsConditions />
                        <TouchableOpacity onPress={() => setTermsVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Modal>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    buttons: {
        marginTop: 80,
    },
    image: {
        width: 150,
        height: 150, 
    },
    imageView: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: -5,
        flex: 1,
    },
    error: {
        color: 'white',
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 5,
    },
    gradient: {
        flex: 1,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    checkboxText: {
        marginLeft: 8,
        color: 'white',
    },
    link: {
        color: '#0066cc',
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    closeButton: {
        color: '#0066cc',
        marginTop: 20,
    },
    modalText: {
        fontSize: 16,
        color: '#000',
    },
});

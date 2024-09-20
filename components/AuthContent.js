import { StyleSheet, Text, View, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import ButtonWhite from '../components/ButtonWhite';
import AuthCreate from '../components/AuthCreate';
import { useNavigation } from '@react-navigation/native';

export default function AuthContent({ isLogin, onAuthenticateSignUp, onAuthenticateLogin }) {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    function switchScreen() {
        if (isLogin) {
          setModalVisible(true);
        } else {
          navigation.navigate("WatchHub");
        }
    }

    function closeModal() {
        setModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <AuthForm isLogin={isLogin} onsubmitLogin={isLogin ? onAuthenticateLogin : onAuthenticateSignUp} />
            <View>
                <ButtonWhite onPress={switchScreen}>
                    <Text style={{ color: "grey" }}>
                        {isLogin ? (
                            <>
                                <Text>Want to join WatchHub?</Text>
                                {'\n'}
                                <Text style={styles.boldText}>Sign up now.</Text>
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Text>
                </ButtonWhite>
            </View>

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <AuthCreate
                        isLogin={false}
                        onsubmitCreate={onAuthenticateSignUp}
                    />
                    <Button title="Close" onPress={closeModal} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        elevation: 4,
        shadowColor: "black",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
    },
    modalContainer: {
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    boldText: {
        fontWeight: 'bold',
        color: "white",
    },
});

import { StyleSheet, View, Image } from 'react-native';
import React, { useState } from 'react';
import Input from './Input';
import JoinButton from './JoinButton';

export default function AuthForm({ isLogin, onsubmitLogin }) {
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPass, setEnteredPass] = useState('');

  function submitHandlerLogin() {
    onsubmitLogin({
      username: enteredUsername,
      password: enteredPass,
    });
  }

  function updateInput(inputType, enteredValue) {
    if (inputType === 'username') {
      setEnteredUsername(enteredValue);
    } else if (inputType === 'password') {
      setEnteredPass(enteredValue);
    }
  }

  return (
    <View>
      <Image 
        source={require('../assets/image/Default_A_modern_sleek_logo_for_the_watchHub_film_recommendati_3-removebg.png')} 
        style={styles.image} 
      />
      <Input 
        label="Username" 
        keyboardType="default" 
        onUpdateValue={updateInput.bind(this, 'username')} 
        value={enteredUsername}
      />
      <Input 
        label="Password" 
        secureTextEntry 
        onUpdateValue={updateInput.bind(this, 'password')}
        value={enteredPass} 
      />
      <View style={styles.buttons}>
        <JoinButton onPress={submitHandlerLogin}>
          {isLogin ? "Login" : "Create Account"}
        </JoinButton>
      </View>  
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300, 
    marginBottom: 20, 
  },
});

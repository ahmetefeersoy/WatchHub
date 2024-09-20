import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

export default function JoinButton({ children, onPress }) {
  return (
    <Pressable style={({pressed})=>[styles.button,
    pressed && styles.pressed]}
    onPress={onPress}>
        <View>
            <Text style={styles.text}>{children}</Text>
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 20,
        marginHorizontal: 70,
    },
    pressed: {
        opacity: 0.5,
    },
    text: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
    }
})
import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';

export default function ButtonWhite({ children, onPress }) {
    return (
        <Pressable style={({pressed})=>[styles.button,
        pressed && styles.pressed]}
        onPress={onPress}
        >
            <View>
                <Text style={styles.text}>{children}</Text>
            </View>
        </Pressable>
      )
    }

const styles = StyleSheet.create({
    button: {
        padding: 5,
        borderRadius: 20,
        marginHorizontal: 70,
        marginVertical: 8,
    },
    pressed: {
        opacity: 0.5,
    },
    text: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
    }
});

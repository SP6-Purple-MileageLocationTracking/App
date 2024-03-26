/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, TextInput, TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';



const onPressSignUp = () => {
    console.log('Sign Up Pressed')
};

const onPressSignIn = () => {
    console.log('Already Has An Account Pressed')

};

export default function CreateAccount({ navigation }) {

    const [state, setState] = useState({
        email: ' ',
        password: ' ',
        name: ' ',
    })
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                    placeholder="Name"
                    placeholderTextColor="#f2d15f"
                // onChangeText={text => setState({ name: text })}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#f2d15f"
                // onChangeText={text => setState({ email: text })}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#f2d15f"
                // onChangeText={text => setState({ password: text })}
                />
            </View>
            <TouchableOpacity onPress={onPressSignUp}>
                <Text style={styles.loginText}>Sign Up Now!</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressSignIn}>
                <Text style={styles.forgotAndSignUpText}>Already have an Account? Click Here!</Text>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3D3648',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: "bold",
        fontSize: 50,
        marginBottom: 40,
        color: "#f2d15f",
    },
    inputView: {
        width: "80%",
        backgroundColor: "#201d25",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        height: 50,
        color: "white",
    },
    forgotAndSignUpText: {
        color: "white",
        fontSize: 11,
    },
    loginText: {
        width: "80%",
        backgroundColor: "#201d25",
        color: "#f2d15f",
        borderRadius: 25,
        justifyContent: "center",
        alignContent: "center",
        padding: 20,
        marginTop: 40,
        marginBottom: 10,
    },
});
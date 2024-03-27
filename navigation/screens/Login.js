/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, TextInput, TouchableOpacity, 
} from 'react-native';
import React, { useState } from 'react';





export default function Login({ navigation }) {

    const onPressLogin = () => {
        console.log('Login Pressed')
        navigation.navigate("MainContainer")
    };
    
    const onPressForgotPassword = () => {
        console.log('ForgotPassword Pressed')
        // Look Into Custom Dialogs with React Native, Alerts don't allow text input to be placed in them - Z
    };
    
    const onPressCreateAccount = () => {
        console.log('CreateAccount Pressed')
        navigation.navigate("CreateAccount")
    };

    const [state, setState] = useState({
        email: ' ',
        password: ' ',
    })
    return(
    <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
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
            <TouchableOpacity onPress={onPressLogin}>
                <Text style={styles.loginText}>Login Now</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressForgotPassword}>
                <Text style={styles.forgotAndSignUpText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressCreateAccount}>
                <Text style={styles.forgotAndSignUpText}>Create Account</Text>
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
        color:"white",
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
        alignContent:"center",
        padding: 20,
        marginTop: 40,
        marginBottom: 10,
    },
  });
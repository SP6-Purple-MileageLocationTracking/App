/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, TextInput, TouchableOpacity, Modal
} from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';






export default function Login({ navigation }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const onPressLogin = async () => {
        console.log('Login Pressed')
        console.log('Sign Up Pressed')
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth,email,password)
            navigation.navigate("MainContainer")
            console.log(response)
        } catch(error) {
            setIsModalVisible(true)
            console.log(error)
        } finally {
            setLoading(false);
        }
    };
    
    const onPressForgotPassword = () => {
        console.log('ForgotPassword Pressed')
        // Look Into Custom Dialogs with React Native, Alerts don't allow text input to be placed in them - Z
    };
    
    const onPressCreateAccount = () => {
        console.log('CreateAccount Pressed')
        navigation.navigate("CreateAccount")
    };

    
    return(
    <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#f2d15f"
                    onChangeText={text => setEmail(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#f2d15f"
                    onChangeText={text => setPassword(text)}
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


        <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide" transparent={true}>
            <View style ={styles.bottomView}>
                <Text style={styles.modalText}>Log In Failed</Text>
                <TouchableOpacity onPress={()=>setIsModalVisible(false)}>
                    <Text style={styles.modalButton}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>


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
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',

    },
    bottomView: {
        width: "100%",
        borderRadius: 20,
        backgroundColor: "#201d25",
        justifyContent: "center",
        alignContent:"center",
        paddingBottom: 20,
        position: "absolute",
        bottom: 0
    },
    modalText: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
        color: "white",
        textAlign: 'center'
    },
    modalButton: {
        backgroundColor: "#201d25",
        color: "#f2d15f",
        justifyContent: "center",
        alignContent:"center",
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center',
    },

  });
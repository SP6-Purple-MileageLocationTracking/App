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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore'; 
import Ionicons from 'react-native-vector-icons/Ionicons'





export default function CreateAccount({ navigation }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [loading,setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const onPressSignUp = async () => {
        console.log('Sign Up Pressed')
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth,email,password)
            await createUserCollection(response.user.uid, name, email);
            navigation.navigate("MainContainer")
            console.log(response)
        } catch(error) {
            console.log(error)
            setIsModalVisible(true)
        } finally {
            setLoading(false);
        }
    };

    const createUserCollection = async (userId, name, email) => {
        try {
            const userRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = await addDoc(userRef, {
                userId: userId,
                name: name,
                email: email
            });
            console.log('User collection created successfully');
        } catch (error) {
            console.error('Error creating user collection: ', error);
        }
    };
    
    const onPressSignIn = () => {
        console.log('Already Has An Account Pressed')
        navigation.navigate("Login")
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                    placeholder="Name"
                    placeholderTextColor="#f2d15f"
                onChangeText={text => setName(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#f2d15f"
                    autoCapitalize='none'
                onChangeText={text => setEmail(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor="#f2d15f"
                    autoCapitalize='none'
                onChangeText={text => setPassword(text)}
                />
            </View>
            <TouchableOpacity onPress={onPressSignUp}>
                <Text style={styles.loginText}>Sign Up Now!</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressSignIn}>
                <Text style={styles.forgotAndSignUpText}>Already have an Account? Click Here!</Text>
            </TouchableOpacity>

            <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide" transparent={true}>
            <View style ={styles.bottomView}>
                <Text style={styles.modalText}>Account Creation Failed</Text>
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
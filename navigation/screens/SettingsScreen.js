/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';

import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, PermissionsAndroid, TouchableOpacity, TextInput
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, updatePassword, updateEmail, verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";



export default function SettingsScreen({navigation}) {
    const [SettingsScreen, setSettingsScreen] = useState(true)
    const [AccountScreen, setAccountScreen] = useState(false)
    const [PasswordScreen, setPasswordScreen] = useState(false)
    const [EmailScreen, setEmailScreen] = useState(false)
    const [LoginScreen, setLoginScreen] = useState(false)
    const [CurrentScreen, setCurrentScreen] = useState('Settings')
    const [NewPassword, setNewPassword] = useState('')
    const [ConfirmPassword, setConfirmPassword] = useState('')
    const [NewEmail, setNewEmail] = useState('')
    const [ConfirmEmail, setConfirmEmail] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const auth = getAuth();
    const user = auth.currentUser;

    const onPressAccount = () => {
        setSettingsScreen(false)
        setAccountScreen(true)
        setCurrentScreen('Account')
    };

    const onPressChangePassword = () => {
        setAccountScreen(false)
        setPasswordScreen(true)
        setCurrentScreen('Password')
    };

    const onPressChangeEmail = () => {
        setAccountScreen(false)
        setEmailScreen(true)
        setCurrentScreen('Email')
    };

    const onPressBack = () => {
        switch(CurrentScreen) {
            case 'Account':
                setAccountScreen(false)
                setSettingsScreen(true)
                setCurrentScreen('Settings')
                break;
            case 'Password':
                setPasswordScreen(false)
                setAccountScreen(true)
                setCurrentScreen('Account')
                break;
            case 'Email':
                setEmailScreen(false)
                setAccountScreen(true)
                setCurrentScreen('Account')
                break;
            default:
                break;
        }
        
    };

    const onPressSetPassword = () => {
        if (NewPassword == ''){
            Alert.alert('Password can\'t be empty')
        }
        else if (NewPassword == ConfirmPassword) {
            updatePassword(user, NewPassword).then(() => {
                Alert.alert('Password Set!')
                setNewPassword('')
                setConfirmPassword('')
                setPasswordScreen(false)
                setSettingsScreen(true)
                setCurrentScreen('Settings')
              }).catch((error) => {
                if (error.message == "Firebase: Error (auth/requires-recent-login).") {
                    ReLogin()
                }
                else if (error.message == "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                    Alert.alert('Password should be at least 6 characters')
                }
              });
        }
        else {
            Alert.alert('Passwords don\'t match')
        }

    };

    const onPressSetEmail = () => {
        if (NewEmail == ''){
            Alert.alert('Email can\'t be empty')
        }
        else if (NewEmail == ConfirmEmail) {
            verifyBeforeUpdateEmail(user, NewEmail).then(() => {
                Alert.alert('Check new email acount for link to verify and confirm new email!')
                setNewEmail('')
                setConfirmEmail('')
                setEmailScreen(false)
                setSettingsScreen(true)
                setCurrentScreen('Settings')
                }).catch((error) => {
                if (error.message == "Firebase: Error (auth/requires-recent-login).") {
                    ReLogin()
                }
                else if (error.message == "Firebase: Error (auth/invalid-new-email)."){
                    Alert.alert("Invalid Email Address")
                }
            });
        }
        else {
            Alert.alert('Emails don\'t match')
        }

    };

    const onPressSignOut = () => {
        auth.signOut().then(() => {
            setAccountScreen(false)
            setSettingsScreen(true)
            setCurrentScreen('Settings')
            Alert.alert('Successfully Logged Out!')
            navigation.navigate("Login")
          }).catch((error) => {
            console.error('Sign Out Error', error);
          });
    };

    const ReLogin = () => {
        if (CurrentScreen == "Password"){
            setPasswordScreen(false)
            setLoginScreen(true)
        }
        else if (CurrentScreen == "Email"){
            setEmailScreen(false)
            setLoginScreen(true)
        }
    }

    const onPressLogin = () => {
        credential = EmailAuthProvider.credential(
            Email, 
            Password
        );
        reauthenticateWithCredential(user, credential).then(() => {
            if (CurrentScreen == "Email"){
                setLoginScreen(false)
                onPressSetEmail()
            }
            else if (CurrentScreen == "Password"){
                setLoginScreen(false)
                onPressSetPassword()
            }
            setEmail('')
            setPassword('')
            }).catch((error) => {
            console.log(error.message)
        });
    }

    return(

        <View style={styles.container}>
            {SettingsScreen && (
            <View style={styles.container}>
                <Text style={styles.headerText}>Settings</Text>
                <View style={styles.line}></View>
                <TouchableOpacity onPress={onPressAccount} style={styles.button}>
                        <MaterialCommunityIcons name="account-circle-outline" size={65} color="#f2d15f" />
                        <Text style={styles.buttonText}>Account</Text>
                        <MaterialCommunityIcons name="chevron-right" size={65} color="#f2d15f" />
                </TouchableOpacity>
            </View>
            )}
            {AccountScreen && (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
                            <MaterialCommunityIcons name="chevron-left" size={65} color="#f2d15f" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Account</Text>
                </View>
                <View style={styles.line}></View>
                
                <TouchableOpacity onPress={onPressChangePassword} style={styles.button}>
                        <MaterialCommunityIcons name="form-textbox-password" size={65} color="#f2d15f" />
                        <Text style={styles.buttonText}>Change Password</Text>
                        <MaterialCommunityIcons name="chevron-right" size={65} color="#f2d15f" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressChangeEmail} style={styles.button}>
                        <MaterialCommunityIcons name="email-edit-outline" size={65} color="#f2d15f" />
                        <Text style={styles.emailText}>Change Email</Text>
                        <MaterialCommunityIcons name="chevron-right" size={65} color="#f2d15f" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressSignOut} style={styles.button}>
                        <Ionicons name="exit-outline" size={65} color="#f2d15f" />
                        <Text style={styles.signOutText}>Sign Out</Text>
                        <MaterialCommunityIcons name="chevron-right" size={65} color="#f2d15f" />
                </TouchableOpacity>
            </View>
            )}
            {PasswordScreen && (
            <View style={styles.container}>
                 <View style={styles.header}>
                    <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
                            <MaterialCommunityIcons name="chevron-left" size={65} color="#f2d15f" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Account</Text>
                </View>
                <View style={styles.line}></View>
                <Text style={styles.title}>Change Password</Text>
                <View style={styles.inputView}>
                    <TextInput style={styles.inputText}
                        secureTextEntry={true}
                        placeholder="New Password"
                        placeholderTextColor="#f2d15f"
                        autoCapitalize='none'
                        onChangeText={text => setNewPassword(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput style={styles.inputText}
                        secureTextEntry={true}
                        placeholder="Confirm Password"
                        placeholderTextColor="#f2d15f"
                        autoCapitalize='none'
                        onChangeText={text => setConfirmPassword(text)}
                    />
                </View>
                <TouchableOpacity onPress={onPressSetPassword}>
                    <Text style={styles.loginText}>Set Password</Text>
                </TouchableOpacity>
            </View>
            )}
            {EmailScreen && (
            <View style={styles.container}>
                 <View style={styles.header}>
                    <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
                            <MaterialCommunityIcons name="chevron-left" size={65} color="#f2d15f" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Account</Text>
                </View>
                <View style={styles.line}></View>
                <Text style={styles.title}>Change Email</Text>
                <View style={styles.inputView}>
                    <TextInput style={styles.inputText}
                        placeholder="New Email"
                        placeholderTextColor="#f2d15f"
                        autoCapitalize='none'
                        onChangeText={text => setNewEmail(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput style={styles.inputText}
                        placeholder="Confirm Email"
                        placeholderTextColor="#f2d15f"
                        autoCapitalize='none'
                        onChangeText={text => setConfirmEmail(text)}
                    />
                </View>
                <TouchableOpacity onPress={onPressSetEmail}>
                    <Text style={styles.loginText}>Set Email</Text>
                </TouchableOpacity>
            </View>
            )}
            {LoginScreen && (
            <View style={styles.container}>
                 <View style={styles.headerWithoutBack}>
                    <Text style={styles.headerText}>Account</Text>
                </View>
                <View style={styles.line}></View>
                <Text style={styles.title}>Verify Login</Text>
                <View style={styles.inputView}>
                    <TextInput style={styles.inputText}
                        placeholder="Current Email"
                        placeholderTextColor="#f2d15f"
                        autoCapitalize='none'
                        onChangeText={text => setEmail(text)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput style={styles.inputText}
                        secureTextEntry={true}
                        placeholder="Current Password"
                        placeholderTextColor="#f2d15f"
                        autoCapitalize='none'
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <TouchableOpacity onPress={onPressLogin}>
                    <Text style={styles.loginText}>Verify</Text>
                </TouchableOpacity>
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3D3648',
      alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent:'left',
        alignItems: 'center',
        marginLeft: -110,
    },
    headerWithoutBack: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent:'center',
    },
    backButton: {
        marginRight: 50,
        marginTop: 65,
    },
    headerText: {
        fontSize: 50,
        color: '#f2d15f',
        marginTop: 65,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent:'left',
        alignItems: 'center',
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
      },
    buttonText: {
        fontSize: 35,
        color: '#f2d15f',
        marginLeft: 25,
        marginRight: 90,
    },
    signOutText: {
        fontSize: 35,
        color: '#f2d15f',
        marginLeft: 20,
        marginRight: 100,
    },
    emailText: {
        fontSize: 35,
        color: '#f2d15f',
        marginLeft: 25,
        marginRight: 30,
    },
    line: {
        width: 900,
        height: 2,
        backgroundColor: '#292530',
        marginTop: 10,
    },
    title: {
        fontSize: 35,
        marginTop: 30,
        marginBottom: 20,
        color: "#f2d15f",
    },
    inputView: {
        width: 300,
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
  

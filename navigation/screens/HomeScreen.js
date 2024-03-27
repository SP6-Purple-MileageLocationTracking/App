/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, TouchableOpacity,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'


export default function HomeScreen({navigation}) {

    const onPressStart = () => {
        console.log('Start Pressed')
    };


    return(
        <View style={styles.container}>
            <View style={styles.currentTrip}></View>
                <TouchableOpacity onPress={onPressStart} style={styles.startTrip}>
                    <Ionicons name="add-outline" size={30} color="#f2d15f" />
                    <Text style={styles.startText}>Start Trip</Text>
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
    currentTrip: {
        width: '90%',
        flexDirection: 'row',
        height: 300,
        backgroundColor: '#211D26',
        borderRadius: 20,
    },
    startTrip: {
        width: "50%",
        backgroundColor: "#201d25",
        color: "#f2d15f",
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: "center",
        alignContent:"center",
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    startText: {
        color: "#f2d15f",
        marginLeft: 5,
    },
  });
  
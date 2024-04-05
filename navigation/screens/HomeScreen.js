/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, TouchableOpacity, 
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'



export default function HomeScreen({navigation}) {

    const [tripStarted, setTripStarted] = useState(false)
    const [tripPlay, setTripPlay] = useState(false)

    const [date, setDate] = useState('')
    const [startLoc, setStartLoc] = useState('')
    const [time, setTime] = useState('')
    const [dis, setDis] = useState(0)

    const onPressStart = () => {
        //put start location code here -S
        setDate('3/6/24');
        setStartLoc('Tampa, FL')
        setTime('6:23')
        setDis(472)
        //
        console.log('Start Pressed')
        setTripPlay(true);
        setTripStarted(true);
    };

    const onPressPause = () => {
        //Stop keeping track of time/location when this button is pressed -S
        setTripPlay(false);
        console.log('Pause Pressed')
    };

    const onPressPlay = () => {
        //Resume keeping track of time/location when this button is pressed -S
        setTripPlay(true);
        console.log('Play Pressed')
    };

    const onPressEnd = () => {
        //the end button will send trip data to the database
        //put that code here -S
        console.log('End Pressed')
        setTripPlay(false);
        setTripStarted(false);
    };


    return(
        <View style={styles.container}>
            <View style={styles.currentTrip}>
            {tripStarted && (
                    <SafeAreaView style={{flexDirection:'column', marginTop: 20}}>
                        <Text style={styles.headerText}>{date}</Text>
                        <Text style={styles.headerText}>Left From: {startLoc}</Text>

                        <SafeAreaView style={{marginLeft: 35, marginTop: 25, marginBottom: 30}}>
                            <SafeAreaView style={{flexDirection:'row'}}>
                                <Ionicons name="time-outline" size={30} color="#f2d15f" />
                                <Text style={styles.infoText}>Time:</Text>
                                <Text style={styles.numText}>{time}</Text>
                            </SafeAreaView>

                            <SafeAreaView style={{flexDirection:'row',marginTop:15,}}>
                                <Ionicons name="car-outline" size={30} color="#f2d15f" />
                                <Text style={styles.infoText}>Distance:</Text>
                                <Text style={styles.numText}>{dis}</Text>
                            </SafeAreaView>
                        </SafeAreaView>

                    </SafeAreaView>
            )}
            </View>
            <View style={styles.buttonContainer}>
                {!tripStarted && (
                <TouchableOpacity onPress={onPressStart} style={styles.startTrip}>
                    <Ionicons name="add-outline" size={40} color="#f2d15f" />
                    <Text style={styles.startText}>Start Trip</Text>
                </TouchableOpacity>
                )}
                {tripStarted &&(
                    <View style={styles.buttonContainer}>
                    {tripPlay &&(
                     <TouchableOpacity onPress={onPressPause} style={styles.tripButtons}>
                        <Ionicons name="pause-outline" size={40} color="#f2d15f" />
                        <Text style={styles.startText}>Pause Trip</Text>
                    </TouchableOpacity>
                    )}
                    {!tripPlay &&(
                     <TouchableOpacity onPress={onPressPlay} style={styles.tripButtons}>
                        <Ionicons name="play-outline" size={40} color="#f2d15f" />
                        <Text style={styles.startText}>Play Trip</Text>
                    </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={onPressEnd} style={styles.tripButtons}>
                        <Ionicons name="stop-circle-outline" size={40} color="#f2d15f" />
                        <Text style={styles.startText}>End Trip</Text>
                    </TouchableOpacity>
                    </View>
                )}
            </View>
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
        height: '30%',
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
        fontSize: 20,
        color: "#f2d15f",
        marginLeft: 5,
    },
    buttonContainer: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    tripButtons: {
        width: "45%",
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
        marginHorizontal: 5
    },
    headerText: {
        fontSize: 25,
        color: "#f2d15f",
        marginHorizontal: 30,
        marginVertical: 5,
    },

    infoText: {
        fontSize: 20,
        color: "#f2d15f",
        marginHorizontal: 10,
    },
    numText: {
        fontSize: 20,
        color: "#FFFFFF",
    },
  });
  
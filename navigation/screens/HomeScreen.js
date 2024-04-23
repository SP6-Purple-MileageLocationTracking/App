/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
//import Geolocation from 'react-native-geolocation-service';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, TouchableOpacity, PermissionsAndroid 
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, addDoc, getDocs, query, where, serverTimestamp, setLogLevel } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { userId } from '../../FirebaseConfig';
import { hasServicesEnabledAsync } from 'expo-location';

Location.setGoogleApiKey("AIzaSyDCPuhY1_x2p9wCwUBtoy4ZDhNmoPSlpNY")




export default function HomeScreen({navigation}) {
    
    
    const [errorMsg, setErrorMsg] = useState(null);
    const [startLocLat, setStartLocLat] = useState(null);
    const [startLocLong, setStartLocLong] = useState(null);
    const [endLocLat, setEndLocLat] = useState(null);
    const [endLocLong, setEndLocLong] = useState(null);
    const [tripStarted, setTripStarted] = useState(false)
    const [tripPlay, setTripPlay] = useState(false)
    const [date, setDate] = useState('')
    const [startLoc, setStartLoc] = useState('')
    const [endLoc, setEndLoc] = useState('')
    const [time, setTime] = useState(0)
    const [displayTime, setDisplayTime] = useState('00:00:00')
    const countRef = useRef(null);
    const [dis, setDis] = useState(0)


    //Don't Move
    const [location, setLocation] = useState(null);
    const [rawStartLocation, setRawStartLocation] = useState(null);
    const [rawendLocation, setRawEndLocation] = useState(null);


    useEffect(() => {
        setDisplayTime(timer(time));

    }, [time]);

    TaskManager.defineTask("LOCATION_TASK_NAME", ({ data: { locations }, error }) => {
        if (error) {
            // check `error.message` for more details.
            return;
        }
        console.log('Received new locations', locations);
    });


    const startLocationTracking = async () => {
        await Location.startLocationUpdatesAsync("LOCATION_TASK_NAME", {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 0,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "Location Tracking",
                notificationBody: "Tracking Location for Time vs Milage Calculation.",
                notificationColor: "#FF0000",
            },
            pausesUpdatesAutomatically: false,
            deferredUpdatesInterval: 1000,
            deferredUpdatesDistance: 0,
            deferredUpdatesTimeout: 1000,
        });
    };


    //FIXED onPressStart!!!
    const onPressStart = async () => {
        try {
            const { status } = await Location.requestBackgroundPermissionsAsync();

            if (status !== 'granted') {
                console.log("Location Permission Denied");
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            console.log('Start location:', location.coords.latitude, location.coords.longitude);

            //Setting Start Location State Variables
            setStartLocLat(location.coords.latitude);
            setStartLocLong(location.coords.longitude);

            //Setting Raw Starting Location Data
            setRawStartLocation(location);

            setDate('3/6/24');
            setStartLoc('Tampa, FL')
            countRef.current = setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);

            setDis(472.2)
            //
            console.log('Start Pressed')
            setTripPlay(true);
            setTripStarted(true);

        } catch (error) {
            console.error('Error starting trip:', error);
            // Handle error (e.g., show alert)
        }
    };

    //FIXED onPressEnd!!!
    const onPressEnd = async () => {
        //the end button will send trip data to the database
        //put that code here (return displayTime to database not Time,
        //time stores raw seconds while displayTime is formated) -S
        try {
            // Stopping Timer
            setDisplayTime(timer(time))
            clearInterval(countRef.current);

            //Fetching End Location Data
            const { status } = await Location.requestBackgroundPermissionsAsync();

            if (status !== 'granted') {
                console.log("Location Permission Denied");
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            console.log('Start location:', location.coords.latitude, location.coords.longitude);

            //Setting End Location State Variables
            setEndLocLat(location.coords.latitude);
            setEndLocLong(location.coords.longitude);

            //Setting Raw End Location Data
            setRawEndLocation(location);
            console.log(location);
            //Saving Trip Data to Firestore
            saveTripData();

            //Resetting Trip-related State Variables
            setTripStarted(false);
            setTripPlay(false);
            setTime(0);

            

            console.log('Trip ended successfully');

        } catch (error) {
            console.log("Error Ending Trip");
        }
        console.log('End Pressed');
    };

    const onPressPause = () => {
        //Stop keeping track of time/location when this button is pressed -S
        clearInterval(countRef.current);
        setTripPlay(false);
        console.log('Pause Pressed')
    };

    const onPressPlay = () => {
        //Resume keeping track of time/location when this button is pressed -S
        countRef.current = setInterval(() => {
            setTime((time) => time + 1);
        }, 1000);
        setTripPlay(true);
        console.log('Play Pressed')
    };



    const saveTripData =  async () => {
        try {
            const userRef = collection(FIRESTORE_DB, 'users');
            console.log("user again",userId)
            const id = query(userRef, where('userId', '==', userId));
            const idSnapshot = await getDocs(id)
            if(!idSnapshot.empty) {
                const userDoc = idSnapshot.docs[0]
                const tripDataRef = collection(userDoc.ref, "trips")
                const tripDocRef = await addDoc(tripDataRef, {
                    date: date,
                    startLoc: startLoc,
                    endLoc: endLoc,
                    startLocLat: startLocLat,
                    startLocLong: startLocLong,
                    endLocLat: endLocLat,
                    endLocLong: endLocLong,
                    time: displayTime, 
                    distance: dis,
                    createdAt: serverTimestamp()
                });
            }
            console.log('Trip data added successfully');
        } catch (error) {
            console.error('Error adding trip data:', error);
        }
    };

    const timer = (t) => {
        const hours = Math.floor(t / 3600);
        const minutes = Math.floor((t%3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        console.log('Saved Time: ', displayTime);
    }, [displayTime]);


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
                                <Text style={styles.numText}>{timer(time)}</Text>
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
  
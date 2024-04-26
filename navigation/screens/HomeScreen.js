/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
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


const GOOGLE_MAPS_API_KEY = 'AIzaSyDCPuhY1_x2p9wCwUBtoy4ZDhNmoPSlpNY';
Location.setGoogleApiKey(GOOGLE_MAPS_API_KEY);

const getLocationFromCoords = async (latitude, longitude) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.data && response.data.results && response.data.results.length > 0) {
            const locationInfo = response.data.results[0];
            const formattedAddress = locationInfo.formatted_address;
            return formattedAddress;
        } else {
            return 'Location not found';
        }
    } catch (error) {
        console.error('Error fetching location:', error);
        return 'Error fetching location';
    }
};


export default function HomeScreen({navigation}) {
    const [errorMsg, setErrorMsg] = useState(null);
    const [tripStarted, setTripStarted] = useState(false)
    const [tripPlay, setTripPlay] = useState(false)
    const [date, setDate] = useState('')
    const [startLoc, setStartLoc] = useState('')
    const [endLoc, setEndLoc] = useState('')
    const [time, setTime] = useState(0)
    const [displayTime, setDisplayTime] = useState('00:00:00')
    const countRef = useRef(null);
    const [dis, setDis] = useState(0)
    const [disableButton, setDisableButton] = useState(false)

    //Don't Move
    const [location, setLocation] = useState(null);
    const [rawStartLocation, setRawStartLocation] = useState(null);
    const [rawEndLocation, setRawEndLocation] = useState(null);
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [startLocLat, setStartLocLat] = useState(null);
    const [startLocLong, setStartLocLong] = useState(null);
    const [endLocLat, setEndLocLat] = useState(null);
    const [endLocLong, setEndLocLong] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const intervalRef = useRef(null);

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

    // Function to calculate distance between two coordinates using Haversine formula
    const calculateDistance = async (prevLocation, newLocation) => {
        try {
            const R = 6371e3; // metres
            const lat1 = prevLocation.latitude * Math.PI / 180; // in radians
            const lat2 = newLocation.latitude * Math.PI / 180;
            const latChange = (newLocation.latitude - prevLocation.latitude) * Math.PI / 180;
            const longChange = (newLocation.longitude - prevLocation.longitude) * Math.PI / 180;

            const a = Math.sin(latChange / 2) * Math.sin(latChange / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(longChange / 2) * Math.sin(longChange / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = R * c; // in meters
            return distance;
        } catch (error) {
            console.error('Error calculating distance:', error);
            return 0;
        }
    };


    const startLocationTracking = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Location permission denied');
                return;
            }

            setIsTracking(true);

            // Start continuous location updates
            Location.startLocationUpdatesAsync('LOCATION_TASK_NAME', {
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 10, // Minimum distance (in meters) to trigger location update
            });

            let prevLocation = null;

            // Set interval to update current location and calculate distance traveled
            intervalRef.current = setInterval(async () => {
                const location = await Location.getLastKnownPositionAsync();
                setCurrentLocation(location);

                if (location) {
                    // Calculate distance between current location and previous location
                    if (prevLocation) {
                        const newLocation = {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        };
                        const distance = await calculateDistance(prevLocation, newLocation);
                        // Convert distance from meters to miles
                        const distanceInMiles = distance * 0.000621371; // 1 meter = 0.000621371 miles
                        setDis(prevDistance => prevDistance + distanceInMiles); // Update distance traveled

                        //Print Distance in Console
                        console.log('Distance traveled:', distanceInMiles.toFixed(2), 'miles');

                    }

                    // Set current location as the new previous location
                    prevLocation = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    };
                }
            }, 5000); // Update location and log every 5 seconds (adjust as needed)
        } catch (error) {
            console.error('Error starting location tracking:', error);
        }
    };

    // Function to stop location tracking
    const stopLocationTracking = async () => {
        try {
            setIsTracking(false);

            // Stop location updates and clear interval
            await Location.stopLocationUpdatesAsync('LOCATION_TASK_NAME');
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        } catch (error) {
            console.error('Error stopping location tracking:', error);
        }
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
            const { latitude, longitude } = location.coords;

            // Setting Start Location State Variables
            setStartLocLat(latitude);
            setStartLocLong(longitude);
            setRawStartLocation(location);

            // Fetching and setting the starting address and getting current date
            const address = await getLocationFromCoords(latitude, longitude);
            setStartAddress(address);
            const currentDate = new Date().toLocaleDateString();

            // Extract city and state from the address (assuming address format is "City, State, Country")
            const addressParts = address.split(', ');
            const cityState = `${addressParts[1]}, ${addressParts[2]}`; // City, State

            // Displaying the starting address in the console
            console.log('Starting Address:', address);

            // Additional logic for starting the trip...
            setDate(currentDate);
            setStartLoc(cityState);
            countRef.current = setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);

            // Start location tracking
            startLocationTracking();
            setDis(0);
            console.log('Start Pressed');
            console.log('Start Location Latitude / Longitude:', latitude, longitude);
            setTripPlay(true);
            setTripStarted(true);
        } catch (error) {
            console.error('Error starting trip:', error);
            // Handle error (e.g., show alert)
        }
    };

    //FIXED onPressEnd!!!
    const onPressEnd = async () => {
        try {
            setDisableButton(true);
            // Stop the timer and update display time
            setDisplayTime(timer(time));
            clearInterval(countRef.current);

            // Request foreground location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Location permission denied');
                return;
            }

            // Fetch current position (end location)
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            console.log('End location:', latitude, longitude);

            // Fetch address from coordinates
            const address = await getLocationFromCoords(latitude, longitude);

            console.log('Ending Address:', address);

            // Extract city and state from the address (assuming address format is "City, State, Country")
            const addressParts = address.split(', ');
            const cityState = `${addressParts[1]}, ${addressParts[2]}`; // City, State

            console.log('End Location (City, State):', cityState);

            // Calculate Distance between Start and End in Meters
            //const distance = await calculateDistance(rawStartLocation.coords, location.coords);

            console.log("Total Distance Travelled: ", dis.toFixed(2), " miles.");
            
            // Save trip data to Firestore
            await saveTripData(cityState, latitude, longitude, dis);

            // Reset trip-related state variables after saving trip data
            setTripStarted(false);
            setTripPlay(false);
            setTime(0);

            console.log('Trip ended successfully');

            // Stop location tracking
            stopLocationTracking();
        } catch (error) {
            console.error('Error ending trip:', error);
        }
        console.log('End Pressed');
        setDisableButton(false);
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


    const saveTripData =  async (cityState,latitude,longitude) => {
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
                    endLoc: cityState,
                    startLocLat: startLocLat,
                    startLocLong: startLocLong,
                    endLocLat: latitude,
                    endLocLong: longitude,
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
                                <Text style={styles.infoText}>Distance: {dis.toFixed(2)} miles</Text>
                                
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

                    <TouchableOpacity onPress={onPressEnd} style={styles.tripButtons} disabled={disableButton}>
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
        minHeight: '30%',
        backgroundColor: '#211D26',
        borderRadius: 20,
        paddingVertical: 20
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
  
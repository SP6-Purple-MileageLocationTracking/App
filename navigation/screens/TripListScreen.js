import {
    StyleSheet, View, SafeAreaView,
    Text, TextInput, 
    TouchableOpacity
} from 'react-native';
import React, {useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, getDocs, query, where, orderBy} from 'firebase/firestore'; 
import { userId } from '../../FirebaseConfig';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const API_ENDPOINT = `https://randomuser.me/api/?results=30`;

export default function TripListScreen({navigation}) {

    const [trips, setTrips] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getTrips();
        }, [])
    );

    const getTrips = async () =>{
        try {
            const userRef = collection(FIRESTORE_DB, 'users');
            console.log("user again",userId)
            const id = query(userRef, where('userId', '==', userId));
            const idSnapshot = await getDocs(id)
            if(!idSnapshot.empty) {
                const userDoc = idSnapshot.docs[0]
                const tripDataRef = await getDocs(query(collection(userDoc.ref, "trips"), orderBy('createdAt', 'asc')));
                const storeTrips =  tripDataRef.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTrips(storeTrips);
            }
            else{
                console.log("No Trips collection")
            }
        } catch (error) {
            console.error('Error getting trips:', error);
        }
    }

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleSelection = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const OneTrip = React.memo(( {item} ) => {
        //console.log("Rendering Trip:", item);

        //altering date and locations so they fit in the container
        const start = item.startLoc
        const startCity = start.substring(0,4);
        const splitStart = start.split(',');
        const startState = splitStart[1].substring(0,3);
        
        const end = item.endLoc
        const endCity = end.substring(0,4);
        const splitEnd = end.split(',');
        const endState = splitEnd[1].substring(0,3);

        const date = item.date
        const splitDate = date.split('/')
        const month = splitDate[0];
        const day = splitDate[1];
        const year = splitDate[2].substring(2); 

            return(
                <View style={styles.tripContainer} key={item.id}>
                    {!selectionMode && (
                        <Ionicons name="location-sharp" size={35} color="#f2d15f" />
                    )}
                    {selectionMode && (
                        <CheckBox
                            onPress={() => toggleSelection(item.id)}
                            size={25}
                            checkedIcon='check-square'
                            uncheckedIcon='square-o'
                            checkedColor='#f2d15f'
                            uncheckedColor='#3D3648'
                            checked={selectedItems.includes(item.id)}
                            containerStyle={styles.checkBox}
                        />
                    )}
                    <View style={styles.tripDataContainer}>
                        <View style={styles.tripDataContainerRow}>
                            <Text style={styles.tripText}>{month}/{day}/{year}  </Text>
                            <View style={styles.divider}></View>
                            <Text style={styles.tripText}>  {startCity}, {startState}</Text>
                            <Ionicons name="chevron-forward" size={30} color="#f2d15f"/>
                            <Text style={styles.tripText}>{endCity}, {endState} </Text>
                        </View>
                        <View style={styles.tripDataContainerRow}>
                            <Ionicons name="time-outline" size={30} color="#f2d15f"/>
                            <Text style={styles.tripNums}> {item.time}</Text>
                            <Ionicons name="car-sharp" size={30} color="#f2d15f"/>
                            <Text style={styles.tripDis}> {item.distance}mi</Text>
                        </View>
                    </View>
                </View>
            );
    });

    const onPressUpload = () => {
        console.log('upload Pressed')
        setSelectionMode(selectMode => !selectMode);
    };

    const generatePDF = async (selectedTrips) => {
        try {
            const tableRows = selectedTrips.map(trip => `
                <tr>
                    <td>${trip.date}</td>
                    <td>${trip.startLoc}</td>
                    <td>${trip.endLoc}</td>
                    <td>${trip.time}</td>
                    <td>${trip.distance}</td>
                </tr>
            `).join('');
    
            const format = `
                <html>
                    <head>
                        <style>
                            table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            th, td {
                                border: 1px solid #000;
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f2d15f;
                            }
                        </style>
                    </head>
                    <body>
                        <h1 style="text-align: center;">Trip Report</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Start Location</th>
                                    <th>End Location</th>
                                    <th>Time</th>
                                    <th>Distance</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;
    
            const pdf = await Print.printToFileAsync({ html: format });
            const pdfUri = pdf.uri;
    
            const localUri = `${FileSystem.documentDirectory}trip_report.pdf`;
            await FileSystem.moveAsync({
                from: pdfUri,
                to: localUri,
            });
    
            return localUri;
        } catch (error) {
            console.error('Error with PDF:', error);
            return null;
        }
    };
    
    //This is the function that will create a pdf, make sure to use selectedTrips
    //for pdf creation, it is a list of trips with all the info for each trip within it
    const onPressCreatePDF = async () => {
        console.log('pdf Pressed')
        setSelectionMode(selectMode => !selectMode);
        const selectedTrips = selectedItems.map(itemId => {
            return trips.find(item => item.id === itemId);
        });

        const pdfUri = await generatePDF(selectedTrips);
        if (pdfUri) {
            await Sharing.shareAsync(pdfUri);
        } else {
            console.log('Failed to generate PDF');
        }
        selectedTrips.forEach(selectedTrip => {
            console.log(selectedTrip);
        });
    };

const [searchQuery, setSearchQuery] = useState('');

//handles changes in the query
const handleSearch = (query) => {
  setSearchQuery(query);
};

//filteredTrips is the trips based on what you type in the search bar
const filteredTrips = trips.filter(trip =>
  trip.startLoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
  trip.endLoc.toLowerCase().includes(searchQuery.toLowerCase())
);
    return(
        <SafeAreaView style={styles.container}>
            
            <SafeAreaView style={styles.top}>
                <TextInput 
                style={[styles.searchBox, { color: '#f2d15f' }]}
                placeholder="Search"
                clearButtonMode ="always"
                autoCapitalize = "none"
                autoCorrect={false}
                placeholderTextColor={"#f2d15f"}
                value = {searchQuery}
                onChangeText = {(query) => handleSearch(query)}
                />

                {!selectionMode && (
                <TouchableOpacity onPress={onPressUpload} style={styles.upload}>
                    <Ionicons name="share-outline" size={35} color="#f2d15f" />
                </TouchableOpacity>
                )}
                {selectionMode && (
                <TouchableOpacity onPress={onPressUpload} style={styles.uploadAlt}>
                    <Ionicons name="share-outline" size={35} color="#211D26" />
                </TouchableOpacity>
                )}
            </SafeAreaView>        
                
            <View style={styles.headerContainer}>
                <Text style={styles.tripText}></Text>
            </View>

            <SafeAreaView style={styles.listSection}>
                <FlatList
                    style={styles.listContainer}
                    data = {filteredTrips}
                    renderItem={({ item }) => <OneTrip item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />
            </SafeAreaView> 
            {selectionMode && (
                <SafeAreaView style={styles.uploadOverlay}>
                    <Text style={styles.overlayText}>{selectedItems.length}</Text>
                    <Text style={styles.overlayText}>Trips Selected</Text>
                    <TouchableOpacity onPress={onPressCreatePDF} style={styles.pdf}>
                        <Text style={styles.pdfText}>Create PDF</Text>
                        <Ionicons name="document-outline" size={25} color="#211D26" />
                    </TouchableOpacity>
                </SafeAreaView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: '#3D3648',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    tripContainer: {
        flexDirection: 'row',
        backgroundColor: '#201d25',
        padding: 5,
        marginBottom: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    tripDataContainer: {
        flexDirection: 'column',
    },
    tripDataContainerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    tripDataContainerCol: {
        flexDirection: 'col',
        alignItems: 'center',
        marginHorizontal: 10 
    },
    tripText: {
        color: '#f2d15f',
        fontSize: 20, 
        //marginVertical: 10, 
    },
    tripNums: {
        color: '#FFFFFF',
        fontSize: 20, 
        marginVertical: 10,
        marginRight: 10 
    },
    tripDis: {
        color: '#FFFFFF',
        fontSize: 20, 
        marginVertical: 10, 
    },
    divider: {
        backgroundColor: '#f2d15f',
        height: '60%',
        width: '2%',
        borderRadius: 20,
    },
    listContainer:{
        maxHeight:'83%',
        bottom: '30%',
    },
    headerContainer:{
        position: 'relative',
        backgroundColor: '#FF0000',
    },
    listSection: {
        position: 'relative',
        top: '33%',
    },
    searchBox: {
        backgroundColor: '#211D26',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor:"#211D26",
        borderWidth: 1,
        borderRadius: 20,
        width:'75%',
    },
    upload: {
        backgroundColor: '#211D26',
        flexDirection: 'row',
        marginLeft: 15,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        padding: 10,
    },
    uploadAlt: {
        backgroundColor: '#f2d15f',
        flexDirection: 'row',
        marginLeft: 15,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        padding: 10,
    },
    top: {
        backgroundColor: '#3D3648',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor:"#211D26",
        borderRadius: 20,
        top: '20%',
    },
    checkBox: {
        padding: 0
    },
    uploadOverlay: {
        width: '100%',
        flexDirection: 'row',
        height: '8%',
        backgroundColor: '#211D26',
        position: 'absolute',
        bottom: 0,
    },
    pdf: {
        backgroundColor: '#f2d15f',
        flexDirection: 'row',
        marginRight: 15,
        marginLeft: 80,
        marginVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        padding: 5,
        right: '10',
    },
    pdfText: {
        fontSize: 15,
        color: "#201d25",
        marginLeft: 5,
    },
    overlayText: {
        fontSize: 20,
        color: "#FFFFFF",
        marginLeft: 15,
        marginVertical: 15,
    },
  });
  
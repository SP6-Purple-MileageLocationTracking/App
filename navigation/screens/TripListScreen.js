/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, TextInput, ActivityIndicator, Image, TouchableOpacity
} from 'react-native';
import React from 'react';
import { FlatList, GestureHandlerRootView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Directions } from 'react-native-gesture-handler';

const API_ENDPOINT = `https://randomuser.me/api/?results=30`;

export default function TripListScreen({navigation}) {

    const trips = [
        {
            id: 1,
            date: '3 / 6 / 24',
            start: 'ATL',
            end: 'TPA',
            mileage: 24.4,
            dist: 400,
        },
        {
            id: 2,
            date: '3 / 6 / 24',
            start: 'ALB',
            end: 'LAX',
            mileage: 120,
            dist: 2800,
        },
        {
            id: 3,
            date: '3 / 6 / 24',
            start: 'MDW',
            end: 'HOU',
            mileage: 82.5,
            dist: 1000,
        },
        {
            id: 4,
            date: '3 / 6 / 24',
            start: 'MIA',
            end: 'SEA',
            mileage: 150.7,
            dist: 3000,
        },
        {
            id: 5,
            date: '3 / 6 / 24',
            start: 'Den',
            end: 'PHX',
            mileage: 60.2,
            dist: 800,
        },
        {
            id: 6,
            date: '3 / 6 / 24',
            start: 'BOS',
            end: 'SFO',
            mileage: 123.8,
            dist: 2900,
        },
        {
            id: 7,
            date: '3 / 6 / 24',
            start: 'DAL',
            end: 'MCO',
            mileage: 93.6,
            dist: 1100,
        },
        {
            id: 8,
            date: '3 / 6 / 24',
            start: 'DCA',
            end: 'LAS',
            mileage: 140.5,
            dist: 2400,
        },
        {
            id: 9,
            date: '3 / 6 / 24',
            start: 'PHL',
            end: 'SAN',
            mileage: 127.2,
            dist: 2700,
        },
        {
            id: 10,
            date: '3 / 6 / 24',
            start: 'HOU',
            end: 'PWM',
            mileage: 185.3,
            dist: 3200,
        },
        {
            id: 11,
            date: '3 / 6 / 24',
            start: 'SEA',
            end: 'MIA',
            mileage: 150.7,
            dist: 3000,
        },
        {
            id: 12,
            date: '3 / 6 / 24',
            start: 'LAX',
            end: 'ALB',
            mileage: 120,
            dist: 2800,
        },
        {
            id: 13,
            date: '3 / 6 / 24',
            start: 'SFO',
            end: 'BOS',
            mileage: 123.8,
            dist: 2900,
        },
        {
            id: 14,
            date: '3 / 6 / 24',
            start: 'MCO',
            end: 'DAL',
            mileage: 93.6,
            dist: 1100,
        },
    ];

    const oneTrip = ( {item} ) => {
        console.log("Rendering Trip:", item);
            return(
                <View style={styles.tripContainer} key={item.id}>
                    <Ionicons name="location-sharp" size={50} color="#f2d15f" />
                    <View style={styles.tripDataContainer}>
                        <View style={styles.tripDataContainerRow}>
                            <Text style={styles.tripText}>{item.date}   </Text>
                            <View style={styles.divider}></View>
                            <Text style={styles.tripText}>   {item.start}</Text>
                            <Ionicons name="chevron-forward" size={30} color="#f2d15f"/>
                            <Text style={styles.tripText}>{item.end} </Text>
                        </View>
                        <View style={styles.tripDataContainerRow}>
                            <Ionicons name="car-sharp" size={30} color="#f2d15f"/>
                            <Text style={styles.tripNums}> {item.mileage}mi/gal </Text>
                            <Ionicons name="car-sharp" size={30} color="#f2d15f"/>
                            <Text style={styles.tripNums}> {item.dist}mi</Text>
                        </View>
                    </View>
                </View>
            );
    };

    const onPressUpload = () => {
        console.log('upload Pressed')
        navigation.navigate("PDFGenerator")
    };

    console.log("Trips:", trips); // Log the entire trips array

    /*for the search bar -Alex*/

    /*
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [fullData, setFullData] = useState([]);
     const [searchQuery, setSearchQuery] = useState("");
    */
     
     /*
     useEffect(() => {
        setIsLoading(true);
        fetchData(API_ENDPOINT);
     }, []);
    */

     /*This will fetch  */
     /*
     const fetchData = async(url) => {
        try {
            const response = await fetch(url);
            const json = await respond.json();
            setData(json.results);

            console.log(json.results);
            setIsLoading(false);

        }catch(error)
        {
            setError(error);
            console.log(error)
            setIsLoading(false);
        }
     }
    const handleSearch = (query) =>{
        setSearchQuery(query);
    }

    if ( isLoading )
    {
        return (
            <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} color ="#5500dc" />
            </View>
        );
    }

    if( error ) {
        return (
            <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text> Error in fetching data ...</Text>
            </View>
        )
    }
    */
    return(
        <SafeAreaView style={styles.container}>
            
            <SafeAreaView style={styles.top}>
                <TextInput 
                style={styles.searchBox}
                placeholder="Search"
                clearButtonMode ="always"
                autoCapitalize = "none"
                autoCorrect={false}
                placeholderTextColor={"#f2d15f"}
                //value = {searchQuery}
                //onChangeText = {(query) => handleSearch(query)}
                />

                <TouchableOpacity onPress={onPressUpload} style={styles.upload}>
                    <Ionicons name="share-outline" size={35} color="#f2d15f" />
                </TouchableOpacity>
            </SafeAreaView>        
                
                <FlatList
                /* This isn't finished but this is supposed to go to the API to decide which trip to get -Alex

                data = {data}
                keyExtractor = {(item) => item.login.userName}
                renderItem = {({item}) => (
                    <View style={styles.listContainer}>
                        <Image source ={{uri: item.picture.thumbnail}} />
                        <View>
                            <Text>{item.name.first} {item.name.last}</Text>
                            <Text>{item.email}</Text>
                        </View>
                    </View>
                )}
                */
            />
            

            <View style={styles.headerContainer}>
                <Text style={styles.tripText}></Text>
            </View>

            <SafeAreaView style={styles.listSection}>
                <FlatList
                    style={styles.listContainer}
                    data = {trips}
                    renderItem = {oneTrip}
                    keyExtractor={(item) => item.id.toString()}
                />
            </SafeAreaView>
        
            
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
        marginLeft: 20,
    },
    tripText: {
        color: '#f2d15f',
        fontSize: 24, 
        marginVertical: 10, 
    },
    tripNums: {
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
        bottom: '20%',
    },
    headerContainer:{
        position: 'relative',
        backgroundColor: '#FF0000',
    },
    listSection: {
        position: 'relative',
        top: '30%',
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
    top: {
        backgroundColor: '#3D3648',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor:"#211D26",
        borderRadius: 20,
        top: '30%',
    },


  });
  
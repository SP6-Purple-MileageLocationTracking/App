/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert
} from 'react-native';
import React from 'react';
import { FlatList, GestureHandlerRootView } from 'react-native';

export default function TripListScreen({navigation}) {

    const trips = [
        {
            id: 1,
            start: 'Atlanta',
            end: 'Tampa',
            mileage: 24.4,
            dist: 400,
        },
        {
            id: 2,
            start: 'New York',
            end: 'Los Angeles',
            mileage: 120,
            dist: 2800,
        },
        {
            id: 3,
            start: 'Chicago',
            end: 'Houston',
            mileage: 82.5,
            dist: 1000,
        },
        {
            id: 4,
            start: 'Miami',
            end: 'Seattle',
            mileage: 150.7,
            dist: 3000,
        },
        {
            id: 5,
            start: 'Denver',
            end: 'Phoenix',
            mileage: 60.2,
            dist: 800,
        },
        {
            id: 6,
            start: 'Boston',
            end: 'San Francisco',
            mileage: 123.8,
            dist: 2900,
        },
        {
            id: 7,
            start: 'Dallas',
            end: 'Orlando',
            mileage: 93.6,
            dist: 1100,
        },
        {
            id: 8,
            start: 'Washington D.C.',
            end: 'Las Vegas',
            mileage: 140.5,
            dist: 2400,
        },
        {
            id: 9,
            start: 'Philadelphia',
            end: 'San Diego',
            mileage: 127.2,
            dist: 2700,
        },
        {
            id: 10,
            start: 'Houston',
            end: 'Portland',
            mileage: 185.3,
            dist: 3200,
        },
        {
            id: 11,
            start: 'Seattle',
            end: 'Miami',
            mileage: 150.7,
            dist: 3000,
        },
        {
            id: 12,
            start: 'Los Angeles',
            end: 'New York',
            mileage: 120,
            dist: 2800,
        },
        {
            id: 13,
            start: 'San Francisco',
            end: 'Boston',
            mileage: 123.8,
            dist: 2900,
        },
        {
            id: 14,
            start: 'Orlando',
            end: 'Dallas',
            mileage: 93.6,
            dist: 1100,
        },
    ];

    const oneTrip = ( {item} ) => {
        console.log("Rendering Trip:", item);
            return(
            <View style={styles.tripContainer} key={item.id}>
                <Text style={styles.tripText}>Start: {item.start}</Text>
                <Text style={styles.tripText}>End: {item.end}</Text>
                <Text style={styles.tripText}>Mileage: {item.mileage}</Text>
                <Text style={styles.tripText}>Distance: {item.dist}</Text>
            </View>
            );
    };

    console.log("Trips:", trips); // Log the entire trips array

    return(
        <View style={styles.container}>
            <FlatList
                style={styles.listContainer}
                data = {trips}
                renderItem = {oneTrip}
                keyExtractor={(item) => item.id.toString()}
            />
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
    tripContainer: {
        backgroundColor: '#555',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    tripText:{
        color: '#FFF',
        fontSize: 18, 
        marginVertical: 10, 
    },
    listContainer:{
        flex: 1,
        color: '#FFFFF',
        width: '100%',
    }
  });
  
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert
} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'

// Screens
import HomeScreen from './screens/HomeScreen';
import TripListScreen from './screens/TripListScreen'
import SettingsScreen from './screens/SettingsScreen'

// Screen Names
const homeName = 'Home'
const tripListName = 'Trip List'
const settingsName = 'Settings'

const Tab = createBottomTabNavigator();

export default function MainContainer(){
    return(
        <NavigationContainer>
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarActiveTintColor: '#F7D044', 
                tabBarInactiveTintColor: '#F7D044', 
                tabBarStyle: { backgroundColor: '#211D26',height: 60},
                headerShown: false,
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline'
                    } 
                    else if (rn === tripListName) {
                        iconName = focused ? 'list' : 'list-outline'
                    }
                    else if (rn === settingsName) {
                        iconName = focused ? 'settings' : 'settings-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                },
                tabBarLabelStyle: { marginBottom: 5 }

            })}>

            <Tab.Screen name={homeName} component={HomeScreen}/>
            <Tab.Screen name={tripListName} component={TripListScreen}/>
            <Tab.Screen name={settingsName} component={SettingsScreen}/>

            </Tab.Navigator>
        </NavigationContainer>
    )
}
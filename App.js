/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import MainContainer from './navigation/MainContainer';
import Login from './navigation/screens/Login';
import CreateAccount from './navigation/screens/CreateAccountScreen';
import PDFGenerator from './navigation/screens/PDFGenerator'
import * as Location from 'expo-location';

const Stack = createNativeStackNavigator();

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <>
        <StatusBar backgroundColor="#211D26" barStyle="light-content" />
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }} />
                <Stack.Screen name="MainContainer" component={MainContainer} options={{ headerShown: false }} />
                <Stack.Screen name="PDFGenerator" component={PDFGenerator} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
      </>
    );
}
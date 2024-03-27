/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert
} from 'react-native';
import React from 'react';
import MainContainer from './navigation/MainContainer';
import Login from './navigation/screens/Login';
import CreateAccount from './navigation/screens/CreateAccountScreen';
import PDFGenerator from './navigation/screens/PDFGenerator'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="CreateAccount" component={CreateAccount} options={{ headerShown: false }}/>
        <Stack.Screen name="MainContainer" component={MainContainer} options={{ headerShown: false }}/>
        <Stack.Screen name="PDFGenerator" component={PDFGenerator} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}





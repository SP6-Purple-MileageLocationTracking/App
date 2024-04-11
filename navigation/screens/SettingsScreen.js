/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';

import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert, PermissionsAndroid
} from 'react-native';
import React from 'react'



export default function SettingsScreen({navigation}) {
    return(
        <View style={styles.container}>
          
        <Text style={{fontWeight: "bold"}}>Settings</Text>
        <Text>Team SP6 - Purple: Mason Sherrill, Alex Nguyen, Brian Nghiem, Shaun Teague, Zachary Morning</Text>
        <Text>Testing 1...2...3...</Text>
        <Text style={{
            fontWeight: "800"}}>Welp, It does seem to work...</Text>
        <Button

            // Some properties given to Button 
            title="Test Button"
            onPress={() => Alert.alert(
                'Thank you for Testing')}
        /> 
        <Text>This Code is in TypeScript</Text>
        <Text style={{fontWeight: "bold", fontSize: 16}}>This is Shaun, hopefully this works</Text>
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
  });
  
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet, Button, View, SafeAreaView,
    Text, Alert
} from 'react-native';
import React from 'react';

export default function TripListScreen({navigation}) {
    return(
        <View style={styles.container}>
          
        
        <Button

            // Some properties given to Button 
            title="Upload Button"
            onPress={() => navigation.navigate("PDFGenerator")}
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
  });
  
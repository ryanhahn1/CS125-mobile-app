import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button} from 'react-native';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from '../components/EditScreenInfo';

export default function TabOneScreen() {
  const navigation = useNavigation();
  //const [current_user, setCurrent_user] = React.useState(await AsyncStorage.getItem("currentUser"));
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      navigation.goBack();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Food Tab!</Text>
      <Text>I added a log out button here for convenience. I'll move it to a proper place later.</Text>
      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={{ color: "white"}}>Log out!</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: "300",
  },
  input: {
    borderWidth: 1,
    borderColor: "#575DD9",
    alignSelf: "stretch",
    margin: 32,
    height: 48,
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 25,
  },
  button: {
    backgroundColor: "#575DD9",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 16,
    marginHorizontal: 32,
    borderRadius: 6,
  },
});

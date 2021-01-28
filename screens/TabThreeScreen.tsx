import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
//import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function TabThreeScreen() {
  const [name, setName] = useState<any | null>(null);
  const [data, setData] = useState<any | null>(null);
  const set_user_data = async () => {
    try {
      let userdata = await AsyncStorage.getItem(name);
      if (userdata !== null && userdata !== "") {
        var parsedList = JSON.parse(userdata).entries;
        parsedList.push(data)
        AsyncStorage.setItem(name, JSON.stringify({entries: parsedList}))
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Input name fill</Text>
      <TextInput style={styles.input} onChangeText = {(text) => setName(text)} />
      <Text style={styles.name}>Input string data fill</Text>
      <TextInput style={styles.input} onChangeText = {(text) => setData(text)} />
      <TouchableOpacity style={styles.button} onPress={() => set_user_data()}>
        <Text style={{ color: "white"}}>Add my data!</Text>
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

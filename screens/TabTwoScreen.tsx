import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
//import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function TabTwoScreen() {
  const [name, setName] = useState<any | null>(null);
  const [data, setData] = useState([]);
  const load_user_data = async () => {
    try {
      let userdata = await AsyncStorage.getItem(name);
      if (userdata !== null) {
        var parsed = JSON.parse(userdata).entries;
        setData(parsed);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>View your data!</Text>
      <TextInput style={styles.input} onChangeText = {(text) => setName(text)} />
      <TouchableOpacity style={styles.button} onPress={() => load_user_data()}>
        <Text style={{ color: "white"}}>Load my data!</Text>
      </TouchableOpacity>
      <View>
        {data.map((item) => (
          <Text>{item}</Text>
        ))}
      </View>
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

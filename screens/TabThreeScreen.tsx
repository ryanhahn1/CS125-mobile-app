import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
//import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function TabThreeScreen() {
  //const [name, setName] = useState<any | null>(null);
  const [input_weight, setWeight] = useState<any | null>(null);
  const [data, setData] = useState([] as any[]);
  
  async function set_user_data() {
    try {
      let current_user = await AsyncStorage.getItem("currentUser");
      if (current_user !== null && current_user !== ""){
        let userdata = await AsyncStorage.getItem(current_user);
        if (userdata !== null && userdata !== "") {
          var parsedList = JSON.parse(userdata).entries;
          var weight = JSON.parse(userdata).weight;
          var height = JSON.parse(userdata).height;
          let day = new Date();
          parsedList.push({weight: input_weight, date : day.getDate(), month : day.getMonth()})
          AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: weight, height: height}))
          Alert.alert("I tried", current_user);
        }
        
      }
      else if (current_user == null){
        Alert.alert("Log in first", "current user is null");
      }
      else{
        Alert.alert("Log in first", "current user is empty string");
      }
    } catch (err) {
      alert(err);
    }
  };
  const load_user_data = async () => {
    try {
      let current_user = await AsyncStorage.getItem("currentUser");
      if (current_user !== null && current_user !== ""){
        let userdata = await AsyncStorage.getItem(current_user);
        if (userdata !== null) {
          var parsed = JSON.parse(userdata).entries;
          setData(parsed);
        }
        Alert.alert("I tried", current_user);
      }
      else if (current_user == null){
        Alert.alert("Log in first", "current user is null");
      }
      else{
        Alert.alert("Log in first", "current user is empty string");
      }
      
    } catch (err) {
      alert(err);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Weight Tab!</Text>
      {/* <TextInput style={styles.input} onChangeText = {(text) => setName(text)} /> */}
      <Text style={styles.name}>Input Your Current Weight!</Text>
      <TextInput style={styles.input} onChangeText = {(text) => setWeight(text)} />
      <TouchableOpacity style={styles.button} onPress={() => set_user_data()}>
        <Text style={{ color: "white"}}>Add my data!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => load_user_data()}>
        <Text style={{ color: "white"}}>Load my data!</Text>
      </TouchableOpacity>
      {/* <FlatList
          data={data}
          renderItem={( { item } ) => (
            <View>
              <Text>{"Weight: " + item.weight}</Text>
              <Text>{item.month + "/" + item.date}</Text>
            </View>
            )
          }
          ></FlatList> */}
      {data.map((item, idx) => (
          <Text>Key: {idx + 1} Date: {item.date} {item.month} Weight: {item.weight}</Text>
        ))}
    </View>
  );
  // }
  
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

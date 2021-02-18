import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  var [input_weight, setWeight] = useState<any | null>(null);
  const [goal, setGoal] = useState<any | null>(null);
  var [input_height, setHeight] = useState<any | null>(null);
  const [retrieve, setRetrieve] = useState(false);
  const isFocused = useIsFocused(); 

  useEffect(() => {
    const updateInfo = async () => {
      get_user_weight()
      .then(d => {
          setWeight(d);
      })
      get_user_height()
      .then(d => {
          setHeight(d);
      })
      get_user_goal()
      .then(d => {
          setGoal(d);
      })
    }
    updateInfo();
  }, [isFocused]);
  async function get_user_height() {
      let current_user = await AsyncStorage.getItem("currentUser");
      if (current_user !== null && current_user !== ""){
          let userdata = await AsyncStorage.getItem(current_user);
          if (userdata !== null && userdata !== "") {
          var height = JSON.parse(userdata).height;
          return height;
          }
      }
    };
    async function get_user_weight() {
      let current_user = await AsyncStorage.getItem("currentUser");
      if (current_user !== null && current_user !== ""){
          let userdata = await AsyncStorage.getItem(current_user);
          if (userdata !== null && userdata !== "") {
          var weight = JSON.parse(userdata).weight;
          return weight;
          }
      }
    };
    async function get_user_goal() {
      let current_user = await AsyncStorage.getItem("currentUser");
      if (current_user !== null && current_user !== ""){
          let userdata = await AsyncStorage.getItem(current_user);
          if (userdata !== null && userdata !== "") {
          var goal = JSON.parse(userdata).goal;
          return goal;
          }
      }
    };
    get_user_weight()
    .then(d => {
        setWeight(d);
    })
    get_user_height()
    .then(d => {
        setHeight(d);
    })
    get_user_goal()
    .then(d => {
        setGoal(d);
    })
    // setRetrieve(true);
  
  return (
    <View style={styles.container}>
      <Text style={styles.name}>My Profile</Text>
        <Text>current weight: {input_weight}</Text>
        <Text>current height: {input_height}</Text>
        <Text>current goal: {goal}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProfileEdit")}>
        <Text style={{ color: "white"}}>Edit profile!</Text>
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

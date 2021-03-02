import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

import { NavigationContainer, useNavigation } from "@react-navigation/native"

import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const [goal, setGoal] = useState<any | null>(null);
  const [gender, setGender] = useState<any | null>(null);
  var [input_height, setHeight] = useState<any | null>(null);
  var [input_age, setAge] = useState<any | null>(null);
  
  const set_user_goal = async (Goal : string) => {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null && userdata !== "" && Goal) {
        setGoal(Goal);
        var gender = JSON.parse(userdata).gender;
        var parsedList = JSON.parse(userdata).entries;
        var weight = JSON.parse(userdata).weight;
        var height = JSON.parse(userdata).height;
        var age = JSON.parse(userdata).age;
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: weight, height: height, goal: Goal, gender: gender, age: age}))
      }
    }
  };

  const set_user_gender = async (gender : string) => {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null && userdata !== "" && gender) {
        setGender(gender);
        var goal = JSON.parse(userdata).goal;
        var parsedList = JSON.parse(userdata).entries;
        var weight = JSON.parse(userdata).weight;
        var height = JSON.parse(userdata).height;
        var age = JSON.parse(userdata).age;
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: weight, height: height, goal: goal, gender: gender, age: age}))
      }
    }
  };

  async function save_user_info() {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null && userdata !== "") {
        var parsedList = JSON.parse(userdata).entries;
        var weight = JSON.parse(userdata).weight;
        var height = (input_height == null) ? JSON.parse(userdata).height : input_height;
        var goal = JSON.parse(userdata).goal;
        var gender = JSON.parse(userdata).gender;
        var age = (input_age == null) ? JSON.parse(userdata).age : input_age;
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: weight, height: height, goal: goal, gender: gender, age: age}))
      }
    }
    navigation.navigate("Progress")
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.name}>My Profile</Text>
      <Text>Goal:</Text>
      <DropDownPicker 
          items={[
              {label: 'Lose Weight', value: 'lose weight'},
              {label: 'Gain Weight', value: 'gain weight'},
              {label: 'Maintain Weight', value: 'maintain weight'},
          ]}
          defaultValue={'lose weight'}
          containerStyle={{height: 40}}
          style={{backgroundColor: '#fafafa'}}
          itemStyle={{
              justifyContent: 'flex-start'
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={item => set_user_goal(item.value)}
      />
      <Text>Gender:</Text>
      <DropDownPicker 
          items={[
              {label: 'Male', value: 'Male'},
              {label: 'Female', value: 'Female'},
          ]}
          defaultValue={'Male'}
          containerStyle={{height: 40}}
          style={{backgroundColor: '#fafafa'}}
          itemStyle={{
              justifyContent: 'flex-start'
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={item => set_user_gender(item.value)}
      />
      <Text style={styles.name}>Input Your Current Height in cm!</Text>
      <TextInput style={styles.input} onChangeText = {(text) => setHeight(text)} />
      <Text style={styles.name}>Input Your Current Age!</Text>
      <TextInput style={styles.input} onChangeText = {(text) => setAge(text)} />
      <TouchableOpacity style={styles.button} onPress={() => save_user_info()}>
      <Text style={{ color: "white"}}>Save profile</Text>
      </TouchableOpacity>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
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

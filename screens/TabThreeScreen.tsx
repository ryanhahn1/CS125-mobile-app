import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
//import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';


export default function TabThreeScreen() {
  //const [name, setName] = useState<any | null>(null);
  const [data, setData] = useState([] as any[]);
  const navigation = useNavigation();
  var [input_weight, setWeight] = useState<any | null>(null);
  var [curr_weight, setCurrWeight] = useState<any | null>(null);
  const [goal, setGoal] = useState<any | null>(null);
  var [input_height, setHeight] = useState<any | null>(null);
  var [gender, setGender] = useState<any | null>(null); 
  var [age, setAge] = useState<any | null>(null);
  var [calorieGoal, setCalorieGoal] = useState<any | null>(null);
  const isFocused = useIsFocused(); 

  useEffect(() => {
    const updateInfo = async () => {
      get_user_weight()
      .then(d => {
          setCurrWeight(d);
      })
      get_user_height()
      .then(d => {
          setHeight(d);
      })
      get_user_goal()
      .then(d => {
          setGoal(d);
      })
      get_user_gender()
      .then(d => {
        setGender(d);
      })
      get_user_age()
      .then(d => {
        setAge(d);
      })
      get_calorie_goal()
      .then(d => {
        setCalorieGoal(d);
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
  async function get_user_gender() {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
        let userdata = await AsyncStorage.getItem(current_user);
        if (userdata !== null && userdata !== "") {
        var gender = JSON.parse(userdata).gender;
        return gender;
        }
    }
  };
  async function get_user_age() {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
        let userdata = await AsyncStorage.getItem(current_user);
        if (userdata !== null && userdata !== "") {
        var age = JSON.parse(userdata).age;
        return age;
        }
    }
  };
  async function set_user_data() {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null && userdata !== "" && input_weight !== null) {
        setCurrWeight(input_weight);
        var parsedList = JSON.parse(userdata).entries;
        var weight = input_weight == null ? JSON.parse(userdata).weight : input_weight;
        var height = JSON.parse(userdata).height;
        var goal = JSON.parse(userdata).goal;
        var gender = JSON.parse(userdata).gender;
        var age = JSON.parse(userdata).age;
        let day = new Date();
        parsedList.push({weight: input_weight, date : day.getDate(), month : day.getMonth()})
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: weight, height: height, goal: goal, gender: gender, age: age}))
      } 
    }
  };
  const load_user_data = async () => {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null) {
        var parsed = JSON.parse(userdata).entries;
        setData(parsed);
      }
    }    
  };
  const get_calorie_goal = async () => {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null) {
        var gender = JSON.parse(userdata).gender;
        var weight = JSON.parse(userdata).weight;
        var height = JSON.parse(userdata).height;
        var age = JSON.parse(userdata).age;
        var goal = JSON.parse(userdata).goal;
        var calorie = 0;
        if (gender === "Male") {
          calorie = 1.2 * (10 * weight / 2.205 + 6.25 * height - 5 * age + 5);
        }else if (gender === "Female") {
          calorie = 1.2 * (10 * weight / 2.205 + 6.25 *height - 5 * age - 161);
        }
        if (goal === "lose weight") {
          calorie -= 500;
        }else if (goal === "gain weight") {
          calorie += 500;
        }
        AsyncStorage.setItem(current_user + "Calorie", JSON.stringify(calorie));
        return calorie;
      }
    }    
  }
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
      <Text style={styles.name}>My Profile</Text>
      <Text>calorie goal: {calorieGoal} </Text>
      <Text>gender: {gender} </Text>
      <Text>age: {age} </Text>
      <Text>current weight: {curr_weight}</Text>
      <Text>current height: {input_height}</Text>
      <Text>current goal: {goal}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProfileEdit")}>
      <Text style={{ color: "white"}}>Edit profile!</Text>
      </TouchableOpacity>
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

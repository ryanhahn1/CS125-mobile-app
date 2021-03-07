import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
//import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';


export default function TabThreeScreen() {
  const [data, setData] = useState([] as any[]);
  const navigation = useNavigation();
  var [input_weight, setWeight] = useState<any | null>(null);
  var [curr_weight, setCurrWeight] = useState<any | null>(null);
  const [goal, setGoal] = useState<any | null>(null);
  var [input_height, setHeight] = useState<any | null>(null);
  var [gender, setGender] = useState<any | null>(null); 
  var [age, setAge] = useState<any | null>(null);
  var [calorieGoal, setCalorieGoal] = useState<any | null>(null);
  var [calorieBurnGoal, setCalorieBurnGoal] = useState<any | null>(null);
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
      get_calorie_burned_goal()
      .then(d => {
        setCalorieBurnGoal(d);
      })
    }
    updateInfo();
    load_user_data();
  }, [isFocused]);


  // function getExerciseData() {
  //   const url = "https://trackapi.nutritionix.com/v2/natural/exercise";
  //   axios.post(url, {
  //     body: {
  //       "query": "ran 4 miles",
  //       "gender":"female",
  //       "weight_kg":72.5,
  //       "height_cm":167.64,
  //       "age":30
  //     },
  //     headers: {
  //       "x-app-id": "c813a65e",
  //       "x-app-key": "bcba6cff6834136cd676de29587f3827",
  //       "Content-Type": "application/json"
  //     }
  //   }).then((response) => {
  //     console.log(response);
  //   })
  //   .catch((response) => {
  //       console.log(response);
  //   })
  // }
    
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
      let fitnessdata = await AsyncStorage.getItem(current_user + "Fitness");
      if (userdata !== null && fitnessdata !== null) {
        var gender = JSON.parse(userdata).gender;
        var weight = JSON.parse(userdata).weight;
        var height = JSON.parse(userdata).height;
        var age = JSON.parse(userdata).age;
        var goal = JSON.parse(userdata).goal;
        var fitness = JSON.parse(fitnessdata).fitnessLevel;
        var calorie = 0;
        if (gender === "Male") {
          calorie = fitness * (10 * weight / 2.205 + 6.25 * height - 5 * age + 5);
        }else if (gender === "Female") {
          calorie = fitness * (10 * weight / 2.205 + 6.25 *height - 5 * age - 161);
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
  };
  const get_calorie_burned_goal = async () => {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user + "Fitness");
      if (userdata !== null) {
        var fitness = JSON.parse(userdata).fitnessLevel;
        return fitness - 1.2;
      }
    }    
  };


  return (
    <View style={styles.container}>
      <Text style={styles.name}>Progress</Text>
      <TextInput 
        placeholder= 'input your weight'
        keyboardType='numeric'
        returnKeyType='done'
        style={styles.input} 
        onChangeText = {(text) => setWeight(text)} />
      <TouchableOpacity style={styles.button} onPress={() => set_user_data()}>
        <Text style={{ color: "white"}}>+</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Entries</Text>
      <FlatList
          data={data.slice(0, 4)}
          renderItem={( { item } ) => (
            <View style={styles.entries}>
              <Text>{item.weight + " lbs"}</Text>
              <Text>{item.month + "/" + item.date}</Text>
            </View>
          )
          }
      />
     
      <Text>calorie goal: {Math.round(calorieGoal)} </Text>
      <Text>calorie burned goal: {Math.round(calorieGoal * calorieBurnGoal)}</Text>

    </View>
  );
  // }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
  },
  entries: {
    flex: 1,
    // alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 1,
    backgroundColor: "white",
    borderColor: "gray"
  },
  title: {
    flex: 1,
    // alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    backgroundColor: "white",
    borderColor: "gray"

  },
  name: {
    fontSize: 24,
    fontWeight: "300",
    alignSelf: 'center',
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
    marginHorizontal: 32,
    borderRadius: 6,
  },
});

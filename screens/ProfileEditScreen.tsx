import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';

import { NavigationContainer, useIsFocused, useNavigation } from "@react-navigation/native"

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DateRangePicker,
  DatePicker,
  TimePicker,
  DateTimePicker,
  ListPicker,
  NumberPicker,
} from 'react-native-ultimate-modal-picker';


export default function ProfileEditScreen() {
  const navigation = useNavigation();
  var [name, setName] = useState<any | null>(null);
  var [input_goal, setGoal] = useState<any | null>(null);
  var [input_gender, setGender] = useState<any | null>(null);
  var [input_height, setHeight] = useState<any | null>(null);
  var [input_weight, setWeight] = useState<any | null>(null);
  var [input_age, setAge] = useState<any | null>(null);
  var [input_fitness, setFitness] = useState<any | null>(null);
  const isFocused = useIsFocused(); 

  const goalList: any = [
    {label: 'Lose Weight', value: 'Lose Weight'},
    {label: 'Gain Weight', value: 'Gain Weight'},
    {label: 'Maintain Weight', value: 'Maintain Weight'},
  ];

  const genderList: any = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ];

  const fitnessList: any = [
    {label: 'Light exercise 1-2 times a week', value: 'Light exercise 1-2 times a week'},
    {label: 'Moderate exercise 2-3 times a week', value: 'Moderate exercise 2-3 times a week'},
    {label: 'Hard exercise 4-5 times a week', value: 'Hard exercise 4-5 times a week'},
    {label: 'Athlete exercise 6-7 times a week', value: 'Athlete exercise 6-7 times a week'}
  ];

  const fitnessDict: any = {
    "Light exercise 1-2 times a week" : 1.2,
    "Moderate exercise 2-3 times a week" : 1.375,
    "Hard exercise 4-5 times a week" : 1.55,
    "Athlete exercise 6-7 times a week" : 1.725,
  };

  useEffect(() => {
    const updateInfo = async () => {
      get_user_name()
      .then(d => {
        setName(d);
      })
      get_user_age()
      .then(d => {
        setAge(d);
      })
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
      get_user_gender()
      .then(d => {
        setGender(d);
      })
    }
    updateInfo();
  }, [isFocused]);

  async function get_user_name () {
    let current_user = await AsyncStorage.getItem("currentUser");
    return current_user;
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

  const set_fitness_goal = async (fitness : number) => {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user + "Fitness");
      if (userdata !== null && userdata !== "" && fitness) {
        AsyncStorage.setItem(current_user + "Fitness", JSON.stringify({fitness: fitness, fitnessLevel: fitnessDict[fitness]}))
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
        var goal = (input_goal == null) ? JSON.parse(userdata).goal : input_goal;
        var gender = (input_gender == null) ? JSON.parse(userdata).gender : input_gender;
        var age = (input_age == null) ? JSON.parse(userdata).age : input_age;
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: weight, height: height, goal: goal, gender: gender, age: age}))
        navigation.navigate("Profile");
      }
    }
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profileInfo}>
        <View style={styles.infobox}>
          <Text style={{ color: "black"}}>User Name</Text>
          <View style={{flex: 1}}>
            <Text style={{ textAlign: "right", color: "blue"}}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.profileInfo}>
        <View style={styles.infobox}>
            <Text style={{ color: "black"}}>Age</Text>
            <View style={{flex: 1}}>
              <TextInput 
                textAlign = 'right'
                placeholder= {input_age}
                keyboardType='numeric'
                returnKeyType='done'
                onChangeText={(item) => setAge(item)}
              />
            </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.profileInfo , {borderBottomWidth: 1}]}>
        <View style={styles.infobox}>
            <Text style={{ color: "black"}}>Height (cm)</Text>
            <View style={{flex: 1}}>
              <TextInput 
                textAlign = 'right'
                placeholder= {input_height}
                keyboardType='numeric'
                returnKeyType='done'
                onChangeText={(item) => setHeight(item)}
              />
            </View>
        </View>
      </TouchableOpacity>

      <ListPicker
        title="Gender"
        defaultValue={input_gender}
        items={genderList}
        onChange={(item) => setGender(item)}
      />
      <ListPicker
        title="Goal"
        defaultValue={input_goal}
        items={goalList}
        onChange={(item) => setGoal(item)}
      />
      <ListPicker
        title="Fitness Goal"
        defaultValue={input_fitness}
        items={fitnessList}
        onChange={(item) => set_fitness_goal(item)}
      />
      <TouchableOpacity style={styles.button} onPress={() => save_user_info()}>
      <Text style={{ color: "white"}}>Save profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );  
}

const styles = StyleSheet.create({
  infobox: {
    flexDirection: "row",
  },
  drop: {
    flexDirection: "row",
  },
  profileInfo: {
    // marginTop: 16,
    // marginHorizontal: 32,
    alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderRadius: 1,
    backgroundColor: "white",
    // borderColor: "gray"
  },
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
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

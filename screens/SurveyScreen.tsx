import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Center } from '../src/Center';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ListPicker,
} from 'react-native-ultimate-modal-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

// import DateTimePickerModal from "react-native-modal-datetime-picker";


export default function SurveyScreen() {
  const navigation = useNavigation();
  var [input_goal, setGoal] = useState<any | null>(null);
  var [input_gender, setGender] = useState<any | null>(null);
  var [input_height, setHeight] = useState<any | null>(null);
  var [input_weight, setWeight] = useState<any | null>(null);
  var [input_age, setAge] = useState<any | null>(null);

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
  
  const set_fitness_goal = async (fitness: string) => {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
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
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: input_weight, height: input_height, goal: input_goal, gender: input_gender, age: input_age}))
      }
    }
    navigation.navigate("App")
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.name}>Please Input Your Health Information</Text>
      <TouchableOpacity style={styles.profileInfo}>
        <View style={styles.infobox}>
            <Text style={{ color: "black"}}>Height (cm)</Text>
            <View style={{flex: 1}}>
              <TextInput 
                textAlign = 'right'
                placeholder= 'input your height'
                keyboardType='numeric'
                returnKeyType='done'
                onChangeText={(item) => setHeight(item)}
              />
            </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.profileInfo}>
        <View style={styles.infobox}>
            <Text style={{ color: "black"}}>Weight (lbs)</Text>
            <View style={{flex: 1}}>
              <TextInput 
                textAlign = 'right'
                placeholder= 'input your weight'
                keyboardType='numeric'
                returnKeyType='done'
                onChangeText={(item) => setWeight(item)}
              />
            </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.profileInfo}>
        <View style={styles.infobox}>
            <Text style={{ color: "black"}}>Age (years old)</Text>
            <View style={{flex: 1}}>
              <TextInput 
                textAlign = 'right'
                placeholder= 'input your age'
                keyboardType='number-pad'
                returnKeyType='done'
                onChangeText={(item) => setAge(item)}
              />
            </View>
        </View>
      </TouchableOpacity>

      <ListPicker
        title="Gender"
        items={genderList}
        onChange={(item) => setGender(item)}
      />

      <ListPicker
        title="Goal"
        items={goalList}
        onChange={(item) => setGoal(item)}
      />
      <ListPicker
        title="Fitness"
        items={fitnessList}
        onChange={(item) => set_fitness_goal(item)}
      />

      <TouchableOpacity style={styles.button} onPress={() => save_user_info()}>
      <Text style={{ color: "white"}}>Done</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
  },
  name: {
    paddingVertical: 24,
    fontSize: 24,
    fontWeight: "300",
  },
  profileInfo: {
    // marginTop: 16,
    // marginHorizontal: 32,
    alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 1,
    backgroundColor: "white",
    // borderColor: "gray"
  },
  input: {
    borderWidth: 1,
    borderColor: "#575DD9",
    alignSelf: "stretch",
    margin: 12,
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

import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  var [name, setName] = useState<any | null>(null);
  var [input_weight, setWeight] = useState<any | null>(null);
  const [goal, setGoal] = useState<any | null>(null);
  var [input_height, setHeight] = useState<any | null>(null);
  var [gender, setGender] = useState<any | null>(null); 
  var [input_fitness, setFitness] = useState<any | null>(null);
  var [input_age, setAge] = useState<any | null>(null);
  const isFocused = useIsFocused(); 
  
  useEffect(() => {
    const updateInfo = async () => {
      get_user_name()
      .then(d => {
        setName(d);
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
      get_user_age()
      .then(d => {
        setAge(d);
      })
      get_user_fitness()
      .then(d => {
        setFitness(d);
      })
    }
    updateInfo();
  }, [isFocused]);

  async function get_user_name () {
    let current_user = await AsyncStorage.getItem("currentUser");
    return current_user;
  };

  async function get_user_fitness () {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user + "Fitness");
      if (userdata !== null && userdata !== "") {
        var fitness = JSON.parse(userdata).fitness;
        return fitness;
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
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Profile</Text>
      <TouchableOpacity style={[styles.profileInfo, {marginTop: 16}]}>
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
            <Text style={{ textAlign: "right", color: "blue"}}>{input_age}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileInfo} >
      <View style={styles.infobox}>
          <Text style={{ color: "black"}}>Weight</Text>
          <View style={{flex: 1}}>
            <Text style={{ textAlign: "right", color: "blue"}}>{input_weight}</Text>
          </View>
      </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileInfo} >
      <View style={styles.infobox}>
          <Text style={{ color: "black"}}>Height</Text>
          <View style={{flex: 1}}>
            <Text style={{ textAlign: "right", color: "blue"}}>{input_height}</Text>
          </View>
        </View>
      </TouchableOpacity>  
      <TouchableOpacity style={styles.profileInfo} >
      <View style={styles.infobox}>
          <Text style={{ color: "black"}}>Gender</Text>
          <View style={{flex: 1}}>
            <Text style={{ textAlign: "right", color: "blue"}}>{gender}</Text>
          </View>
        </View>
      </TouchableOpacity>  
      <TouchableOpacity style={styles.profileInfo} >
        <View style={styles.infobox}>
          <Text style={{ color: "black"}}>Goal</Text>
          <View style={{flex: 1}}>
            <Text style={{ textAlign: "right", color: "blue"}}>{goal}</Text>
          </View>
        </View>
      </TouchableOpacity>  
      <TouchableOpacity style={[styles.profileInfo, {borderBottomWidth: 1}]} >
        <View style={styles.infobox}>
          <Text style={{ color: "black"}}>Fitness Goal</Text>
          <View style={{flex: 1}}>
            <Text style={{ textAlign: "right", color: "blue"}}>{input_fitness}</Text>
          </View>
        </View>
      </TouchableOpacity>  
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProfileEdit")}>
        <Text style={{ color: "white"}}>Edit profile!</Text>
      </TouchableOpacity>
    </View> 
  );
}

const styles = StyleSheet.create({
  infobox: {
    flexDirection: "row",
  },
  infovalue: {
    // textAlign: "right",
    justifyContent: "space-between",
    // paddingHorizontal: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
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

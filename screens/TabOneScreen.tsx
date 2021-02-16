import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button, Alert, FlatList} from 'react-native';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

import EditScreenInfo from '../components/EditScreenInfo';

export default function TabOneScreen() {
  const navigation = useNavigation();
  const [inputFood, setInputFood] = useState("");
  const [data, setData] = useState([] as any[]);
  const [error, setError] = React.useState<any | null>("");
  //const [current_user, setCurrent_user] = React.useState(await AsyncStorage.getItem("currentUser"));
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      navigation.goBack();
    } catch (err) {
      alert(err);
    }
  };

  const searchFood = async() => {
    setData([]);
    if (inputFood !== "" && inputFood !== null){
      console.log("api call function");
      const url = `https://api.edamam.com/api/food-database/parser?app_id=3c7d8606&app_key=68f20074d40b4aca57bb52d80511aebb&ingr=${inputFood}`
      axios.get(url)
        .then(response => {
          if (!response.data.hints.length) {
            //console.log("no food found");
            setError("no food found");
          }
          console.log("api call success");
          //console.log(JSON.stringify(response.data.hints));
          setData(response.data.hints);
          setError("");
        })
        .catch(error => setError(error.response.status))
        //console.log("api call fail");
    }
    else{
      setError("Enter a food");
    }
    
  }

  const addFood = async() => {
      setError("yep onpress works");

  }


  return (
    <View style={styles.container}>
      <Text style={styles.name}>Food Tab!</Text>
      <Text>I added a log out button here for convenience. I'll move it to a proper place later.</Text>
      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={{ color: "white"}}>Log out!</Text>
      </TouchableOpacity>
      <TextInput style={styles.input} onChangeText = {(text) => setInputFood(text)} />
      <TouchableOpacity style={styles.button} onPress={() => {console.log("outside api call function"); searchFood()}}>
      <Text style={{ color: "white"}}>Search Food!</Text>
      </TouchableOpacity>
      {/* {data.map((item, idx) => (
        <View key={idx} style={styles.foodEntry}>
          <Text style={{ color: "black"}}>{item.food.label}</Text>
          <Text style={{ color: "black"}}>{Math.round(item.food.nutrients.ENERC_KCAL)} Calories</Text>
          <Image style={styles.foodImage} source={{uri : item.food.image}}/>
        </View> 
        ))} */}
      <Text>{error}</Text>
      <FlatList style={styles.foodList}
        data={data}
        renderItem={
          ( { item } ) => (
          <TouchableOpacity style={styles.foodEntry} onPress={addFood}>
            <Text style={{ color: "black"}}>{item.food.label}</Text>
            <Text style={{ color: "black"}}>{Math.round(item.food.nutrients.ENERC_KCAL)} Calories</Text>
            <Image style={styles.foodImage} source={{uri : item.food.image}}/>
          </TouchableOpacity> 
          )
        }
        keyExtractor={(item) => item.food.foodId}
        ></FlatList>
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
  foodEntry: {
    marginTop: 16,
    marginHorizontal: 32,
    alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderRadius: 1,
    backgroundColor: "#D3D3D3",
    borderColor: "#575DD9"
  },
  foodImage: {
    width: 50,
    height: 50,
    position: "absolute",
    right: 0,
  },
  foodList: {
    alignSelf: "stretch",
    flex: 0,
  }
});

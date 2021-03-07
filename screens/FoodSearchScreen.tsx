import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button, Alert, FlatList} from 'react-native';
import { NavigationContainer, useNavigation, useRoute, useIsFocused, RouteProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

import EditScreenInfo from '../components/EditScreenInfo';

export default function FoodSearchScreen() {
  const navigation = useNavigation();
  const [inputFood, setInputFood] = useState("");
  const [data, setData] = useState([] as any[]);
  // const [foodSelect, setFoodSelect] = useState<any | null>(null);
  const [error, setError] = React.useState<any | null>("");
  //const [current_user, setCurrent_user] = React.useState(await AsyncStorage.getItem("currentUser"))
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      navigation.goBack();
    } catch (err) {
      alert(err);
    }
  };

  const resetFood = async () => {
    var user = null;
      try {
        user = await AsyncStorage.getItem("currentUser");
      } catch (err) {
        setError("not logged in");
      }
    try {
      await AsyncStorage.removeItem("Food" + user);
      setError("successfully removed food entries");
    } catch (err) {
      setError("remove call errored");
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
          var foods = response.data.hints;
          var displayFoods = [] as any[];
          var seenIds = new Set;
          var i = 0;
          // filter out duplicate foodId results
          while (i < foods.length){
            if (!seenIds.has(foods[i].food.foodId)){
              displayFoods.push(foods[i])
              seenIds.add(foods[i].food.foodId);
            }
            i++;
          }
          setData(displayFoods);
          setError("");
        })
        .catch(error => setError(error.response.status))
        //console.log("api call fail");
    }
    else{
      setError("Enter a food");
    }
    
  }

  interface foodObj {
    "foodId": string,
    "uri": string,
    "label": string,
    "nutrients": {
      "ENERC_KCAL": number,
      "PROCNT": number,
      "FAT": number,
      "CHOCDF": number,
      "FIBTG": number
    },
    "category": string,
    "categoryLabel": string,
    "image": string
  }

  const addFood = async(food: foodObj) => {    
      var user = null;
      try {
        user = await AsyncStorage.getItem("currentUser");
      } catch (err) {
        alert(err);
      }
      if (user !== null){
        try {
          let userdata = await AsyncStorage.getItem("Food" + user);
          // pull and add to food info
          if (userdata !== null){
            var parsedList = JSON.parse(userdata).entries;
            var i = 0;
            var found = 0;
            let day = new Date();
            for (i = 0; i < parsedList.length; i++){
              // food already exists in storage
              console.log(parsedList[i]);
              if (parsedList[i].foodId == food.foodId){
                parsedList[i].dates.push(Date.now())
                found = 1;
                setError("food: " + parsedList[i].label + ", this is the "+ parsedList[i].dates.length + " time");
              }
            }
            // first time eating
            if (!found){
              parsedList.push({
                foodId: food.foodId,
                label: food.label,
                calories: food.nutrients.ENERC_KCAL,
                image: food.image,
                dates: [Date.now()]})
              setError("first time eating");
            }
            AsyncStorage.setItem("Food" + user, JSON.stringify({entries: parsedList}))
          }
          // initialize food info storage
          else{
            await AsyncStorage.setItem(
              "Food" + user,
              JSON.stringify(
                {entries: [{
                  foodId: food.foodId,
                  label: food.label,
                  calories: food.nutrients.ENERC_KCAL,
                  image: food.image,
                  dates: [Date.now()]}]}
              )
            );
            setError("first time eating anything");
          }
          
        } catch (err) {
          alert(err);
        }
      }
      else{
        setError("user not logged in");
      }
  }


  return (
    <View style={styles.container}>
      <TextInput style={styles.input} onChangeText = {(text) => setInputFood(text)} placeholder = {"Search for a food"} onSubmitEditing = {() => {searchFood()}}/>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Diet")}>
        <Text style={{ color: "white"}}>View Recommendations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {resetFood()}}>
        <Text style={{ color: "white"}}>Reset Food List</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => {console.log("outside api call function"); searchFood()}}>
      <Text style={{ color: "white"}}>Search Food!</Text>
      </TouchableOpacity>
      <Text>{error}</Text>
      <FlatList style={styles.foodList}
        data={data}
        renderItem={
          ( { item } ) => (
          <TouchableOpacity style={styles.foodEntry} onPress={() => {addFood(item.food)}}>
            {/* <Text style={{ color: "black"}}>{item.food.foodId}</Text> */}
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
  },
  searchHeader: {
    backgroundColor: "#D3D3D3",
    width: "100%",
  }
});

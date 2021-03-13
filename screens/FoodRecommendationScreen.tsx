import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button, Alert, FlatList} from 'react-native';
import { NavigationContainer, useNavigation, useIsFocused } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

import EditScreenInfo from '../components/EditScreenInfo';
import addFood from './FoodSearchScreen'
import FoodSearchScreen from './FoodSearchScreen';

export default function FoodRecommendationScreen() {
  const navigation = useNavigation();
  const [inputFood, setInputFood] = useState(""); // user query in search field
  const [recommendations, setRecommendations] = useState([] as any[]); // list of food recommendation entries to display on screen
  const [foodSelect, setFoodSelect] = useState<any | null>(null); // food entry that the user taps to log meal
  const [error, setError] = useState<any | null>("");
  const [data, setData] = useState([] as any[]); // list of food search entries to display on screen
  const isFocused = useIsFocused(); 
  const [displayList, setDisplayList] = useState(1); // determines which UI elements to render: 1 for recommendations, 0 for search results

  // on page render, update the recommendations for the user
  const updateInfo = async () => {
    setFoodSelect([]);
    getRecommendation()
    .then(d => {
        setRecommendations(d);
    })
  }
  useEffect(() => {
    updateInfo();
  }, [isFocused]);

  interface foodEntry {
    foodId: number,
    label: string,
    calories: number,
    entries: [],
    image: string,
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

  // retrieves Edamam API call results for the user's food query and updates the list on screen
  const searchFood = async() => {
    setData([]);
    if (inputFood !== "" && inputFood !== null){
      const url = `https://api.edamam.com/api/food-database/parser?app_id=3c7d8606&app_key=68f20074d40b4aca57bb52d80511aebb&ingr=${inputFood}`
      axios.get(url)
        .then(response => {
          if (!response.data.hints.length) {
            setError("no food found");
          }
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
          // update list data
          setData(displayFoods);
          setError("");
          setDisplayList(0);
        })
        .catch(error => setError(error.response.status))
    }
    else{
      setError("Enter a food");
    }
    
  }

  // comparison function to evaluate which between two foods is closer to meal goal, used for recommendation
  const compareFoods = async(a: foodEntry, b: foodEntry) => {
    var user = null;
    var calorieGoal = null;
    var temp = null;
    try {
      user = await AsyncStorage.getItem("currentUser");
    } catch (err) {
      alert(err);
    }
    try {
      temp = await AsyncStorage.getItem(user + "Calorie");
      if (temp) {
        calorieGoal = parseInt(temp);
        if (Math.abs(calorieGoal / 3 - a.calories) > Math.abs(calorieGoal / 3 - b.calories)) return 1;
        if (Math.abs(calorieGoal / 3 - b.calories) > Math.abs(calorieGoal / 3 - a.calories)) return -1;
      }
    } catch (err) {
      alert(err);
    }
    
    return 0;
  }

  // retrieves the top 5 recommendations for the user in sorted order
  const getRecommendation = async () => {
    var user = null;
    try {
      user = await AsyncStorage.getItem("currentUser");
    } catch (err) {
      alert(err);
    }
    try {
      let userdata = await AsyncStorage.getItem("Food" + user);
      // pull and add to food info
      if (userdata !== null){
        var parsedList = JSON.parse(userdata).entries;
        return parsedList.sort(compareFoods).slice(0, 5);
      }
    } catch (err) {
      return [];
    }
  };

  // takes food search entry as parameter and adds it to the AsyncStorage data set for foods the user has eaten
  const addSearch = async(food: foodObj) => {    
    var user = null;
    // check that user is logged in
    try {
      user = await AsyncStorage.getItem("currentUser");
    } catch (err) {
      alert(err);
    }
    if (user !== null){
      try {
        let userdata = await AsyncStorage.getItem("Food" + user);
        // retrieve current food data from AsyncStorage
        if (userdata !== null){
          var parsedList = JSON.parse(userdata).entries;
          var i = 0;
          var found = 0;
          let day = new Date();
          // check if the food has already been eaten
          for (i = 0; i < parsedList.length; i++){
            // food already exists in meal logs, so add the date to the list of times eaten
            console.log(parsedList[i]);
            if (parsedList[i].foodId == food.foodId){
              parsedList[i].dates.push(Date.now())
              found = 1;
              setError("food: " + parsedList[i].label + ", this is the "+ parsedList[i].dates.length + " time");
            }
          }
          // food does not already exists in meal logs, so add the new entry
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
        // first time the user has logged any meal, so initialize the AsyncStorage directory
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

  // takes food recommendation entry as parameter and adds it to the AsyncStorage data set for foods the user has eaten
  const addFood = async(food: foodEntry) => {    
    var user = null;
    // check that user is logged in
    try {
      user = await AsyncStorage.getItem("currentUser");
    } catch (err) {
      alert(err);
    }
    if (user !== null){
      try {
        let userdata = await AsyncStorage.getItem("Food" + user);
        // retrieve current food data from AsyncStorage
        if (userdata !== null){
          var parsedList = JSON.parse(userdata).entries;
          var i = 0;
          var found = 0;
          let day = new Date();
          // check if the food has already been eaten
          for (i = 0; i < parsedList.length; i++){
            // food already exists in meal logs, so add the date to the list of times eaten
            console.log(parsedList[i]);
            if (parsedList[i].foodId == food.foodId){
              parsedList[i].dates.push(Date.now())
              found = 1;
              setError("food: " + parsedList[i].label + ", this is the "+ parsedList[i].dates.length + " time");
            }
          }
          // food does not already exists in meal logs, so add the new entry
          if (!found){
            parsedList.push({
              foodId: food.foodId,
              label: food.label,
              calories: food.calories,
              image: food.image,
              dates: [Date.now()]})
            setError("first time eating");
          }
          AsyncStorage.setItem("Food" + user, JSON.stringify({entries: parsedList}))
        }
        // first time the user has logged any meal, so initialize the AsyncStorage directory
        else{
          await AsyncStorage.setItem(
            "Food" + user,
            JSON.stringify(
              {entries: [{
                foodId: food.foodId,
                label: food.label,
                calories: food.calories,
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
      {/* render the search bar and the back button if on search results screen */}
        {displayList ?
        <View style={styles.searchDiv}>
          <TextInput
            style={styles.input}
            onChangeText = {(text) => setInputFood(text)}
            placeholder = {"Search for a food"}
            onSubmitEditing = {() => {searchFood()}}/>
        </View>
        :
        <View style={styles.searchDiv}>
          <TouchableOpacity style={styles.smallButton} onPress={() => {updateInfo(); setDisplayList(1)}}>
            <Text style={{ color: "white", fontSize: 25}}>Back</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText = {(text) => setInputFood(text)}
            placeholder = {"Search for a food"}
            onSubmitEditing = {() => {searchFood()}}/>
        </View>
      }
    {/* render either the food recommendations or the food search results */}
      {/* Heading */}
      <View style={styles.recommendations}>
        {displayList ?
          <Text style={{ color: "black", fontWeight: 'bold', fontSize: 20, margin: 15}}>Recommended for you</Text>
          :
          <Text style={{ color: "black", fontWeight: 'bold', fontSize: 20, margin: 15}}>Search results</Text>}
        {displayList ?
        /* Recommendation list */
        <FlatList style={styles.foodList}
          data={recommendations}
          ListFooterComponent={
          <TouchableOpacity style={styles.foodEntry}></TouchableOpacity> }
          renderItem={
            ( { item } ) => (
            <TouchableOpacity style={styles.foodEntry} onPress={() => {addFood(item)}}>
              <Image style={styles.foodImage} source={{uri : item.image}}/>
              <View style={ {margin: 0, padding: 0, flexDirection: 'column'} }>
                <Text style={{ color: "black", fontSize: 18, fontWeight: "300",}}>{item.label}</Text>
                <Text style={{ color: "black", fontSize: 14, fontWeight: "200"}}>{Math.round(item.calories)} Calories</Text>
              </View>
            </TouchableOpacity> 
            )
          }
          keyExtractor={(item) => item.foodId}
          ></FlatList>
        :
        /* Search result list */
        <FlatList style={styles.foodList}
          data={data}
          ListFooterComponent={
            <TouchableOpacity style={styles.foodEntry}></TouchableOpacity> }
          renderItem={
            ( { item } ) => (
            <TouchableOpacity style={styles.foodEntry} onPress={() => {addSearch(item.food)}}>
              <Image style={styles.foodImage} source={{uri : item.food.image}}/>
              <View style={ {margin: 0, padding: 0, flexDirection: 'column'} }>
                <Text style={{ color: "black", fontSize: 18, fontWeight: "300",}}>{item.food.label}</Text>
                <Text style={{ color: "black", fontSize: 14, fontWeight: "200"}}>{Math.round(item.food.nutrients.ENERC_KCAL)} Calories</Text>
              </View>
              
            </TouchableOpacity> 
            )
          }
          keyExtractor={(item) => item.food.foodId}
        ></FlatList>
        }
      </View>      
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
    flex: 1,
    borderWidth: 1,
    borderColor: "#575DD9",
    alignSelf: "stretch",
    margin: 16,
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
    alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    margin: 0,
    backgroundColor: "#fff",
    borderColor: "#575DD9",
    flexDirection: 'row',
  },
  foodImage: {
    borderRadius: 50,
    marginHorizontal: 15,
    width: 60,
    height: 60,
    right: 0,
  },
  foodList: {
    alignSelf: "stretch",
    flex: 0,
    marginTop: 0,
    paddingVertical: 0,
  },
  recommendations: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    alignSelf: 'stretch',
  },
  searchDiv: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "stretch",
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 0,
    marginHorizontal: 0,
    flexDirection: 'row',
    height: 82,
  },
  smallButton: {
    backgroundColor: "#575DD9",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 16,
    height: 48,
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 25,
    width: 90,
  }
});

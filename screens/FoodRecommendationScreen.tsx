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
  const [inputFood, setInputFood] = useState("");
  const [recommendations, setRecommendations] = useState([] as any[]);
  const [foodSelect, setFoodSelect] = useState<any | null>(null);
  const [error, setError] = useState<any | null>("");
  const [data, setData] = useState([] as any[]);
  const isFocused = useIsFocused(); 
  const [displayList, setDisplayList] = useState(1); // 1 for recommendation, 0 for search
  //const [current_user, setCurrent_user] = React.useState(await AsyncStorage.getItem("currentUser"));
  useEffect(() => {
    const updateInfo = async () => {
      setFoodSelect([]);
      getRecommendation()
      .then(d => {
          setRecommendations(d);
      })
    }
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
          setDisplayList(0);
        })
        .catch(error => setError(error.response.status))
        //console.log("api call fail");
    }
    else{
      setError("Enter a food");
    }
    
  }

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

  const addSearch = async(food: foodObj) => {    
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

  const addFood = async(food: foodEntry) => {    
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
              calories: food.calories,
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

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      navigation.goBack();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* <TextInput
          style={styles.input}
          onChangeText = {(text) => setInputFood(text)}
          placeholder = {"Search for a food"}
          onSubmitEditing = {() => {searchFood()}}/> */}
        {/* <Text style={{ color: "black", fontWeight: 'bold', fontSize: 20, margin: 15}}>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text> */}
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
          <TouchableOpacity style={styles.smallButton} onPress={() => setDisplayList(1)}>
            <Text style={{ color: "white", fontSize: 25}}>Back</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText = {(text) => setInputFood(text)}
            placeholder = {"Search for a food"}
            onSubmitEditing = {() => {searchFood()}}/>
        </View>
      }
      {/* <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={{ color: "white"}}>Log out!</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("FoodSearch")}>
      <Text style={{ color: "white"}}>Food Search</Text>
      </TouchableOpacity> */}
      <View style={styles.recommendations}>
        {displayList ? <Text style={{ color: "black", fontWeight: 'bold', fontSize: 20, margin: 15}}>Recommended for you</Text> : <Text style={{ color: "black", fontWeight: 'bold', fontSize: 20, margin: 15}}>Search results</Text>}
        {displayList ? 
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
    // marginHorizontal: 32,
    alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    margin: 0,
    backgroundColor: "#fff",
    borderColor: "#575DD9",
    flexDirection: 'row',
    // borderRadius: 6,
  },
  foodImage: {
    borderRadius: 50,
    marginHorizontal: 15,
    width: 60,
    height: 60,
    right: 0,
    // flex: 1
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
    // backgroundColor: "white",
    flexDirection: 'row',
    height: 82,
    // backgroundColor: 'red',
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

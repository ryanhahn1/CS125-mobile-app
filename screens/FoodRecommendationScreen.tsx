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
  const [error, setError] = React.useState<any | null>("");
  const isFocused = useIsFocused(); 
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
  }

  function compareFoods(a: foodEntry, b: foodEntry) {
    if (a.calories > b.calories) return 1;
    if (b.calories > a.calories) return -1;
  
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
        return parsedList.sort(compareFoods)
      }
    } catch (err) {
      return [];
    }
  };



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
      <Text style={styles.name}>Food Tab!</Text>
      <Text>I added a log out button here for convenience. I'll move it to a proper place later.</Text>
      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text style={{ color: "white"}}>Log out!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("FoodSearch")}>
      <Text style={{ color: "white"}}>Food Search</Text>
      </TouchableOpacity>
      <FlatList style={styles.foodList}
        data={recommendations}
        renderItem={
          ( { item } ) => (
          <TouchableOpacity style={styles.foodEntry} onPress={() => {setFoodSelect(item.food); addFood()}}>
            <Text style={{ color: "black"}}>{item.label}</Text>
            <Text style={{ color: "black"}}>{Math.round(item.calories)} Calories</Text>
            <Image style={styles.foodImage} source={{uri : item.image}}/>
          </TouchableOpacity> 
          )
        }
        keyExtractor={(item) => item.foodId}
        ></FlatList>
      <Text>{error}</Text>
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
  }
});

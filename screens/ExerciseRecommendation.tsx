import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, Modal, Button} from 'react-native';
import { Card } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function ExerciseRecommendation() {  
    var [calorieGoal, setCalorieGoal] = useState<any | null>(null);
    var [calorieBurnGoal, setCalorieBurnGoal] = useState<any | null>(null);
    const isFocused = useIsFocused(); 
    const navigation = useNavigation();

    const updateInfo = async () => {
        get_calorie_goal()
        .then(d => {
          setCalorieGoal(d);
        })
        get_calorie_burned_goal()
        .then(d => {
          setCalorieBurnGoal(d);
        })
    }

    useEffect(() => {
        updateInfo();
    }, [isFocused]);

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
        <SafeAreaView>
            <Card>
              <Text>Recommendation: burn {Math.round(calorieGoal * calorieBurnGoal)} kcals</Text>
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    infobox: {
      flexDirection: "row",
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
    insideModal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // marginTop: 22
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
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
      justifyContent: "center",
      paddingHorizontal: 16,
      fontSize: 25,
    },
    button: {
      backgroundColor: "#575DD9",
      alignItems: "center",
      // justifyContent: "center",
      // alignSelf: "stretch",
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 128,
      borderRadius: 6,
    },
  });
  
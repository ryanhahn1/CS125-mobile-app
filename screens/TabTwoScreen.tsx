import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList, Alert, Dimensions, ScrollView} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
//import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GoogleFit, { Scopes } from 'react-native-google-fit'


import FitHealthStat from "../components/HealthStatus";
import FitExerciseStat from "../components/ExerciseStatus";
import FitChart from "../components/FitChart";
import FitImage from "../components/FitImage";
import StackedBar from "../components/StackedBar";

import { useIsFocused, useNavigation } from '@react-navigation/native';


import { Pedometer } from 'expo-sensors';
// import { StackedBarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get("screen");

export default function TabTwoScreen (){

  const isFocused = useIsFocused(); 

  //const [name, setName] = useState<any | null>(null);
  //const [data, setData] = useState([] as any[]);
  const [isPedometer, setIsPedometer] = useState('checking');
  const [pastStep, setPastStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  var [weightList, setWeightList] = useState<any | null>([]);
  var [input_steps, setSteps] = useState<any | null>(null);
  //var [pastStepList, setPastStepList] = useState<any | null>([]);
  var [calorieBurnGoal, setCalorieBurnGoal] = useState<any | null>(null);
  var [calorieGoal, setCalorieGoal] = useState<any | null>(null);

  // var [temp_char, SetTemp_char] = useState<any | null>([]);

  const [time, setTime] = useState(0);
  var count = 0;

  useEffect(() => {
    _subscribe();
    setSteps(currentStep);
    // save_user_steps();
   return() => {
    // const _subscription = null;
    // removeEventListener(_unsubscribe);
    console.log("unsubscribe");
    };
  },[]
  );

  useEffect(() => {
    const time = setTimeout(() => {
      setTime(count + 1);
    }, 1000);
  });

  
  useEffect(() => {
    const updateInfo = async () => {
      //save_user_steps();
      get_user_weight()
      .then(d => {
        setWeightList(d);
      })

      get_calorie_goal()
      .then(d => {
        setCalorieGoal(d);
      })

      get_calorie_burned_goal()
        .then(d => {
          setCalorieBurnGoal(d);
        })
      
      /*
      
      get_user_steps()
      .then(d => {
          //setSteps(d);
          setPastStepList(d);
      })
      */
  }
    updateInfo();
  }, [isFocused]);
  

  /*
  useEffect(() => {
    return() => {
      console.log("unsubscribe");
    };
  },[seconds]
  );
  */

  const _subscribe = () => {
    const _subscription = Pedometer.watchStepCount(result => {
      setCurrentStep(result.steps);
    });

    Pedometer.isAvailableAsync().then(
      result => {
        setIsPedometer(String(result));
      },
      error => {
        setIsPedometer(
          'Could not get isPedometerAvailable: ' + error,
        );
      } 
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        setPastStep( result.steps );
      }
      /*,
      error => {
        setPastStep(
           error
        );
      }
      */
    );
  };
  //save_user_steps(); // call

  // return monday thu
  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";
  var n = weekday[d.getDay()]; // return the day of week, such as monday
  //if(n == ){}
  var daySteps = [0, 0, 0, 0, 0, 0, 0];
  daySteps[d.getDay()] = currentStep;
  if(n == "Sun"){
    daySteps[6] = pastStep;
  }
  else{
    daySteps[d.getDay() - 1] = pastStep;
  }


  /*
  // save steps
  async function save_user_steps() {
    //const save_user_steps = async() =>{
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null && userdata !== "") {
        var parsedList = JSON.parse(userdata).entries;
        // var currentDate = new Date();
        // var temp_currentDate = JSON.stringify(currentDate);
        // var temp_steps = input_steps > await get_user_steps() ? JSON.parse(userdata).currentStep : input_steps;
        //var temp_currentDate = JSON.parse(userdata).n;
        var temp_steps = pastStep;
        let day = new Date();
        parsedList.push({steps: temp_steps, date : day.getDate(), month : day.getMonth()})
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, steps: temp_steps}))
      }
    }
    //navigation.navigate("Progress")
  }
  */


  var temp = [0,0,0,0,0,0];
  var countTime = 0;
  var countSum = 0;
  var i, j = 0;
  // get user weight
  const get_user_weight = async() =>{
  // async function get_user_weight() {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
        let userdata = await AsyncStorage.getItem(current_user);
        if (userdata !== null && userdata !== "") {
        // var weight = JSON.parse(userdata).weight;
        var temp_entries = JSON.parse(userdata).entries; // list
        //var match = temp_entries[0].date.toString().split(" ");
        var lastMon = temp_entries[0].month; 
        var match;
        for(i = 0; i < temp_entries.length; i++){

          // temp.push(temp_entries[i].weight);
          //match = temp_entries[i].date.toString().split(" ");
          match = temp_entries[i].month;

          if(match == lastMon && i == temp_entries.length - 1){
              temp[5] = countSum/countTime;
          }
          else if(match == lastMon){
            countTime = countTime + 1;
            countSum = countSum + parseInt(temp_entries[i].weight);
          }
          else{
            temp[j] = countSum/countTime;
            countSum = 0;
            countTime = 0;
            lastMon = match;
            if(j < 6){
              j++;
            }
          }
        }
      
        return temp;
        } 
    }
  };

 /*
  // get the steps
  const get_user_steps = async() =>{
      // async function get_user_weight() {
      let current_user = await AsyncStorage.getItem("currentUser");
      if (current_user !== null && current_user !== ""){
          let userdata = await AsyncStorage.getItem(current_user);
          if (userdata !== null && userdata !== "") {
            // var weight = JSON.parse(userdata).weight;
            var temp_entries_steps = JSON.parse(userdata).entries; // list
            // daySteps[d.getDay()] = currentStep;
            // daySteps[d.getDay() - 1] = input_steps;
            // var z;
              daySteps[d.getDay()] = currentStep;
              daySteps[d.getDay() - 1] = pastStep;
          
            return daySteps;
          } 
        }
      };
      */

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


      
  // var calorieBurnWeek = [1, 1, 1, 1, 1, 1, 1];
  var temp_cal = (Math.round(calorieGoal * calorieBurnGoal) * 1000 / 40).toFixed(2) as unknown as number ;
  
  /*
  var temp_cal = Math.round(calorieGoal * calorieBurnGoal);
  
  calorieBurnWeek[d.getDay()] = (currentStep/(temp_cal * 1000/40) * 100).toFixed(2) as any;
  if(n == "Sun"){
    calorieBurnWeek[6] = (pastStep/(temp_cal * 1000/40)*100).toFixed(2) as any;
  }
  else{
    calorieBurnWeek[d.getDay() - 1] = (pastStep/(temp_cal * 1000/40)*100).toFixed(2) as any;
  }
  */
  

  //var barChart = [daySteps[d.getDay()],temp_cal];
  
  return (
    <View style={styles.container}>

      <Text style={styles.name}>Exercise </Text>
      <Text>Steps taken in the last 24 hours: {pastStep}</Text>
      <Text>Steps: {currentStep}</Text> 
      <Text>Remaining Steps: {temp_cal - currentStep}</Text> 
      <Text>Total calorie burned: {currentStep * 40/1000}</Text>
      <Text>Total miles: {currentStep * 1/2000}</Text> 
      
      <Text></Text>

      <ScrollView style={{ backgroundColor: "#ffffff" }}>
      <View>
        <FitChart
          title={"Daily Steps"}
          data={
            {
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: daySteps
                }
              ]
            }
        }
        propsForBackgroundLines={10000}
        />
      </View>



    <View>
    <StackedBar
        title = {"Steps Goals"}
        data = {
          {
          labels: ["","","Daily Goals"],
          legend: ["Taken", "Goal"],
          data: [[],[], [currentStep==0? 1:currentStep, temp_cal]],
          barColors: ["#dfe4ea", "#ced6e0"]
          }
        }
  
        />
      </View>



    </ScrollView>
    
    </View>
        
  );
}


// <Text>Pedometer.isAvailableAsync(): {isPedometer}</Text>


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
});

const sleepData = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      data: [9, 6, 6.5, 8, 4, 7, 8],
      baseline: 8
    }
  ]
};


const data_temp = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  legend: ["Taken", "Goal"],
  data: [[60, 60], [30, 30]],
  barColors: ["#dfe4ea", "#ced6e0"]
};


/*

      <View>
        <FitChart
          title={"Percents of Steps Goal"}
          data={
            {
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: calorieBurnWeek
                }
              ]
            }
          }
          propsForBackgroundLines={100}
        />
      </View>

      */
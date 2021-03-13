import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList, Alert, Dimensions, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FitChart from "../components/FitChart";
import StackedBar from "../components/StackedBar";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Pedometer } from 'expo-sensors';

const { width } = Dimensions.get("screen");

// component for exercise tab
export default function TabTwoScreen (){
  const isFocused = useIsFocused(); 
  const [isPedometer, setIsPedometer] = useState('checking');
  const [pastStep, setPastStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  var [input_steps, setSteps] = useState<any | null>(null);
  var [calorieBurnGoal, setCalorieBurnGoal] = useState<any | null>(null);
  var [calorieGoal, setCalorieGoal] = useState<any | null>(null);
  const [time, setTime] = useState(0);
  var count = 0;

  useEffect(() => {
    _subscribe();
    setSteps(currentStep);
    return() => {
      console.log("unsubscribe");
    };
    },[]
  );

  useEffect(() => {
    const time = setTimeout(() => {
      setTime(count + 1);
    }, 1000);
  });
  
  // update goal and recommendation on tab load
  useEffect(() => {
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
    updateInfo();
  }, [isFocused]);

  // subscribe to pedometer data collection
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
    );
  };

  // initialize graph parameters
  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";
  var n = weekday[d.getDay()];
  var daySteps = [0, 0, 0, 0, 0, 0, 0];
  daySteps[d.getDay()] = currentStep;
  if(n == "Sun"){
    daySteps[6] = pastStep;
  }
  else{
    daySteps[d.getDay() - 1] = pastStep;
  }

  // compute daily calorie intake goal
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

  // retrieve fitness goal from AsyncStorage profile
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

  // calculates remaining steps needed to meet daily goal
  var temp_cal = (Math.round(calorieGoal * calorieBurnGoal) * 1000 / 40).toFixed(2) as unknown as number ;
  
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Exercise </Text>
      <Text></Text>
      <Text>Steps: {currentStep == 0? 1:currentStep}</Text> 
      <Text>Recommended calorie burned: {Math.round(calorieGoal * calorieBurnGoal)}</Text>
      <Text>Recommended steps: {Math.round(calorieGoal * calorieBurnGoal) * 1000/40}</Text> 
      <Text></Text>
      <ScrollView style={{ backgroundColor: "#ffffff" }}>
        <View>
          <FitChart
            title={"Daily Steps"}
            data={
              {
                labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [
                  {data: [4581, 9874, 1243, 6150, 9873, 3658, 4892]}
                ]
              }
          }
          propsForBackgroundLines={10000}
          />
        </View>
        <View>
          <StackedBar
              title = {"Steps Goals"}
              data = {{
                labels: ["","","Daily Goals"],
                legend: ["Taken", "Goal"],
                data: [[],[], [parseInt(currentStep == 0? 1:currentStep),parseInt(temp_cal)]],
                barColors: ["#bab3f5", "#968cf5"]
              }}
          />
        </View>
      </ScrollView>
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
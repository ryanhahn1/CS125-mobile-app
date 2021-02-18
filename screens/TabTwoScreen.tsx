import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList, Alert, Dimensions} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
//import { Text, View } from '../components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GoogleFit, { Scopes } from 'react-native-google-fit'


import FitHealthStat from "../components/HealthStatus";
import FitExerciseStat from "../components/ExerciseStatus";
import FitChart from "../components/FitChart";


import { Pedometer } from 'expo-sensors';

const { width } = Dimensions.get("screen");

export default function TabTwoScreen (){

  //const [name, setName] = useState<any | null>(null);
  //const [data, setData] = useState([] as any[]);
  const [isPedometer, setIsPedometer] = useState('checking');
  const [pastStep, setPastStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // const [seconds, setSeconds] = useState(0);
  /*
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
  };

  componentWillUnmount() {
    this._unsubscribe();
  }


  */

  /*
  useEffect(() => {
    const interverl = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interverl);
  }, []
  );
  */

  useEffect(() => {
    _subscribe();

   return() => {
    // const _subscription = null;
    // removeEventListener(_unsubscribe);
    console.log("unsubscribe");
    };
  },[]
  );

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

  
  
  /*
  const _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };
  */
  
  



/*
  
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_ACTIVITY_WRITE,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BODY_WRITE,
    ],
  }

  const opt = {
    startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
    endDate: new Date().toISOString(), // required ISO8601Timestamp
    BucketOptions : {
    bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
    bucketInterval: 1} // optional - default 1. 
  };
  


  GoogleFit.authorize(options)
      .then((res) => {
        console.log('authorized >>>', res)
      })
      .catch((err) => {
        console.log('err >>> ', err)
      })


    /// --- 
    
    
  
  GoogleFit.getDailyStepCountSamples(opt)
      .then((res) => {
        // personInfo = res; //
        //steps = res.values;
        //var data = JSON.parse(res);
        //var x = data[0].steps;
        console.log('Daily steps >>> ', res)
      })
      .catch((err) => {console.warn(err)
      });


  // blood pressure
  async function fetchData() {
    const heartrate = await GoogleFit.getHeartRateSamples(opt);
    console.log(heartrate);
  
    const bloodpressure = await GoogleFit.getBloodPressureSamples(opt);
    console.log(bloodpressure);
  }

  // cal and distance
  GoogleFit.getActivitySamples(opt).then((res)=> {
    console.log(res)
  });



    // GoogleFit.getDailySteps(opt).then().catch()
    // GoogleFit.getWeeklySteps(data, 0).then().catch() 
    // determine the first day of week, 0 == Sunday, 1==Monday, etc.

    // <Text style={styles.name}>Data: {opt.startDate} </Text>
    // <Text style={styles.name}>Steps: {opt.endDate} </Text>
    */

  return (
    <View style={styles.container}>

      <Text style={styles.name}>Google Fit Tab！</Text>
      <Text>Pedometer.isAvailableAsync(): {isPedometer}</Text>
      <Text>Steps taken in the last 24 hours: {pastStep}</Text>
      <Text>Walk! And watch this go up: {currentStep}</Text> 

      <Text>Total cal: </Text>
      <Text>Total miles: </Text> 
    
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

const stepsData = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      data: [10000, 9000, 2000, 3000, 8000, 11000, 10500, 1000],
      baseline: 10000
    }
  ]
};


/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/



/*



<View
      style={{
        flex: 1,
        backgroundColor: "#1f2026",
        paddingTop: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginLeft: width * 0.15,
          marginRight: width * 0.15,
          marginBottom: width * 0.05,
        }}
      > 

        <FitHealthStat
          iconBackgroundColor="#183b57"
          iconColor="#0e8df2"
          actual="75"
          over=" / 100"
          type="Move Min"
        />
        <FitHealthStat
          iconBackgroundColor="#124b41"
          iconColor="#03ddb3"
          actual="30"
          over=" / 20"
          type="Heart Pts"
          doubleIcon
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginLeft: width * 0.1,
          marginRight: width * 0.1,
          marginBottom: width * 0.05,
        }}
      >
        <View>
          <FitExerciseStat quantity = "123 " type="steps " />
        </View>
        <View>
          <Text style={{ color: "#9a9ba1", fontSize: 40, fontWeight: "100" }}>
            |
          </Text>
        </View>
        <View>
          <FitExerciseStat quantity="6432 " type="cal " />
        </View>
        <View>
          <Text style={{ color: "#9a9ba1", fontSize: 40, fontWeight: "100" }}>
            |
          </Text>
        </View>
        <View>
          <FitExerciseStat quantity="5.2 " type="miles " />
        </View>
      </View>
    </View>




    */
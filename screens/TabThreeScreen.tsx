import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, Modal, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FitChart from "../components/FitChart";
// import ExerciseRecommendation from '../screens/ExerciseRecommendation';
// import Modal from 'react-native-modal';
import {
  DateRangePicker,
  DatePicker,
  TimePicker,
  DateTimePicker,
  ListPicker,
  NumberPicker,
} from 'react-native-ultimate-modal-picker';


export default function TabThreeScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([] as any[]);
  var [input_weight, setWeight] = useState<any | null>(null);
  var [weightList, setWeightList] = useState<any | null>([]);
  const isFocused = useIsFocused(); 

  const updateInfo = async () => {
    setData([]);
    get_user_weight()
    .then(d => {
        setWeight(d);
    })
    get_user_weight_list()
    .then(d => {
        setWeightList(d);
    })
    load_user_data();
  };

  useEffect(() => {
    updateInfo();
  }, [isFocused]);


  // function getExerciseData() {
  //   const url = "https://trackapi.nutritionix.com/v2/natural/exercise";
  //   axios.post(url, {
  //     body: {
  //       "query": "ran 4 miles",
  //       "gender":"female",
  //       "weight_kg":72.5,
  //       "height_cm":167.64,
  //       "age":30
  //     },
  //     headers: {
  //       "x-app-id": "c813a65e",
  //       "x-app-key": "bcba6cff6834136cd676de29587f3827",
  //       "Content-Type": "application/json"
  //     }
  //   }).then((response) => {
  //     console.log(response);
  //   })
  //   .catch((response) => {
  //       console.log(response);
  //   })
  // }

  const get_user_weight_list = async() =>{
    var temp = [0,0,0,0,0,0];
    var occurences = [0,0,0,0,0,0]
    var i;

    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
        let userdata = await AsyncStorage.getItem(current_user);
        if (userdata !== null && userdata !== "") {
        var temp_entries = JSON.parse(userdata).entries; // list
        //var match = temp_entries[0].date.toString().split(" ");
        if (temp_entries.length !== 0) {
          for(i = 0; i < temp_entries.length; i++){
            temp[temp_entries[i].month] += parseInt(temp_entries[i].weight);
            occurences[temp_entries[i].month] += 1;
          }
          for(i = 0; i < temp.length; ++i) {
            if (occurences[i] !== 0) {
              temp[i] /= occurences[i];
            }
          }
        }  
        return temp;
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

  async function set_user_data() {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null && userdata !== "" && input_weight !== null) {
        var parsedList = JSON.parse(userdata).entries;
        var weight = input_weight;
        var height = JSON.parse(userdata).height;
        var goal = JSON.parse(userdata).goal;
        var gender = JSON.parse(userdata).gender;
        var age = JSON.parse(userdata).age;
        let day = new Date();
        parsedList.push({weight: input_weight, date : day.getDate(), month : day.getMonth()})
        setData(parsedList);
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: weight, height: height, goal: goal, gender: gender, age: age}))
      } 
    }
  };


  // const sampleData = [{weight: 120,}]

  const load_user_data = async () => {
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
      let userdata = await AsyncStorage.getItem(current_user);
      if (userdata !== null) {
        var parsed = JSON.parse(userdata).entries;
        setData(parsed);
      }
    }    
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infobox}>
        <Text style={styles.title}>Progress</Text>
        <TouchableOpacity style={styles.button} onPress={() => {setModalVisible(true)}}>
          <Text style={{ color: "white"}}>Add Weight</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 242}} >
          <FitChart
            title={""}
            data={
              {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                
                datasets: [
                  {
                    data: weightList
                  }
                ]
              }
            }
            baseline={100}
          />
      </View>

      <SafeAreaView style={styles.centeredView}>
        <Modal 
          animationType="slide"
          visible= {isModalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
        <SafeAreaView style={styles.insideModal}>
            <View style = {styles.infobox}>
              <Button title="cancel" onPress={() => setModalVisible(false)} />
              <View style = {{marginLeft: "auto"}}>
                <Button 
                  title="submit" 
                  onPress={() => {set_user_data();setModalVisible(false)}} />
              </View>
            </View>

            <TouchableOpacity style={styles.profileInfo}>
            <View style={styles.infobox}>
                <Text style={{ color: "black"}}>Weight</Text>
                <View style={{flex: 1}}>
                  <TextInput 
                    textAlign = 'right'
                    placeholder= {input_weight + " lbs"}
                    keyboardType='numeric'
                    returnKeyType='done'
                    onChangeText={(item) => setWeight(item)}
                  />
                </View>
            </View>
          </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
      
      {/* data.slice(Math.max(data.length - 3, 0)) */}

      <Text style={[styles.title, {paddingBottom: 30}]}>Entries</Text>
      <FlatList
          ListFooterComponent={
          <TouchableOpacity style={styles.entries}></TouchableOpacity> }
          data={data.slice(Math.max(data.length - 4, 0)).reverse()}
          renderItem={( { item } ) => (
            <View style={[styles.entries, {flexDirection: "row"}]}>
              <Text>{item.weight + " lbs"}</Text>
              <View style={{marginLeft: "auto"}}>
                <Text >{item.month + 1 + "/" + item.date}</Text>
              </View>
            </View>
          )
          }
          // keyExtractor={(item) => item}
      />
     
      

    </SafeAreaView>
  );
  // }
  
}

const styles = StyleSheet.create({
  infobox: {
    marginTop: 0,
    padding: 0,
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
    marginTop: 50
  },
  centeredView: {
    flex: 1,
    // marginTop: 22
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  entries: {
    alignSelf: "stretch",
    borderColor: "#575DD9",
    paddingTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderRadius: 1,
    backgroundColor: "white",
  },
  title: {
    flex: 1,
    marginTop: 0,
    // alignSelf: "stretch",
    fontSize: 20,
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
    marginTop: 0,
    backgroundColor: "#575DD9",
    marginLeft: "auto",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
});

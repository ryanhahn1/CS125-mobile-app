import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, Modal, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FitChart from "../components/FitChart";

// component for progress tab
export default function TabThreeScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([] as any[]);
  var [input_weight, setWeight] = useState<any | null>(null);
  var [weightList, setWeightList] = useState<any | null>([]);
  const isFocused = useIsFocused(); 

  // on tab render, update information from AsyncStorage
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

  // retrieves the user's weight entries for display from AsyncStorage
  const get_user_weight_list = async() =>{
    var temp = [0,0,0,0,0,0];
    var occurences = [0,0,0,0,0,0]
    var i;
    let current_user = await AsyncStorage.getItem("currentUser");
    if (current_user !== null && current_user !== ""){
        let userdata = await AsyncStorage.getItem(current_user);
        if (userdata !== null && userdata !== "") {
        var temp_entries = JSON.parse(userdata).entries;
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
  
  // retrieves the user's current weight from AsyncStorage
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

  // retrieves updates user's current weight in AsyncStorage profile and adds weight to entries
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
        parsedList.push({weight: input_weight, date : day.getDate(), month : day.getMonth(), key : Date.now()})
        setData(parsedList);
        AsyncStorage.setItem(current_user, JSON.stringify({entries: parsedList, weight: weight, height: height, goal: goal, gender: gender, age: age}))
      } 
    }
  };

  // updates list of weight entries that is displayed
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
      {/* graph of weight progress */}
      <View style={{height: 242}} >
          <FitChart
            title={""}
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [{data: weightList}]
            }}
            baseline={100}
          />
      </View>
      {/* modal that appears when new weight entry is being added */}
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
      {/* list of most recent 4 weight entries */}
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
          keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );  
}

const styles = StyleSheet.create({
  infobox: {
    marginTop: 0,
    padding: 0,
    flexDirection: "row",
  },
  profileInfo: {
    alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 1,
    backgroundColor: "white",
  },
  insideModal: {
    flex: 1,
    marginTop: 50
  },
  centeredView: {
    flex: 1,
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
import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from '../components/EditScreenInfo';

export default function TabOneScreen() {
  const [name, setName] = useState<any | null>(null);

  const save = async () => {
    try {
      await AsyncStorage.setItem(
        name,
        JSON.stringify(
          {entries: ['sample data 1', 'sample data 2']}
          )
        );
    } catch (err) {
      alert(err);
    }
  };

  const load = async () => {
    try {
      let userdata = await AsyncStorage.getItem(name);
      if (userdata !== null) {
        
      }
    } catch (err) {
      alert(err);
    }
  };

  const remove = async () => {
    try {
      await AsyncStorage.removeItem(name)
    } catch (err) {
      alert(err)
    } finally {
      setName("")
    }
  }

  useEffect(()=> {
    load();
  }, []);
  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/images/welcome.png")} 
        style={ {width: "100%", height: 200}} 
        resizeMode="contain"/>
      <Text style={{ height: 30}}>{name}</Text>      
      <Text style={styles.name}>What's your name test</Text>
      <TextInput style={styles.input} onChangeText = {(text) => setName(text)} />

      <TouchableOpacity style={styles.button} onPress={() => save()}>
        <Text style={{ color: "white"}}>Save my name!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => remove()}>
        <Text style={{ color: "white"}}>Remove my name!</Text>
      </TouchableOpacity>

    </View>
  );
}

// function useForceUpdate() {
//   const [value, setValue] = useState(0);
//   return [() => setValue(value + 1), value];
// }

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

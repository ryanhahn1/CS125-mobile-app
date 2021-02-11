import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button, Alert} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import TabThreeScreen from '../screens/TabThreeScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList, TabThreeParamList, AppParamList, ProfileParamList } from '../types';


import { Center } from '../src/Center';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

function HomeScreen() {
  const navigation = useNavigation();
  const [name, setName] = React.useState<any | null>(null);
  const [error, setError] = React.useState<any | null>("");

  const save = async () => {
    try {
      await AsyncStorage.setItem(
        name,
        JSON.stringify(
          {entries: [],
           weight: 0,
           height: 0,
           goal: 'lose weight'}
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
  const login = async () => {
    try {
      let username = await AsyncStorage.getItem(name);
      if (username !== null){
        setError("Account already exists");
      }
      else if (name == "" || name == null){
        setError("Enter a username");
      }
      else{
        await AsyncStorage.setItem("currentUser",name);
        await save();
        navigation.navigate('App');
        Alert.alert("This account does not already exists", name);
        setError("");
      }
    } catch (err) {
      alert(err);
    }
  };
  
  return (
    <Center>
          <Text style={styles.name}>Sign up !! </Text>
          <TextInput style={styles.input} onChangeText = {(text) => setName(text)} />
          <TouchableOpacity style={styles.button} onPress={() => login()}>
            <Text style={{ color: "white"}}>Create Account</Text>
          </TouchableOpacity>
          <Text>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={() => remove()}>
            <Text style={{ color: "white"}}>Remove Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: "white"}}>Already have an account? Log in</Text>
          </TouchableOpacity>
    </Center>
      
  );
}

const EntireApp = createStackNavigator<AppParamList>();

export default function AppNavigator() {
  return (
    <EntireApp.Navigator
      initialRouteName="Login">
        <EntireApp.Screen 
          name= "Home"
          component={HomeScreen}/>
        <EntireApp.Screen 
          name= "Login"
          component={Login}/>
        <EntireApp.Screen 
          name= "App"
          component={BottomTabNavigator}/>
    </EntireApp.Navigator>
  );
}


const BottomTab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneNavigator}
        // options={{
        //   tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        // }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        // options={{
        //   // tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        // }}
      />
      <BottomTab.Screen
        name="TabThree"
        component={TabThreeNavigator}
        // options={{
        //   tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        // }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

function Login() {
  const navigation = useNavigation();
  const [name, setName] = React.useState<any | null>(null);
  const [error, setError] = React.useState<any | null>("");
  
  const login = async () => {
    try {
      let username = await AsyncStorage.getItem(name);
      if (username == null){
        setError("Account does not exist");
      }
      else if (name == "" || name == null){
        setError("Enter a username");
      }
      else{
        await AsyncStorage.setItem("currentUser",name);
        navigation.navigate('App');
      }
    } catch (err) {
      alert(err);
    }
  };
  return (
      <Center>
          <Text> Log In </Text>
          <TextInput style={styles.input} onChangeText = {(text) => setName(text)} />
          <Text>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={() => login()}>
            <Text style={{ color: "white"}}>Log in!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={{ color: "white"}}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
      </Center>
  );
}


// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ header: () => null }}
      />
      <TabOneStack.Screen 
        name="Login" 
        component={Login} 
        options={{ header: () => null }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ header: () => null }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator<TabThreeParamList>();

function TabThreeNavigator() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="TabThreeScreen"
        component={TabThreeScreen}
        options={{ header: () => null }}
      />
    </TabThreeStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile"
        component={ProfileScreen}
        options={{ header: () => null }}
      />
      <ProfileStack.Screen 
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ header: () => null }}
      />
    </ProfileStack.Navigator>
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
    color: "white",
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
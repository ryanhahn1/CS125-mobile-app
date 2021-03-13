import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation, useIsFocused } from "@react-navigation/native"
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button, Alert} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import FoodRecommendation from '../screens/FoodRecommendationScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import TabThreeScreen from '../screens/TabThreeScreen';
import FoodSearchScreen from '../screens/FoodSearchScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RecommendationScreen from '../screens/Recommendation';
import { BottomTabParamList, TabOneParamList, TabTwoParamList, TabThreeParamList, AppParamList, ProfileParamList} from '../types';

import SurveyScreen from '../screens/SurveyScreen';

import { Center } from '../src/Center';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

// Sign up screen element componenet
function HomeScreen() {
  const navigation = useNavigation();
  const [name, setName] = React.useState<any | null>(null);
  const [password, setPassword] = React.useState<any | null>(null);
  const [error, setError] = React.useState<any | null>("");

  // intitialize the AsyncStorage directory for user profile
  const save = async () => {
    try {
      await AsyncStorage.setItem(
        name,
        JSON.stringify(
          {entries: [],
           weight: 0,
           height: 0,
           goal: 'lose weight',
           gender: "Male",
           age: 18,
          }
          )
        );
    } catch (err) {
      alert(err);
    }
  };

  // initialize the AsyncStorage directory for user account info
  const addAccount = async () => {
    try {
      await AsyncStorage.setItem(
        "Account"+name,
        password
        );
    } catch (err) {
      alert(err);
    }
  };

  // use the data in the text fields to create a new account after checking if input is valid
  const createAccount = async () => {
    try {
      if (name == "" || name == null) {
        setError("Enter a username");
      }else {
        let username = await AsyncStorage.getItem(name);
        if (username !== null){
          setError("Account already exists");
        }
        else if (name == "" || name == null){
          setError("Enter a username");
        }
        else if (password == "" || password == null) {
          setError("Enter a password");
        }
        else{
          await AsyncStorage.setItem("currentUser",name);
          await addAccount();
          await save();
          navigation.navigate('SurveyForm');
          setError("");
        }
      }
    } catch (err) {
      alert(err);
    }
  };
  
  return (
    <Center>
          <Text style={styles.name}>Sign up !</Text>
          <Text style={styles.username}>username: </Text>
          <TextInput style={styles.input} onChangeText = {(text) => setName(text)} />
          <Text style={styles.username}>password: </Text>
          <TextInput style={styles.input} onChangeText = {(text) => setPassword(text)} />
          <TouchableOpacity style={styles.button} onPress={() => createAccount()}>
            <Text style={{ color: "white"}}>Create Account</Text>
          </TouchableOpacity>
          <Text>{error}</Text>
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
          component={HomeScreen}
          options={{ header: () => null }}/>
        <EntireApp.Screen 
          name= "Login"
          component={Login}
          options={{ header: () => null }}/>
        <EntireApp.Screen 
          name= "App"
          component={BottomTabNavigator}
          options={{ 
            title: "",
            headerLeft: () => null }}
            />
        <EntireApp.Screen 
          name = "SurveyForm"
          component={SurveyScreen}
          options={{ header: () => null }}/>
    </EntireApp.Navigator>
  );
}


const BottomTab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Profile"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Diet"
        component={TabOneNavigator}
      />
      <BottomTab.Screen
        name="Exercise"
        component={TabTwoNavigator}
      />
      <BottomTab.Screen
        name="Progress"
        component={TabThreeNavigator}
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

// Sign in screen element component
function Login() {
  const navigation = useNavigation();
  const [name, setName] = React.useState<any | null>(null);
  const [password, setPassword] = React.useState<any | null>(null);
  const [error, setError] = React.useState<any | null>("");
  const isFocused = useIsFocused();

  // on page render, navigate to app home page if the user is already logged in
  React.useEffect(() => {
    const updateInfo = async () => {
      AsyncStorage.getItem("currentUser")
      .then(d => {
          if (d != null){
            navigation.navigate('App');
          }
      })
    }
    updateInfo();
  }, [isFocused]);
  
  // use the data in the text fields to log in to account after checking if input is valid
  const login = async () => {
    try {
      if (name == "" || name == null){
        setError("Enter a username");
      }else {
        let username = await AsyncStorage.getItem(name);
        let userpassword = await AsyncStorage.getItem("Account"+name);
        if (username == null){
          setError("Account does not exist");
        }
        else if (name == "" || name == null){
          setError("Enter a username");
        }
        else if (password == "" || password == null) {
          setError("Enter your password");
        }
        else if (password !== userpassword) {
          setError("Username and Password do not match");
        }
        else{
          await AsyncStorage.setItem("currentUser",name);
          navigation.navigate('App');
        }
      }
    } catch (err) {
      alert(err);
    }
  };
  
  return (
      <Center>
          <Text style={styles.name}> Log In </Text>
          <Text style={styles.username}>{"username:"}</Text>
          <TextInput style={styles.input} onChangeText = {(text) => setName(text)} />
          <Text style={styles.username}>password: </Text>
          <TextInput style={styles.input} onChangeText = {(text) => setPassword(text)} />
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
        name="Diet"
        component={FoodRecommendation}
        options={{ header: () => null }}
      />
      <TabOneStack.Screen 
        name="Login" 
        component={Login} 
        options={{ header: () => null }}
      />
      <TabOneStack.Screen 
        name="FoodSearch" 
        component={FoodSearchScreen}
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
        name="Exercise"
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
        name="Progress"
        component={TabThreeScreen}
        options={{ header: () => null }}
      /> 
    </TabThreeStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile">
      <ProfileStack.Screen 
        name="Profile"
        component={ProfileScreen}
        options={{ headerLeft: () => null }}
      />
      <ProfileStack.Screen 
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ title: "Profile", headerLeft: () => null }}
      />
    </ProfileStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  username: {
    alignSelf: "stretch",
    marginLeft: 32,
    fontSize: 16,
    textAlign: 'left',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: "300",
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#575DD9",
    alignSelf: "stretch",
    margin: 10,
    marginLeft: 32,
    marginRight: 32,
    height: 48,
    borderRadius: 6,
    paddingHorizontal: 8,
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
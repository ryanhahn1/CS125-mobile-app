import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import TabThreeScreen from '../screens/TabThreeScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList, TabThreeParamList, AppParamList } from '../types';

import { Center } from '../src/Center';
import { Button, Text } from 'react-native';

function HomeScreen() {
  const navigation = useNavigation();
  return (
      <Center>
          <Text>I am a Home screen </Text>
          <Button 
              title="go to Tabs" 
              onPress={() => {
                  navigation.navigate('App');
              }}
          />
      </Center>
  );
}


const EntireApp = createStackNavigator<AppParamList>();

export default function AppNavigator() {
  return (
    <EntireApp.Navigator
      initialRouteName="Home">
        <EntireApp.Screen 
          name= "Home"
          component={HomeScreen}/>
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
  return (
      <Center>
          <Text>I am a login screen </Text>
          <Button 
              title="go to back to Tab one" 
              onPress={() => {
                  navigation.navigate('TabOneScreen');
              }}
          />
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

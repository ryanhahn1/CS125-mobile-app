import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native"
import { Button, Text, View } from 'react-native';
import { Center } from './Center';

interface RoutesProps {

}

const Stack = createStackNavigator()

function Login({navigation : any}) {
    return (
        <Center>
            <Text>I am a login screen </Text>
            <Button 
                title="go to register" 
                onPress={() => {
                    navigation.navigate('Register');
                }}
            />
        </Center>
    );
}

function Register({navigation : any}) {
    return (
        <Center>
            <Text>I am a register screen </Text>
            <Button
                title="go to login"
                onPress={() => {
                    navigation.navigate("Login");
                }}
            />
        </Center>
    );
}


export const Routes: React.FC<RoutesProps> = ({}) => {
    return (
        <Stack.Navigator>
            <Stack.Navigator>
             <Stack.Screen name="Login" component={Login} />
             <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
        </Stack.Navigator>
    );
} 
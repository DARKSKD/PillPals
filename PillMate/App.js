import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FrontScreen from './components/FrontScreen';
import LoginScreen from './components/LoginScreen';
import HelpScreen from './components/HelpScreen';
import HomeScreen from './components/HomeScreen';
import InputScreen from './components/InputScreen';
import UpdateScreen from './components/UpdateScreen';
import Chatbot from './components/Chatbot';


const Stack = createStackNavigator();


const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Front">
                <Stack.Screen name="Front" component={FrontScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="UpdateScreen" component={UpdateScreen} />
                <Stack.Screen name="Input" component={InputScreen} />
                <Stack.Screen name="Help" component={HelpScreen} />
                <Stack.Screen name="Chatbot" component={Chatbot} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default App;
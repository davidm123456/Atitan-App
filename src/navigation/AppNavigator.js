import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import SpotifyScreen from '../screens/SpotifyScreen';
import AppleMusicScreen from '../screens/AppleMusicScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SpotifyScreen" component={SpotifyScreen} />
        <Stack.Screen name="AppleMusicScreen" component={AppleMusicScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
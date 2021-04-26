import React from 'react'
// import { createSwitchNavigator,createAppContainer } from 'react-navigation'
import SignInScreen from './screens/SignIn'
import SignUpScreen from './screens/SignUp'
import HomeScreen from './screens/Home'
import TakeNotes from './screens/TakeNotes'

import CalculateGPAScreen from './screens/CalculateGPA';
import AddCourseScreen from './screens/AddCourse'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { useState } from 'react';
import firebase from './config/firebase'
import {Text,View} from 'react-native'

const Stack = createStackNavigator();

// const SwitchNavigator = createSwitchNavigator(
//     {
//         SignIn: {
//             screen: Login
//         },
//         SignUp: {
//             screen: Signup
//         },
//         Home: {
//             screen: Home
//         }
//     },
//     {
//         initialRouteName: 'Login'
//     }
// )

export default function App() {
  const [user ,setUser]=useState(null)
  const [isLoading ,setIsLoading]=useState(true)

  useEffect(()=>{
    firebase.auth().onAuthStateChanged(async(user) =>{
      if (user) {
        // User is signed in.
        console.log('---->',user);
        await setUser(user)
        await setIsLoading(false)
   
      } else {
        await setUser(null)

        await setIsLoading(false)
        
        // No user is signed in.
      }
    });
  },[])
  return (
  isLoading ?
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
       {/* <Text> LOADING .... </Text> */}
      
    </View>
  :
  !user ?
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Sign In" component={SignInScreen} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />

    </Stack.Navigator>
  </NavigationContainer>
  :
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Calculate GPA" component={CalculateGPAScreen} />
      <Stack.Screen name="Add Course" component={AddCourseScreen} />
      
      <Stack.Screen name="Take Notes" component={TakeNotes} />

    </Stack.Navigator>
  </NavigationContainer>
  );
}
// export default createAppContainer(SwitchNavigator)
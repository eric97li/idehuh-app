import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NativeAppEventEmitter, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from "./Login";
import SignUp from "./SignUp";
import Profile from "./Profile";
import Home from "./Home";
import Idehuh from "./Idehuh";
import Advice from "./Advice";

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      rating: 0,
      messages: [],
      questions: [],
      ideas: []
    }

    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  setUsername(y) {
    this.setState({username: y})
  }

  setPassword(x) {
    this.setState({password: x})
  }

  createIdehuhTabNavigator(props) {
    const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator>
      <Tab.Screen name="Profile" options={{
        tabBarIcon: () => {
          let iconName = `md-person`;
          return <Ionicons name={iconName} size={25}/>;
        }
      }}>
        {props => <Profile {...props} username={this.state.username} password={this.state.password}/>}</Tab.Screen>
    <Tab.Screen name="Home" options={{
        tabBarIcon: () => {
          let iconName = `md-home`;
          return <Ionicons name={iconName} size={25}/>;
        }
      }}>{props => <Home {...props} username={this.state.username} />}</Tab.Screen>
    <Tab.Screen name="Idehuhs" options={{
        tabBarIcon: () => {
          let iconName = `md-bulb`;
          return <Ionicons name={iconName} size={25}/>;
        }
      }}>{props => <Idehuh {...props} username={this.state.username} />}</Tab.Screen>
          <Tab.Screen name="Advice" options={{
        tabBarIcon: () => {
          let iconName = `md-cube`;
          return <Ionicons name={iconName} size={25}/>;
        }
      }}>{props => <Advice {...props} username={this.state.username} />}</Tab.Screen>
    </Tab.Navigator>
    );
  }

  render() {

    return(
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name = "Login"
          options={{title: 'Idehuh'}}
        >
          {props => <Login {...props} setUsernameCallBack={this.setUsername} setPasswordCallBack={this.setPassword}/>}
          </Stack.Screen>
        <Stack.Screen 
          name="Sign Up"
        >
          {props => <SignUp {...props} setUsernameCallBack={this.setUsername} setPasswordCallBack={this.setPassword}/>} 
        </Stack.Screen>
        <Stack.Screen name="Idehuh"> 
          {(props)=>this.createIdehuhTabNavigator(props)}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

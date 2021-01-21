import React, { Component } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IdeaAdvice from "./Idea3";
import QuestionAdvice from "./Question3";

const Tab = createMaterialTopTabNavigator();

export default class Advice extends Component{
  constructor(props) {
    super(props)
    this.state={
    

    }

  }

  //get & set profile information
  componentDidMount(){
    //   this.setState({firstName: "Bob"})

  }



  render() {
    
      return(
        <Tab.Navigator>
          <Tab.Screen name = "Question" component={QuestionAdvice}/>
          <Tab.Screen name = "Idea" component={IdeaAdvice}/>
        </Tab.Navigator>
      );
  }

}
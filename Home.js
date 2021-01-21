import React, { Component } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IdeaHome from "./Idea";
import QuestionHome from "./Question";

const Tab = createMaterialTopTabNavigator();

export default class Home extends Component{
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
          <Tab.Screen name = "Question" component={QuestionHome}/>
          <Tab.Screen name = "Idea" component={IdeaHome}/>
        </Tab.Navigator>
      );
  }

}
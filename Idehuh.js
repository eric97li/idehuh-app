import React, { Component } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IdeaIdehuhs from "./Idea2";
import QuestionIdehuhs from "./Question2";

const Tab = createMaterialTopTabNavigator();

export default class Idehuh extends Component{
  constructor(props) {
    super(props)
    this.state={
      questions: [],
      ideas: []

    }

    this.setQuestions = this.setQuestions.bind(this);
    this.setIdeas = this.setIdeas.bind(this);

  }

  setQuestions(x) {
    this.setState({questions: x})
  }

  setIdeas(y) {
    this.setState({ideas: y})
  }

  //get & set profile information
  componentDidMount(){
    //   this.setState({firstName: "Bob"})

  }



  render() {
    
      return(
        <Tab.Navigator>
        {/* <Tab.Screen name = "Question" component={QuestionIdehuhs}/>
        <Tab.Screen name = "Idea" component={IdeaIdehuhs}/> */}
        <Tab.Screen name="Question">{props => <QuestionIdehuhs {...props} username={this.props.username} ideas={this.state.ideas} setQuestionsCallBack={this.setQuestions} />}</Tab.Screen>
        <Tab.Screen name="Idea">{props => <IdeaIdehuhs {...props} username={this.props.username} questions={this.state.questions} setIdeasCallBack={this.setIdeas} />}</Tab.Screen>
        </Tab.Navigator>
      );
  }

}
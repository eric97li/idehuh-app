import React, { Component } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';

export default class SignUp extends Component{
  constructor(props) {
    super(props)
    this.state={
      username: "",
      password: ""
    }


  }

  signup_field=()=>{
    const {username, password} = this.state

    if(username == "") {
        alert("Username or password missing!")
        return false
      } else if(password == "") {
        alert("Username or password missing!")
        return false
      } else if(password.length < 5) {
        alert("Field password must be 5 characters or longer.")
        return false
      }

      //check that the username is unique
      return fetch('https://idehuh-api.herokuapp.com/users', {
        method: 'GET', 
      })
      .then(response => response.json())
      .then(response => {
        // console.log(response[0].name)

        //users begin at id 1
        //get list of usernames
        let usernameList = [];
        for(let i = 1; i < response.length; i++) {
          usernameList.push(response[i].username)
        }
        //check array of usernames
        //username is already taken
        if(usernameList.includes(username)) {
          alert("Username is already taken")
        }
        //username is unique, create account
        else {

          const data = {
            "username":username,
            "password":password,
            "name": username,
            "rating": 0,
            "messages": [],
            "questions": [],
            "ideas": [],
            "followers": [],
            "following": [],
            "savedQuestions": [],
            "savedIdeas": []
          };
    
          return fetch('https://idehuh-api.herokuapp.com/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          .then(response => {
            if(response.status == 201) {
              alert("Profile created")
            }
            //error
            else {
              alert("username already taken!")
            }
          })

        }
      })
    
  }

  render() {
    return(
        <View style={{width: "100%", height :"100%", justifyContent: "center"
      , alignSelf: "center", alignContent: "center", alignItems: "center"
      }}>
        <TextInput placeholder={"Username"}
        onChangeText={(value)=> this.setState({username: value})}
        style={{ height: 42, width: "80%", borderBottomWidth: 1}}
        />
        <TextInput placeholder={"Password"} 
        onChangeText={(value)=> this.setState({password: value})}
        style={{ height: 42, width: "80%", borderBottomWidth: 1, marginTop: "5%"}}
        />
            <View style={{marginTop: "10%", width: "80%"}}>
                <TouchableOpacity style={{ borderWidth : 1, height : 42, width: "80%"
              , justifyContent : "center", alignItems: "center", borderRadius: 40 ,
              backgroundColor: "black", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>this.signup_field()}
              >
                <Text style={{color: "white"}}> Sign Up </Text>
                </TouchableOpacity>
            </View>


              {/* <Text>{this.state.username}</Text>
              <Text>{this.state.password}</Text> */}

      </View>
    )
  }

}
import React, { Component } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';

export default class Login extends Component{
  constructor(props) {
    super(props)
    this.state={
      username: "",
      password: "",
    }


  }

  validate_field=()=>{
    const {username, password} = this.state

    if(username == "") {
      alert("Username or password is incorrect!")
      return false
    } else if(password == "") {
      alert("Username or password is incorrect!")
      return false
    }
    
    //check for the credentials entered by user with the api and retrieve account of user
          return fetch('https://idehuh-api.herokuapp.com/users', {
            method: 'GET', 
          })
          .then(response => response.json())
          .then(response => {
            // console.log(response[0].name)

            //only the initial api placeholder parameters index 0
            if(response.length == 1) {
              alert("Username entered does not match any account")
            }
    
            //users begin at id 1

            for(let i = 1; i < response.length; i++) {
              // console.log(response[i].username)
              // console.log(response[i].password)
              if((response[i].username == username) && (response[i].password == password)) {
                this.props.setUsernameCallBack(username);
                this.props.setPasswordCallBack(password);
                this.props.navigation.navigate('Idehuh');
                break;
              }
              //incorrect password
              else if((response[i].username == username) && (response[i].password != password)) {
                alert("Incorrect password")
              }
              //if by the end of the check no username matches then username doesn't exist
              if((response[i].username != username) && (i==response.length-1)) {
                alert("Username entered does not match any account")
              }
            }
 
          })
    
  }

  goToSignUp() {
    this.props.navigation.navigate('Sign Up');
  }


  render(){
    
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
                <TouchableOpacity accessible={true} accessibilityLabel="Login Button" accessibilityHint="Activate to login" style={{ borderWidth : 1, height : 42, width: "80%"
              , justifyContent : "center", alignItems: "center", borderRadius: 40 ,
              backgroundColor: "black", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>this.validate_field()}
              >
                <Text style={{color: "white"}}> Login </Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop: "10%", width: "80%"}}>
              <Text>New user?</Text>
            </View>
            <View style={{marginTop: "2.5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Sign Up Button" accessibilityHint="Activate to go to sign up page" style={{ borderWidth : 1, height : 42, width: "80%"
              , justifyContent : "center", alignItems: "center", borderRadius: 40 ,
              backgroundColor: "white", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>this.goToSignUp()}
              >
                <Text style={{color: "black"}}> Sign Up </Text>
                </TouchableOpacity>
            </View>

              {/* <Text>{this.state.username}</Text>
              <Text>{this.state.password}</Text>
              <Text>{this.state.token}</Text> */}

      </View>
    )
  }

}


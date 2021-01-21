import React, { Component } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';

export default class Profile extends Component{
  constructor(props) {
    super(props)
    this.state={
      username: "",
      password: ""
    }

  }

  //get & set profile information
  componentDidMount(){
    //   this.setState({firstName: "Bob"})
    this.setState({username: this.props.username})
    this.setState({password: this.props.password})

  }



  render() {
    // console.log(this.state.username)
    // console.log(this.state.password)

      return(
        <View style={{width: "50%", height :"95%", justifyContent: "center"
        , alignSelf: "center", alignContent: "center", alignItems: "center"
        }}>
        
        </View>
      )
  }

}
import React, { Component } from 'react';
import { ListItem } from 'react-native-elements';
import { Modal, TouchableHighlight, TouchableOpacity, TextInput, View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import moment from 'moment';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";

//Idea tab of Idehuhs Bottom Tab

export default class IdeaIdehuhs extends Component{
  constructor(props) {
    super(props)
    this.state={
      modalVisible: false,
      editModalVisible: false,
      replyModalVisible: false,
      ideas: [],
      idea: "",
      ideaInfo: "",
      editIdea: "",
      editIdeaInfo: "",
      ideaToEditID: "",
      replyIdea: "",
      ideaToReplyID: "",
      rating: "",
      rated: ""
    }

  }

  //get & set profile information
  componentDidMount(){
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
    //retrieve and set the list of ideas from user
    return fetch('https://idehuh-api.herokuapp.com/users', {
      method: 'GET',
    })
    .then(response => response.json())
    .then(response => {
      for(let i = 1; i < response.length; i++) {
        if(response[i].username==this.props.username){
          this.setState({ideas: response[i].ideas});
          this.props.setIdeasCallBack(response[i].ideas);
        }
      }
      // console.log("-----------------------------")
      // console.log(this.state.ideas)
    })

  });

  }

  setModalVisible = (visible) => {
     this.setState({ modalVisible: visible });
  }

  setEditModalVisible = (visible, currIdea, currIdeaInfo, ideaID) => {
    this.setState({ editModalVisible: visible });
    this.setState({ idea: currIdea});
    this.setState({ ideaInfo: currIdeaInfo});
    this.setState({ideaToEditID: ideaID});
  }

  manageEditModalVisible = (visible) => {
    this.setState({ editModalVisible: visible });
  }

  setReplyModalVisible = (visible, currIdea, rating, rated, ideaID) => {
    this.setState({ replyModalVisible: visible});
    this.setState({ idea: currIdea});
    this.setState({ ideaToReplyID: ideaID});
    this.setState({ rating: rating});
    this.setState({ rated: rated});
  }

  manageReplyModalVisible = (visible) => {
    this.setState({ replyModalVisible: visible});
  }

  addIdea = () => {
    //username is passed down through this.props.username from idehuh.js

    return fetch('https://idehuh-api.herokuapp.com/users', {
      method: 'GET', 
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response[0].name)

      //users begin at id 1

      for(let i = 1; i < response.length; i++) {
        // console.log(response[i].username)
        // console.log(response[i].password)
        if(response[i].username==this.props.username) {
          // alert(response[i].id)

          let name = response[i].name;
          let ID = response[i].id;
          let password = response[i].password;
          let rating = response[i].rating;
          let messages = [];
          let questions = this.props.questions;
          let addIdeaURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let ideas = response[i].ideas;

          //idea object to update internal array of ideas array
          const idea = {
            id: ideas.length,
            user: this.props.username,
            idea: this.state.idea,
            ideaInfo: this.state.ideaInfo,
            advice: [],
            adviceObjs: [],
            rating: 0,
            rated: "",
            // date: moment().format('YYYY-MM-DD HH:MM:SS'),
            date: new Date(),
            keywords: []
          };

          //concat idea object to array of ideas for the user
          let newIdeasArray = response[i].ideas.concat(idea);

          //make put request to update the ideas array with other original user params
          const ideaObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: questions,
            ideas: newIdeasArray,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(addIdeaURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ideaObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({ideas: response[i].ideas});
                  this.props.setIdeasCallBack(response[i].ideas);
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.ideas)
            })
          })


        }

      }

    })

  }

  removeIdea = (idea, id) => {

    return fetch('https://idehuh-api.herokuapp.com/users', {
      method: 'GET', 
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response[0].name)

      //users begin at id 1

      for(let i = 1; i < response.length; i++) {
        // console.log(response[i].username)
        // console.log(response[i].password)
        if(response[i].username==this.props.username) {
          // alert(response[i].id)

          let name = response[i].name;
          let ID = response[i].id;
          let password = response[i].password;
          let rating = response[i].rating;
          let messages = [];
          let questions = this.props.questions;
          let removeIdeaURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let ideas = response[i].ideas;

          //to remove we will add all elements except from the chosen to remove one
          //check that we are adding the not matching idea with the matching id and adding to new array
          let newIdeasArray = [];

          let indexer = 0;
          for(let i = 0; i < ideas.length; i++) {
            if((ideas[i].idea != idea) && (ideas[i].id != id)) {
              //readjust the indexes after idea removal
              ideas[i].id = indexer;
              indexer = indexer + 1;

              newIdeasArray = newIdeasArray.concat(ideas[i])
            }
          }

          //make put request to update the ideas array with other original user params
          const ideaObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: questions,
            ideas: newIdeasArray,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(removeIdeaURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ideaObj)
          })
          .then(response => {
            //get the user and set their list to retrieved ideas list from api
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({ideas: response[i].ideas});
                  this.props.setIdeasCallBack(response[i].ideas);
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.ideas)
            })
          })


        }

      }

    })
    
  }


  editIdea = (idea, ideaInfo, id) => {

    return fetch('https://idehuh-api.herokuapp.com/users', {
      method: 'GET', 
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response[0].name)

      //users begin at id 1

      for(let i = 1; i < response.length; i++) {
        // console.log(response[i].username)
        // console.log(response[i].password)
        if(response[i].username==this.props.username) {
          // alert(response[i].id)

          let name = response[i].name;
          let ID = response[i].id;
          let password = response[i].password;
          let rating = response[i].rating;
          let messages = [];
          let questions = this.props.questions;
          let addIdeaURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let ideas = response[i].ideas;

          //find matching idea and with matching id, edit the value with the user currently inputted idea change

          for(let i = 0; i < ideas.length; i++) {
            if(ideas[i].id == id) {
              ideas[i].idea = this.state.editIdea;
              ideas[i].ideaInfo = this.state.editIdeaInfo;
            }
            
          }

          //make put request to update the ideas array with the changed input
          const ideaObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: questions,
            ideas: ideas,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(addIdeaURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ideaObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({ideas: response[i].ideas});
                  this.props.setIdeasCallBack(response[i].ideas);
                  this.setState({idea: idea});
                  this.setState({ideaInfo: ideaInfo});
                  // console.log(this.state.ideas)
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.ideas)
            })
          })


        }

      }

    })

  }

  replyIdea = (reply, ratingIdea, ratedIdea, id) => {

    return fetch('https://idehuh-api.herokuapp.com/users', {
      method: 'GET', 
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response[0].name)

      //users begin at id 1

      for(let i = 1; i < response.length; i++) {
        // console.log(response[i].username)
        // console.log(response[i].password)
        if(response[i].username==this.props.username) {
          // alert(response[i].id)

          let name = response[i].name;
          let ID = response[i].id;
          let password = response[i].password;
          let rating = response[i].rating;
          let messages = [];
          let questions = this.props.questions;
          let addIdeaURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let ideas = response[i].ideas;
          let advice = [];
          let adviceObjs = [];

          //advice messages object
          const adviceObj = {
            id: id,
            user: this.props.username,
            idea: this.state.idea,
            ideaInfo: this.state.ideaInfo,
            advice: reply,
            rating: 0,
            rated: "",
            date: new Date(),
            keywords: []
          };

           //format reply string
           let formatReply = " | " + " (" + adviceObj.rating + ") " + adviceObj.advice + " | ";


          //loop through ideas and add to the advice array of that idea
          for(let i = 0; i < ideas.length; i++) {
            if(ideas[i].id == id) {
               advice = ideas[i].advice.concat(formatReply);
               adviceObjs = ideas[i].adviceObjs.concat(adviceObj);
            }
            
          }


          //reply object to update internal array of ideas array later
          const replyObj = {
            id: id,
            user: this.props.username,
            idea: this.state.idea,
            ideaInfo: this.state.ideaInfo,
            advice: advice,
            adviceObjs: adviceObjs,
            rating: ratingIdea,
            rated: ratedIdea,
            // date: moment().format('YYYY-MM-DD HH:MM:SS'),
            date: new Date(),
            keywords: []
          };

          //clear the idea of previous old advice array so we can concat updated array
          for(let i = 0; i < ideas.length; i++) {
            if(ideas[i].id == id) {
               ideas.splice(i, 1)
            }
            
          }

          //concat idea object to array of ideas for the user
          let newIdeasArray = ideas.concat(replyObj);

          //make put request to update the ideas array with other original user params
          const ideaObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: questions,
            ideas: newIdeasArray,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(addIdeaURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ideaObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({ideas: response[i].ideas});
                  this.props.setIdeasCallBack(response[i].ideas);
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.ideas)
            })
          })


        }

      }

    })
    

  }

  incrementIdeaRating = (idea, ideaInfo, ideaRating, ideaRated, id) => {

    return fetch('https://idehuh-api.herokuapp.com/users', {
      method: 'GET', 
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response[0].name)

      //users begin at id 1

      for(let i = 1; i < response.length; i++) {
        // console.log(response[i].username)
        // console.log(response[i].password)
        if(response[i].username==this.props.username) {
          // alert(response[i].id)

          let name = response[i].name;
          let ID = response[i].id;
          let password = response[i].password;
          let rating = response[i].rating;
          let messages = [];
          let questions = this.props.questions;
          let addIdeaURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let ideas = response[i].ideas;

          //increment the idea rating of the user

          for(let i = 0; i < ideas.length; i++) {
            //catch if not rated or was downvoted
            if(ideas[i].id == id && ((ideaRated == "") || (ideaRated == "1D"))) {
              ideas[i].rating = ideaRating + 1;
              //if was downvoted, compensate this and increase to desired upvote
              if(ideaRated == "1D") {
                ideas[i].rating = ideaRating + 2;
              }
              //rated with upvote
              ideas[i].rated = "1U";
              ideas[i].idea = idea;
              ideas[i].ideaInfo = ideaInfo;
            }
            
          }

          //make put request to update the ideas array with the changed input
          const ideaObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: questions,
            ideas: ideas,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(addIdeaURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ideaObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({ideas: response[i].ideas});
                  this.props.setIdeasCallBack(response[i].ideas);
                  this.setState({idea: idea});
                  this.setState({ideaInfo: ideaInfo});
                  // console.log(this.state.ideas)
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.ideas)
            })
          })


        }

      }

    })


  }

  decrementIdeaRating = (idea, ideaInfo, ideaRating, ideaRated, id) => {

    return fetch('https://idehuh-api.herokuapp.com/users', {
      method: 'GET', 
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response[0].name)

      //users begin at id 1

      for(let i = 1; i < response.length; i++) {
        // console.log(response[i].username)
        // console.log(response[i].password)
        if(response[i].username==this.props.username) {
          // alert(response[i].id)

          let name = response[i].name;
          let ID = response[i].id;
          let password = response[i].password;
          let rating = response[i].rating;
          let messages = [];
          let questions = this.props.questions;
          let addIdeaURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let ideas = response[i].ideas;

          //increment the idea rating of the user

          for(let i = 0; i < ideas.length; i++) {
            //catch if not rated or was upvoted
            if(ideas[i].id == id && ((ideaRated == "") || (ideaRated == "1U"))) {
              ideas[i].rating = ideaRating - 1;
              //if was upvoted and now mean't to decrement subtract another to compensate for this difference to correct downvote rating
              if(ideaRated == "1U") {
                ideas[i].rating = ideaRating - 2;
              }
              //rated with downvote
              ideas[i].rated = "1D";
              ideas[i].idea = idea;
              ideas[i].ideaInfo = ideaInfo;
            }
            
          }

          //make put request to update the ideas array with the changed input
          const ideaObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: questions,
            ideas: ideas,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(addIdeaURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ideaObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({ideas: response[i].ideas});
                  this.props.setIdeasCallBack(response[i].ideas);
                  this.setState({idea: idea});
                  this.setState({ideaInfo: ideaInfo});
                  // console.log(this.state.ideas)
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.ideas)
            })
          })


        }

      }

    })

  }


  componentWillUnmount() {
    this._unsubscribe();
  }


  render() {
    const { modalVisible, editModalVisible, replyModalVisible } = this.state;
    
      return(
        <View>

        <Modal visible={modalVisible}>
          <View>
          <Text style={{fontSize: 30}}>Add Idea</Text>

          <View style={{width: "100%", justifyContent: "center"
              , alignSelf: "center", alignContent: "center", alignItems: "center"
              }}>

          <TextInput multiline={true} placeholder={"Your idea"}
          onChangeText={(value)=> this.setState({idea: value})}
          style={{ height: 42, width: "80%", borderBottomWidth: 1}}
          />

          
          <TextInput style={{marginTop: "40%"}} placeholder={"Your idea info"}
          onChangeText={(value)=> this.setState({ideaInfo: value})}
          style={{ height: 42, width: "80%", borderBottomWidth: 1}}
          />

          <View style={{marginTop: "5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Add Idea" accessibilityHint="Activate to add idea now" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5,
              backgroundColor: "black", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.addIdea();}}
              >
                <Text style={{color: "white"}}> Add </Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop: "2.5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Close button" accessibilityHint="Activate to close add idea pane" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5,
              backgroundColor: "white", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.setModalVisible(!modalVisible);}}
              >
                <Text style={{color: "black"}}> Close </Text>
                </TouchableOpacity>
            </View>

            </View>
          
          </View>

        </Modal>

        <Modal visible={editModalVisible}>
          <View>
          <Text style={{fontSize: 30}}>Edit Idea</Text>

          <View style={{width: "100%", justifyContent: "center"
              , alignSelf: "center", alignContent: "center", alignItems: "center"
              }}>
              
              <Text style={{marginTop: "2.5%", fontSize: 20}}>Idea: {this.state.idea}</Text>
                <TextInput placeholder={this.state.idea}
                onChangeText={(value)=> this.setState({editIdea: value})}
                style={{ height: 42, width: "80%", borderBottomWidth: 1}}
                />

                <TextInput style={{marginTop: "40%"}} placeholder={this.state.ideaInfo}
                onChangeText={(value)=> this.setState({editIdeaInfo: value})}
                style={{ height: 42, width: "80%", borderBottomWidth: 1}}
                />

            <View style={{marginTop: "5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Update button" accessibilityHint="Activate to update idea now" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5 ,
              backgroundColor: "black", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.editIdea(this.state.editIdea, this.state.editIdeaInfo, this.state.ideaToEditID);}}
              >
                <Text style={{color: "white"}}> Update </Text>
                </TouchableOpacity>
            </View>

                <View style={{marginTop: "2.5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Close button" accessibilityHint="Activate to close edit idea pane" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5 ,
              backgroundColor: "white", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.manageEditModalVisible(!editModalVisible);}}
              >
                <Text style={{color: "black"}}> Close </Text>
                </TouchableOpacity>
            </View>
          
          </View>

          </View>
        </Modal>

        <Modal visible={replyModalVisible}>
              <View>
              <Text style={{fontSize: 30}}>Reply Idea</Text>

              <View style={{width: "100%", justifyContent: "center"
              , alignSelf: "center", alignContent: "center", alignItems: "center"
              }}>
              
              <Text style={{marginTop: "2.5%", fontSize: 20}}>Idea: {this.state.idea}</Text>
                <TextInput placeholder={"Your reply"}
                onChangeText={(value)=> this.setState({replyIdea: value})}
                style={{ height: 42, width: "80%", borderBottomWidth: 1}}
                />

            <View style={{marginTop: "5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Update button" accessibilityHint="Activate to reply idea now" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5 ,
              backgroundColor: "black", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.replyIdea(this.state.replyIdea, this.state.rating, this.state.rated, this.state.ideaToReplyID);}}
              >
                <Text style={{color: "white"}}> Send </Text>
                </TouchableOpacity>
            </View>

                <View style={{marginTop: "2.5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Close button" accessibilityHint="Activate to close reply idea pane" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5 ,
              backgroundColor: "white", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.manageReplyModalVisible(!replyModalVisible);}}
              >
                <Text style={{color: "black"}}> Close </Text>
                </TouchableOpacity>
            </View>
          
          </View>

              </View>
        </Modal>

        <View>
        {<ListItem bottomDivider>
        <ListItem.Content style={{alignItems:"center"}}>
          <Button accessible={true} accessibilityLabel="Add Idea" style={{borderRadius:50}} color="green" title="Add Idea" onPress={()=>{this.setModalVisible(!modalVisible);}}/>
        </ListItem.Content>
        </ListItem>
        }
        </View>
        
          <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          {
            this.state.ideas.map((x, i) => (
              <Collapse>
              <CollapseHeader>
              <ListItem key={i} bottomDivider>
                <ListItem.Content accessible={true}>
                  <ListItem.Title style={{fontSize: 20}}>
                    {x.idea}
                    </ListItem.Title>
                    <ListItem.Subtitle style={{marginTop: "0.5%", marginBottom: "2.5%"}}>{x.ideaInfo}</ListItem.Subtitle>
                    <ListItem.Title style = {{ flexDirection: "row"}} >
                        <Button color="red"  title="Remove" onPress={()=>{this.removeIdea(x.idea, x.id)}}></Button>
                        <Button color="orange" title="Edit" onPress={()=>{this.setEditModalVisible(!editModalVisible, x.idea, x.ideaInfo, x.id)}}></Button>
                        <Button color="purple" title="Reply" onPress={()=>{this.setReplyModalVisible(!replyModalVisible, x.idea, x.rating, x.rated, x.id)}}></Button>
                        </ListItem.Title>
                  <View>
                  <Text style={{marginLeft: "50%", marginTop: "5%", textDecorationLine: 'underline'}}>{x.advice.length} comments</Text>
                  </View>
                </ListItem.Content>
                <View style={{margin: 5, flexDirection: "row"}}>
                      <Button color="black" title="&#128077;" onPress={()=>{this.incrementIdeaRating(x.idea, x.ideaInfo, x.rating, x.rated, x.id)}}></Button>
                      <Text>({x.rating}) </Text>
                      <Button color="black" title="&#128078;" onPress={()=>{this.decrementIdeaRating(x.idea, x.ideaInfo, x.rating, x.rated, x.id)}}></Button>
                    </View>
              </ListItem>
              </CollapseHeader>
              <CollapseBody>
              {
              x.advice.map((y, t) =>(
                <ListItem key={t} bottomDivider>
                  <ListItem.Content accessible={true}>
                    <ListItem.Title>
                      {y}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              ))
              
              }
              </CollapseBody>
              </Collapse>
            ))
          }
          </ScrollView>

        </View>
      )
  }

}
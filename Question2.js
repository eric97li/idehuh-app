import React, { Component } from 'react';
import { ListItem } from 'react-native-elements';
import { Modal, TouchableHighlight, TouchableOpacity, TextInput, View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import moment from 'moment';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";

//Question tab of Idehuhs Bottom Tab

export default class QuestionIdehuhs extends Component{
  constructor(props) {
    super(props)
    this.state={
      modalVisible: false,
      editModalVisible: false,
      replyModalVisible: false,
      questions: [],
      question: "",
      questionInfo: "",
      editQuestion: "",
      editQuestionInfo: "",
      questionToEditID: "",
      replyQuestion: "",
      questionToReplyID: "",
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
          this.setState({questions: response[i].questions});
          this.props.setQuestionsCallBack(response[i].questions);
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

  setEditModalVisible = (visible, currQuestion, currQuestionInfo, questionID) => {
    this.setState({ editModalVisible: visible });
    this.setState({ question: currQuestion});
    this.setState({ questionInfo: currQuestionInfo});
    this.setState({questionToEditID: questionID});
  }

  manageEditModalVisible = (visible) => {
    this.setState({ editModalVisible: visible });
  }

  setReplyModalVisible = (visible, currQuestion, rating, rated, questionID) => {
    this.setState({ replyModalVisible: visible});
    this.setState({ question: currQuestion});
    this.setState({ questionToReplyID: questionID});
    this.setState({ rating: rating});
    this.setState({ rated: rated});
  }

  manageReplyModalVisible = (visible) => {
    this.setState({ replyModalVisible: visible});
  }

  addQuestion = () => {
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
          let ideas = this.props.ideas;
          let addQuestionURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let questions = response[i].questions;

          //question object to update internal array of questions array
          const question = {
            id: questions.length,
            user: this.props.username,
            question: this.state.question,
            questionInfo: this.state.questionInfo,
            advice: [],
            adviceObjs: [],
            rating: 0,
            rated: "",
            // date: moment().format('YYYY-MM-DD HH:MM:SS'),
            date: new Date(),
            keywords: []
          };

          //concat question object to array of questions for the user
          let newQuestionsArray = response[i].questions.concat(question);

          //make put request to update the questions array with other original user params
          const questionObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: newQuestionsArray,
            ideas: ideas,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(addQuestionURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({questions: response[i].questions});
                  this.props.setQuestionsCallBack(response[i].questions);
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.questions)
            })
          })


        }

      }

    })

  }

  removeQuestion = (question, id) => {

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
          let ideas = this.props.ideas;
          let removeQuestionURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let questions = response[i].questions;

          //to remove we will add all elements except from the chosen to remove one
          //check that we are adding the not matching idea with the matching id and adding to new array
          let newQuestionsArray = [];

          let indexer = 0;
          for(let i = 0; i < questions.length; i++) {
            if((questions[i].question != question) && (questions[i].id != id)) {
              //readjust the indexes after question removal
              questions[i].id = indexer;
              indexer = indexer + 1;

              newQuestionsArray = newQuestionsArray.concat(questions[i])
            }
          }

          //make put request to update the ideas array with other original user params
          const questionObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: newQuestionsArray,
            ideas: ideas,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(removeQuestionURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionObj)
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
                  this.setState({questions: response[i].questions});
                  this.props.setQuestionsCallBack(response[i].questions);
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.questions)
            })
          })


        }

      }

    })
    
  }


  editQuestion = (question, questionInfo, id) => {

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
          let ideas = this.props.ideas;
          let addQuestionURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let questions = response[i].questions;

          //find matching idea and with matching id, edit the value with the user currently inputted idea change

          for(let i = 0; i < questions.length; i++) {
            if(questions[i].id == id) {
              questions[i].question = this.state.editQuestion;
              questions[i].questionInfo = this.state.editQuestionInfo;
            }
            
          }

          //make put request to update the ideas array with the changed input
          const questionObj = {
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

          return fetch(addQuestionURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({questions: response[i].questions});
                  this.props.setQuestionsCallBack(response[i].questions);
                  this.setState({question: question});
                  this.setState({questionInfo: questionInfo});
                  // console.log(this.state.questions)
                }
              }
              // console.log("-----------------------------")
              // console.log(this.state.questions)
            })
          })


        }

      }

    })

  }

  replyQuestion = (reply, ratingQuestion, ratedQuestion, id) => {

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
          let ideas = this.props.ideas;
          let addQuestionURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let questions = response[i].questions;
          let advice = [];
          let adviceObjs = [];

          //advice messages object
          const adviceObj = {
            id: id,
            user: this.props.username,
            question: this.state.question,
            questionInfo: this.state.questionInfo,
            advice: reply,
            rating: 0,
            rated: "",
            date: new Date(),
            keywords: []
          };

           //format reply string
           let formatReply = " | " + " (" + adviceObj.rating + ") " + adviceObj.advice + " | ";


          //loop through questions and add to the advice array of that question
          for(let i = 0; i < questions.length; i++) {
            if(questions[i].id == id) {
               advice = questions[i].advice.concat(formatReply);
               adviceObjs = questions[i].adviceObjs.concat(adviceObj);
            }
            
          }


          //reply object to update internal array of questions array later
          const replyObj = {
            id: id,
            user: this.props.username,
            question: this.state.question,
            questionInfo: this.state.questionInfo,
            advice: advice,
            adviceObjs: adviceObjs,
            rating: ratingQuestion,
            rated: ratedQuestion,
            // date: moment().format('YYYY-MM-DD HH:MM:SS'),
            date: new Date(),
            keywords: []
          };

          //clear the question of previous old advice array so we can concat updated array
          for(let i = 0; i < questions.length; i++) {
            if(questions[i].id == id) {
               questions.splice(i, 1)
            }
            
          }

          //concat question object to array of questions for the user
          let newQuestionsArray = questions.concat(replyObj);

          //make put request to update the questions array with other original user params
          const questionObj = {
            id: ID,
            name: name,
            username: this.props.username,
            password: password,
            rating: rating,
            messages: messages,
            questions: newQuestionsArray,
            ideas: ideas,
            followers: [],
            following: [],
            savedQuestions: [],
            savedIdeas: []
          }

          return fetch(addQuestionURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({questions: response[i].questions});
                  this.props.setQuestionsCallBack(response[i].questions);
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


  incrementQuestionRating = (question, questionInfo, questionRating, questionRated, id) => {

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
          let ideas = this.props.ideas;
          let addQuestionURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let questions = response[i].questions;

          //increment the idea rating of the user

          for(let i = 0; i < questions.length; i++) {
            //catch if not rated or if was downvoted
            if(questions[i].id == id && ((questionRated == "") || (questionRated=="1D"))) {
              questions[i].rating = questionRating + 1;
              //if was downvoted increment an additional to compensate for the downvote and correct to actual upvote rating
              if(questionRated == "1D") {
                questions[i].rating = questionRating + 2;
              }
              //was rated with an upvote
              questions[i].rated = "1U";
              questions[i].question = question
              questions[i].questionInfo = questionInfo
            }
            
          }

          //make put request to update the ideas array with the changed input
          const questionObj = {
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

          return fetch(addQuestionURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({questions: response[i].questions});
                  this.props.setQuestionsCallBack(response[i].questions);
                  this.setState({question: question});
                  this.setState({questionInfo: questionInfo});
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

  decrementQuestionRating = (question, questionInfo, questionRating, questionRated, id) => {

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
          let ideas = this.props.ideas;
          let addQuestionURL = "https://idehuh-api.herokuapp.com/users/" + ID

          let questions = response[i].questions;

          //increment the idea rating of the user

          for(let i = 0; i < questions.length; i++) {
            //catch if not rated or was upvoted
            if(questions[i].id == id && ((questionRated == "") || (questionRated=="1U"))) {
              questions[i].rating = questionRating - 1;
              //if was upvoted and mean't to decrement then subtract another to compensate to correct starting, then decrement to actual downvote rating
              if(questionRated == "1U") {
                questions[i].rating = questionRating - 2;
              }
              //was rated with downvote
              questions[i].rated = "1D";
              questions[i].question = question
              questions[i].questionInfo = questionInfo
            }
            
          }

          //make put request to update the ideas array with the changed input
          const questionObj = {
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

          return fetch(addQuestionURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionObj)
          })
          .then(response => {
            return fetch('https://idehuh-api.herokuapp.com/users', {
              method: 'GET',
            })
            .then(response => response.json())
            .then(response => {
              for(let i = 1; i < response.length; i++) {
                if(response[i].username==this.props.username){
                  this.setState({questions: response[i].questions});
                  this.props.setQuestionsCallBack(response[i].questions);
                  this.setState({question: question});
                  this.setState({questionInfo: questionInfo});
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
          <Text style={{fontSize: 30}}>Add Question</Text>

          <View style={{width: "100%", justifyContent: "center"
              , alignSelf: "center", alignContent: "center", alignItems: "center"
              }}>

          <TextInput multiline={true} placeholder={"Your question"}
          onChangeText={(value)=> this.setState({question: value})}
          style={{ height: 42, width: "80%", borderBottomWidth: 1}}
          />

          
          <TextInput style={{marginTop: "40%"}} placeholder={"Your question info"}
          onChangeText={(value)=> this.setState({questionInfo: value})}
          style={{ height: 42, width: "80%", borderBottomWidth: 1}}
          />

          <View style={{marginTop: "5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Add Question" accessibilityHint="Activate to add question now" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5,
              backgroundColor: "black", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.addQuestion();}}
              >
                <Text style={{color: "white"}}> Add </Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop: "2.5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Close button" accessibilityHint="Activate to close add question pane" style={{ borderWidth : 1, height : 42, width: "60%"
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
          <Text style={{fontSize: 30}}>Edit Question</Text>

          <View style={{width: "100%", justifyContent: "center"
              , alignSelf: "center", alignContent: "center", alignItems: "center"
              }}>
              
              <Text style={{marginTop: "2.5%", fontSize: 20}}>Question: {this.state.question}</Text>
                <TextInput placeholder={this.state.question}
                onChangeText={(value)=> this.setState({editQuestion: value})}
                style={{ height: 42, width: "80%", borderBottomWidth: 1}}
                />

                <TextInput style={{marginTop: "40%"}} placeholder={this.state.questionInfo}
                onChangeText={(value)=> this.setState({editQuestionInfo: value})}
                style={{ height: 42, width: "80%", borderBottomWidth: 1}}
                />

            <View style={{marginTop: "5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Update button" accessibilityHint="Activate to update question now" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5 ,
              backgroundColor: "black", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.editQuestion(this.state.editQuestion, this.state.editQuestionInfo, this.state.questionToEditID);}}
              >
                <Text style={{color: "white"}}> Update </Text>
                </TouchableOpacity>
            </View>

                <View style={{marginTop: "2.5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Close button" accessibilityHint="Activate to close edit question pane" style={{ borderWidth : 1, height : 42, width: "60%"
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
              <Text style={{fontSize: 30}}>Reply Question</Text>

              <View style={{width: "100%", justifyContent: "center"
              , alignSelf: "center", alignContent: "center", alignItems: "center"
              }}>
              
              <Text style={{marginTop: "2.5%", fontSize: 20}}>Question: {this.state.question}</Text>
                <TextInput placeholder={"Your reply"}
                onChangeText={(value)=> this.setState({replyQuestion: value})}
                style={{ height: 42, width: "80%", borderBottomWidth: 1}}
                />

            <View style={{marginTop: "5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Update button" accessibilityHint="Activate to reply question now" style={{ borderWidth : 1, height : 42, width: "60%"
              , justifyContent : "center", alignItems: "center", borderRadius: 5 ,
              backgroundColor: "black", alignSelf: "center", textAlign : "center"
              }}
              onPress={()=>{this.replyQuestion(this.state.replyQuestion, this.state.rating, this.state.rated, this.state.questionToReplyID);}}
              >
                <Text style={{color: "white"}}> Send </Text>
                </TouchableOpacity>
            </View>

                <View style={{marginTop: "2.5%", width: "80%"}}>
                <TouchableOpacity accessible={true} accessibilityLabel="Close button" accessibilityHint="Activate to close reply question pane" style={{ borderWidth : 1, height : 42, width: "60%"
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
          <Button accessible={true} accessibilityLabel="Add Question" style={{borderRadius:50}} color="green" title="Add Question" onPress={()=>{this.setModalVisible(!modalVisible);}}/>
        </ListItem.Content>
        </ListItem>
        }
        </View>
        
        <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          {
            this.state.questions.map((x, i) => (
              <Collapse>
              <CollapseHeader>
              <ListItem key={i} bottomDivider>
                <ListItem.Content accessible={true}>
                  <ListItem.Title style={{fontSize: 20}}>
                    {x.question}
                    </ListItem.Title>
                    <ListItem.Subtitle style={{marginTop: "0.5%", marginBottom: "2.5%"}}>{x.questionInfo}</ListItem.Subtitle>
                    <ListItem.Title style = {{ flexDirection: "row"}} >
                        <Button color="red"  title="Remove" onPress={()=>{this.removeQuestion(x.question, x.id)}}></Button>
                        <Button color="orange" title="Edit" onPress={()=>{this.setEditModalVisible(!editModalVisible, x.question, x.questionInfo, x.id)}}></Button>
                        <Button color="purple" title="Reply" onPress={()=>{this.setReplyModalVisible(!replyModalVisible, x.question, x.rating, x.rated, x.id)}}></Button>
                        </ListItem.Title>
                  <View>
                  <Text style={{marginLeft: "50%", marginTop: "5%", textDecorationLine: 'underline'}}>{x.advice.length} comments</Text>
                  </View>
                </ListItem.Content>
                <View style={{margin: 5, flexDirection: "row"}}>
                      <Button color="black" title="&#128077;" onPress={()=>{this.incrementQuestionRating(x.question, x.questionInfo, x.rating, x.rated, x.id)}}></Button>
                      <Text>({x.rating}) </Text>
                      <Button color="black" title="&#128078;" onPress={()=>{this.decrementQuestionRating(x.question, x.questionInfo, x.rating, x.rated, x.id)}}></Button>
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
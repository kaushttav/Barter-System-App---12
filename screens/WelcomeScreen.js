import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, KeyboardAvoidingView, Alert, Modal, TouchableOpacity, TextInput } from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends Component {
  constructor(){
    super();
    this.state={
      emailId:'',
      password:'',
      firstName:'',
      lastName:'',
      address:'',
      contact:'',
      confirmPassword:'',
      isModalVisible:'false'
    }
  }

  userSignUp = (emailId, password,confirmPassword) =>{
   if(password !== confirmPassword){
       return Alert.alert("Password doesn't match.\nPlease check your password.")
   }else{
     firebase.auth().createUserWithEmailAndPassword(emailId, password)
     .then(()=>{
       db.collection('users').add({
         first_name:this.state.firstName,
         last_name:this.state.lastName,
         contact:this.state.contact,
         email_id:this.state.emailId,
         address:this.state.address,
         isExchangeRequestActive: false
       })
       return  Alert.alert(
            'User added successfully',
            '',
            [
              {text: 'OK', onPress: () => this.setState({
                "isModalVisible" : false
              })
              }
            ]
        );
     })
     .catch((error)=> {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       return Alert.alert(errorMessage)
     });
   }
 }

userLogin = (emailId, password)=>{
   firebase.auth().signInWithEmailAndPassword(emailId, password)
   .then(()=>{
    this.props.navigation.navigate('HomeScreen')
    })
   .catch((error)=> {
     var errorCode = error.code;
     var errorMessage = error.message;
     return Alert.alert(errorMessage)
   })
 }

showModal = () =>{
  return(
    <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.isModalVisible}
      >
    <View style={styles.modalContainer}>
      <ScrollView style={{width:'100%'}}>
        <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
          <Text
            style={styles.modalTitle}
            >Registration</Text>
          <TextInput
            style={styles.loginBox}
            placeholder ={"First Name"}
            maxLength ={10}
            onChangeText={(text)=>{
              this.setState({
                firstName: text
              })
            }}
          />
          <TextInput
            style={styles.loginBox}
            placeholder ={"Last Name"}
            maxLength ={15}
            onChangeText={(text)=>{
              this.setState({
                lastName: text
              })
            }}
          />
          <TextInput
            style={styles.loginBox}
            placeholder ={"Contact"}
            maxLength ={10}
            keyboardType={'numeric'}
            onChangeText={(text)=>{
              this.setState({
                contact: text
              })
            }}
          />
          <TextInput
            style={styles.loginBox}
            placeholder ={"Address"}
            multiline = {true}
            onChangeText={(text)=>{
              this.setState({
                address: text
              })
            }}
          />
          <TextInput
            style={styles.loginBox}
            placeholder ={"Email"}
            keyboardType ={'email-address'}
            onChangeText={(text)=>{
              this.setState({
                emailId: text
              })
            }}
          /><TextInput
            style={styles.loginBox}
            placeholder ={"Password"}
            secureTextEntry = {true}
            onChangeText={(text)=>{
              this.setState({
                password: text
              })
            }}
          /><TextInput
            style={styles.loginBox}
            placeholder ={"Confirm Password"}
            secureTextEntry = {true}
            onChangeText={(text)=>{
              this.setState({
                confirmPassword: text
              })
            }}
          />
          <View style={styles.modalBackButton}>
            <TouchableOpacity
              style={[styles.button,{marginBottom:20, marginTop:20}]}
              onPress={()=>
                this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)
              }
            >
            <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBackButton}>
            <TouchableOpacity
              style={styles.button}
              onPress={()=>this.setState({
                  "isModalVisible":false
                })}>
            <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  </Modal>
)
}
  render(){
    return(
      <View style={styles.container}>
        <View style={{justifyContent: 'center',alignItems: 'center'}}>

        </View>
          {
            this.showModal()
          }
        <View style={{justifyContent:'center', alignItems:'center'}}>
        <Image source = {require('../assets/sharing.jpg')} style = {{width: 250, height: 150}}/>
          <Text style={styles.title}>Barter System</Text>
        </View>
        <View>
            <TextInput
            style={styles.loginBox}
            placeholder="abc@example.com"
            keyboardType ='email-address'
            onChangeText={(text)=>{
              this.setState({
                emailId: text
              })
            }}
          />
          <TextInput
          style={styles.loginBox}
          secureTextEntry = {true}
          placeholder="Enter Password"
          onChangeText={(text)=>{
            this.setState({
              password: text
            })
          }}
        />
        <TouchableOpacity
           style={[styles.button,{marginBottom:20, marginTop:20}]}
           onPress = {()=>{
             this.userLogin(this.state.emailId, this.state.password)
           }}
           >
           <Text style={styles.buttonText}>Login</Text>
         </TouchableOpacity>

         <TouchableOpacity
          style={styles.button}
          onPress={()=>this.setState({
              isModalVisible:true
            })
            }
           >
           <Text style={styles.buttonText}>Sign Up</Text>
         </TouchableOpacity>
      </View>
    </View>
    )
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#FFE0B2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    fontSize:50,
    fontWeight:'300',
    marginTop:50,
    color : '#F69400'
  },
  loginBox:{
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor : '#F69400',
    fontSize: 20,
    margin:15,
    paddingLeft:10
  },
  button:{
    width:300,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:25,
    backgroundColor:"#DEAC35",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.30,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText:{
    color:'#ffff',
    fontWeight:'200',
    fontSize:20
  },
  buttonContainer:{
    flex: 1,
    alignItems: 'center'
  },
  KeyboardAvoidingView:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitle:{
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 30,
    color: '#F69400',
    margin: 30
  },
  modalContainer:{
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ffff",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80
  }
})
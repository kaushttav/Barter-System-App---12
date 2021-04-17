import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import{ Card, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class UserDetailsScreen extends Component {
  constructor(props){
    super(props);
    this.state ={
    userId: firebase.auth().currentUser.email,
    userName: '',
    exchangerId: this.props.navigation.getParam('details')["username"],
    requestId: this.props.navigation.getParam('details')["request_id"],
    itemName: this.props.navigation.getParam('details')["item_name"],
    reason_for_requesting: this.props.navigation.getParam('details')["description"],
    exchangerName: '',
    exchangerContact: '',
    exchangerAddress: '',
    exchangerRequestDocId: ''
  }
}

  getExchangerDetails() {
    db.collection('users').where('email_id','==',this.state.exchangerId).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
      this.setState({
        exchangerName: doc.data().first_name,
        exchangerContact: doc.data().contact,
        exchangerAddress: doc.data().address
      })
    })
  });

    db.collection('exchange_requests').where('request_id','==',this.state.requestId).get()
    .then(snapshot=>{
      snapshot.forEach(doc => {
        this.setState({exchangerRequestDocId: doc.id})
    })
  })}

addBarters = () =>{
  db.collection('my_barters').add({
    item_name: this.state.itemName,
    exchanger_name: this.state.exchangerName,
    exchanger_address: this.state.exchangerAddress,
    exchanger_contact: this.state.exchangerContact,
    user_id: this.state.userId,
    request_id: this.state.requestId,
    request_status:  "User Interested"
  })
}

addNotification=()=>{
  var message = this.state.userName + " has shown interest in exchanging the item"
  db.collection("all_notifications").add({
    "targeted_user_id" : this.state.exchangerId,
    "exchanger_id" : this.state.userId,
    "request_id" : this.state.requestId,
    "item_name" : this.state.itemName,
    "date" : firebase.firestore.FieldValue.serverTimestamp(),
    "notification_status" : "unread",
    "message" : message
  })
}

getUserDetails=(userId)=>{
  db.collection("users").where('email_id','==', userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      this.setState({
        userName :doc.data().first_name + " " + doc.data().last_name
      })
    })
  })
}

componentDidMount(){
  this.getExchangerDetails()
  this.getUserDetails(this.state.userId)
}
  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <SafeAreaProvider>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#fff'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Exchange Items", style: { color: '#fff', fontSize: 29, fontWeight:"bold" }}}
            backgroundColor = "#F69400"
          />
          </SafeAreaProvider>
        </View>
        <View style={{flex:0.3, marginTop: 40}}>
          <Card containerStyle = {{backgroundColor: '#FFEDA6'}}>
            <Card containerStyle = {{backgroundColor: "#F69400"}}>
              <Text style={{fontWeight: 'bold', color: '#fff'}}>Item Name: {this.state.itemName}</Text>
            </Card>
            <Card containerStyle = {{backgroundColor: "#F69400"}}>
              <Text style={{fontWeight: 'bold', color: '#fff'}}>Reason: {this.state.reason_for_requesting}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex: 0.3}}>
          <Card containerStyle = {{backgroundColor: '#FFEDA6'}}>
            <Card containerStyle = {{backgroundColor: "#F69400"}}>
              <Text style={{fontWeight:'bold', color: '#fff'}}>Name: {this.state.exchangerName}</Text>
            </Card>
            <Card containerStyle = {{backgroundColor: "#F69400"}}>
              <Text style={{fontWeight:'bold', color: '#fff'}}>Contact: {this.state.exchangerContact}</Text>
            </Card>
            <Card containerStyle = {{backgroundColor: "#F69400"}}>
              <Text style={{fontWeight:'bold', color: '#fff'}}>Address: {this.state.exchangerAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.exchangerId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.addBarters()
                    this.addNotification()
                    this.props.navigation.navigate('MyBarters')
                  }}>
                <Text style={{fontWeight:'bold', color: '#fff'}}>I want to barter</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#FFE0B2'
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#DEAC35",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    }
})
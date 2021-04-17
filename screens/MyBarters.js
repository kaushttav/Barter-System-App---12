import React, {Component} from 'react'
import { View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements'
import Header from '../components/Header.js';
import firebase from 'firebase';
import db from '../config.js'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class MyBartersScreen extends Component {
  static navigationOptions = { header: null };

   constructor() {
     super()
     this.state ={
       userId : firebase.auth().currentUser.email,
       userName: '',
       allBarters: []
     }
     this.requestRef = null
   }


   getAllBarters = () =>{
     this.requestRef = db.collection("my_barters").where("user_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allBarters = []
       snapshot.docs.map((doc) =>{
        var barter = doc.data()
        barter["doc_id"] = doc.id
        allBarters.push(barter)
      });
       this.setState({
        allBarters: allBarters
       });
     })
   }

   getUserDetails=(userId)=>{
    db.collection("users").where("email_id","==", userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          "userName" : doc.data().first_name + " " + doc.data().last_name
        })
      });
    })
  }

  sendNotification = (itemDetails,exchangeStatus) =>{
    var exchangeId = itemDetails.request_id
    var userId = itemDetails.user_id
    db.collection("all_notifications")
    .where("request_id", "==", exchangeId)
    .where("exchanger_id", "==", userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        var message = ""
        if(exchangeStatus === "Item Sent"){
          message = this.state.userName + " has sent you the item"
        }
        else{
           message =  this.state.userName  + " has shown interest in exchanging the item"
        }
        db.collection("all_notifications").doc(doc.id).update({
          "message": message,
          "notification_status" : "unread",
          "date"                : firebase.firestore.FieldValue.serverTimestamp()
        })
      });
    })
  }

  sendItem = (itemDetails) =>{
    if(itemDetails.request_status === "Item Sent"){
      var exchangeStatus = "User Interested"
      db.collection("my_barters").doc(itemDetails.doc_id).update({
        "request_status" : "User Interested"
      })
      this.sendNotification(itemDetails,exchangeStatus)
    }
    else{
      var exchangeStatus = "Item Sent"
      db.collection("my_barters").doc(itemDetails.doc_id).update({
        "request_status" : "Item Sent"
      })
      this.sendNotification(itemDetails,exchangeStatus)
    }
  }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
    <ListItem key = {i} bottomDivider containerStyle = {{backgroundColor: '#FFEDA6', marginTop: 20}}>
      <ListItem.Chevron name = "gift" type = "feather" color = '#5C5127' size = {30}/>
      <ListItem.Content>
        <ListItem.Title style = {{color: '#5C5127', fontWeight: 'bold'}}>{item.item_name}</ListItem.Title>
        <ListItem.Subtitle style = {{color: '#DEAC35'}}>{"Requested By: " + item.exchanger_name +"\nStatus: " + item.request_status}</ListItem.Subtitle>
      </ListItem.Content>
      <TouchableOpacity style={styles.button}>
        <Text
        style={{color:'#ffff'}}
        onPress = {() =>{
          this.sendItem(item)
        }}>{item.request_status === "Item Sent" ? "Item Sent" : "Send Item" }</Text>
      </TouchableOpacity>
    </ListItem>
  )


   componentDidMount(){
     this.getAllBarters()
     this.getUserDetails(this.state.userId)
   }

   render(){
     return(
       <View style={{flex:1, backgroundColor: '#FFE0B2'}}>
         <SafeAreaProvider>
         <Header navigation={this.props.navigation} title="My Barters"/>
         </SafeAreaProvider>
         <View style={{flex:1}}>
           {
             this.state.allBarters.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 25 }}>List Of All Barters</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allBarters}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#F69400",
      shadowColor: "#000",
      shadowOffset: {
         width:0,
         height:8
      }
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})
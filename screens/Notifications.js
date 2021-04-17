import React, { Component } from 'react';
import { StyleSheet, View, FlatList,Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import Header from '../components/Header';
import SwipeableFlatlist from '../components/SwipeableFlatlist';
import db from '../config';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class Notifications extends Component{
  constructor(props) {
    super(props);

    this.state = {
      userId :  firebase.auth().currentUser.email,
      allNotifications : []
    };

    this.notificationRef = null
  }

  getNotifications=()=>{
    this.requestRef = db.collection("all_notifications")
    .where("notification_status", "==", "unread")
    .where("targeted_user_id",'==',this.state.userId)
    .onSnapshot((snapshot)=>{
      var allNotifications =  []
      snapshot.docs.map((doc) =>{
        var notification = doc.data()
        notification["doc_id"] = doc.id
        allNotifications.push(notification)
      });
      this.setState({
          allNotifications : allNotifications
      });
    })
  }

  componentDidMount(){
    this.getNotifications()
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({item,index}) =>{
      return (
        <ListItem key = {index} bottomDivider containerStyle = {{backgroundColor: '#FFEDA6', marginTop: 20}}>
            <ListItem.Chevron name = "gift" type = "feather" color = '#5C5127' size = {30}/>
            <ListItem.Content>
              <ListItem.Title style = {{color: '#5C5127', fontWeight: 'bold'}}>{item.item_name}</ListItem.Title>
              <ListItem.Subtitle style = {{color: '#DEAC35'}}>{item.message}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
      )
 }


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <SafeAreaProvider>
          <Header title={"Notifications"} navigation={this.props.navigation}/>
          </SafeAreaProvider>
        </View>
        <View style={{flex:0.9}}>
          {
            this.state.allNotifications.length === 0
            ?(
              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:25}}>You have no notifications</Text>
              </View>
            )
            :(
              <SwipeableFlatlist allNotifications={this.state.allNotifications}/>
            )
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor: '#FFE0B2'
  }
})
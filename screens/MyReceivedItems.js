import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert, ScrollView, FlatList } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import Header from '../components/Header';
import { ListItem } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class MyReceivedItems extends React.Component {
    constructor() {
        super();
        this.state ={
            userId: firebase.auth().currentUser.email,
            receivedItemsList: []
        }
    }

    getReceivedItemsList =()=>{
        this.requestRef = db.collection("exchange_requests")
        .where('username','==',this.state.userId)
        .where("request_status", '==','received')
        .onSnapshot((snapshot)=>{
            var receivedItemsList = snapshot.docs.map((doc) => doc.data())
            this.setState({
                receivedItemsList: receivedItemsList
            });
        })
    }

    componentDidMount() {
        this.getReceivedItemsList()
    }
    
    keyExtractor = (item, index) => index.toString()
    
    renderItem = ( {item, i} ) =>{
        console.log(item.item_name);
        return (
        <ListItem key = {i} bottomDivider containerStyle = {{backgroundColor: '#FFEDA6', marginTop: 20}}>
            <ListItem.Content>
                <ListItem.Title style = {{color: '#5C5127', fontWeight: 'bold'}}>{item.item_name}</ListItem.Title>
                <ListItem.Subtitle style = {{color: '#DEAC35'}}>{item.request_status}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        )
    }

    render(){
        return(
        <View style={{flex:1, backgroundColor: '#FFE0B2'}}>
            <SafeAreaProvider>
            <Header title="Received Items" navigation ={this.props.navigation}/>
            </SafeAreaProvider>
            <View style={{flex:1}}>
            { this.state.receivedItemsList.length === 0 ?(
            <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Your Received Items</Text>
            </View>
            )
            :(
            <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.receivedItemsList}
            renderItem={this.renderItem} />
            )}
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    subContainer:{
        flex:1,
        fontSize: 20,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        }
    }
})
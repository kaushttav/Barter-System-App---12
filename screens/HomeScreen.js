import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import db from '../config';
import Header from '../components/Header';
import { ListItem } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class HomeScreen extends React.Component {
    constructor() {
        super();
        this.state ={
            allItems: []
        }
        this.exchangeRef = null;
    }

    getAllItems = () =>{
        this.exchangeRef = db.collection("exchange_requests")
        .onSnapshot((snapshot)=>{
            var allItems = snapshot.docs.map(document => document.data());
            this.setState({
                allItems: allItems
            })
        })
    }

    componentDidMount() {
        this.getAllItems()
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ( {item, i} ) =>{
        return (
            <ListItem key = {i} bottomDivider containerStyle = {{backgroundColor: '#FFEDA6', marginTop: 20}}>
                <ListItem.Content>
                    <ListItem.Title style = {{color: '#5C5127', fontWeight: 'bold'}}>{item.item_name}</ListItem.Title>
                    <ListItem.Subtitle style = {{color: '#DEAC35'}}>{item.description}</ListItem.Subtitle>
                </ListItem.Content>
                <TouchableOpacity
                style = {styles.view}
                onPress ={()=>{
                    this.props.navigation.navigate("UserDetails",{"details": item})
                }}>
                    <Text style = {{color:'#ffff'}}>View</Text>
                </TouchableOpacity>
          </ListItem>
        )
    }

    render() {
        return(
        <View style = {{flex: 1, backgroundColor: '#FFE0B2'}}>
            <SafeAreaProvider>
            <Header title = "Home" navigation = {this.props.navigation}/>
            </SafeAreaProvider>
            <View style = {{flex: 1}}>
            {
                this.state.allItems.length === 0
                ?(
                <View style = {styles.default}>
                    <Text style = {{fontSize: 20, color: '#5C5127', fontWeight: 'bold'}}>All requested items</Text>
                </View>
                )
                :(
                <FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {this.state.allItems}
                    renderItem = {this.renderItem}
                />
                )
            }
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    default:{
      flex:1,
      fontSize:20,
      justifyContent:'center',
      alignItems:'center'
    },
    view:{
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
    }
  })
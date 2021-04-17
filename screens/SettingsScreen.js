import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import Header from '../components/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class SettingsScreen extends Component{
    constructor() {
        super();
        this.state = {
            emailId: "",
            firstName: "",
            lastName: "",
            contact: "",
            address: "",
            docId: ""
        }
    }

    getData = () =>{
        var email = firebase.auth().currentUser.email;
        db.collection('users').where('email_id','==',email).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var data = doc.data()
                this.setState({
                    emailId: data.email_id,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    address: data.address,
                    contact: data.contact,
                    docId : doc.id
                })
            });
        })
    }

    updateData = () =>{
        db.collection('users').doc(this.state.docId)
        .update({
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "address": this.state.address,
            "contact": this.state.contact,
            "email_id": this.state.emailId
        })
        Alert.alert("Your profile has been updated!")
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        return(
            <View style = {styles.container}>
                <SafeAreaProvider>
                <Header title = "Settings" navigation = {this.props.navigation}/>
                </SafeAreaProvider>
                <View style = {styles.form}>
                    <TextInput
                    style = {styles.inputBox}
                    placeholder = {"First Name"}
                    maxLength = {15}
                    onChangeText = {(text) =>{
                        this.setState({
                            firstName: text
                        })
                    }}
                    value = {this.state.firstName}/>

                    <TextInput
                    style = {styles.inputBox}
                    placeholder = {"Last Name"}
                    maxLength = {15}
                    onChangeText = {(text) =>{
                        this.setState({
                            lastName: text
                        })
                    }}
                    value = {this.state.lastName}/>

                    <TextInput
                    style = {styles.inputBox}
                    placeholder = {"Contact"}
                    maxLength = {10}
                    keyboardType = "numeric"
                    onChangeText = {(text) =>{
                        this.setState({
                            contact: text
                        })
                    }}
                    value = {this.state.contact}/>

                    <TextInput
                    style = {styles.address}
                    placeholder = {"Address"}
                    multiline = {true}
                    onChangeText = {(text) =>{
                        this.setState({
                            address: text
                        })
                    }}
                    value = {this.state.address}/>

                    <TextInput
                    style = {styles.inputBox}
                    placeholder = {"Email ID"}
                    keyboardType = "email-address"
                    onChangeText = {(text) =>{
                        this.setState({
                            emailId: text
                        })
                    }}
                    value = {this.state.emailId}/>
                    
                    <TouchableOpacity style = {styles.save}
                    onPress = {() => {
                        this.updateData()
                    }}>
                        <Text style = {styles.text}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFE0B2'
        },
        form: {
            flex: 1,
            width:'100%',
            alignItems: 'center'
        },
        inputBox: {
            width: "75%",
            height: 50,
            alignSelf: 'center',
            borderColor: '#806F2D',
            borderRadius: 10,
            borderWidth: 1,
            marginTop: 20,
            padding: 10,
            backgroundColor: '#FFEDA6',
            fontSize: 20,
            color: '#806F2D'
        },
        address: {
            width: "75%",
            height: 150,
            alignSelf: 'center',
            borderColor: '#806F2D',
            borderRadius: 10,
            borderWidth: 1,
            marginTop: 20,
            padding: 10,
            backgroundColor: '#FFEDA6',
            fontSize: 20,
            color: '#806F2D'
        },
        save: {
            width: "75%",
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            backgroundColor: "#DEAC35",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            elevation: 16,
            marginTop:20
        },
        text: {
            fontSize: 20,
            fontWeight: "200",
            color: "#fff"
        }
})
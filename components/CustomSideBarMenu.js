import React, { Component } from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import db from '../config';
import firebase from 'firebase';
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "react-native-elements";

export default class CustomSideBarMenu extends Component{
  constructor() {
    super();
    this.state ={
      userId: firebase.auth().currentUser.email,
      image: "#",
      name: "",
      docId: "",
    }
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render(){
    return(
      <View style = {styles.container}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source = {{
              uri: this.state.image
            }}
            size = {150}
            onPress = {() => this.selectPicture()}
            containerStyle = {{marginTop: 50}}
            overlayContainerStyle = {{backgroundColor: '#FFE0B2'}}>
              <Avatar.Accessory size = {50} style = {{backgroundColor: '#FFEDA6'}} iconStyle = {{color: '#000'}}/>
            </Avatar>

          <Text style={{ fontWeight: "bold", fontSize: 25, color: '#fff', marginTop: 30 }}>
            {this.state.name}
          </Text>
        </View>
        <View style = {styles.drawer}>
          <DrawerItems {...this.props} labelStyle = {{color: '#fff', fontSize: 15}}/>
        </View>
        <View style={styles.logOut}>
          <TouchableOpacity style = {styles.button}
          onPress = {() => {
              this.props.navigation.navigate('SignUpLoginScreen')
              firebase.auth().signOut()
          }}>
            <Text style = {styles.text}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F69400'
  },
  drawer: {
    flex: 0.8,
    marginTop: 50
  },
  logOut: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30
  },
  button: {
    height: 30,
    padding: 20,
    width: '100%',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold"
  }
})
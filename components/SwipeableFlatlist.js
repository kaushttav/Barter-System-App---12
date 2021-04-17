import React, { Component } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import db from "../config";

export default class SwipeableFlatlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.allNotifications
    };
  }

  updateMarkAsread = notification => {
    db.collection("all_notifications")
      .doc(notification.doc_id)
      .update({
        notification_status: "read"
      });
  };

  onSwipeValueChange = swipeData => {
    var allNotifications = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotifications];
      this.updateMarkAsread(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({ allNotifications: newData });
    }
  };

  renderItem = data => (
    <Animated.View>
        <ListItem bottomDivider containerStyle = {{backgroundColor: '#FFEDA6', marginTop: 20}}>
            <ListItem.Chevron name = "gift" type = "feather" color = '#5C5127' size = {30}/>
            <ListItem.Content>
            <ListItem.Title style = {{color: '#5C5127', fontWeight: 'bold'}}>{data.item.item_name}</ListItem.Title>
            <ListItem.Subtitle style = {{color: '#DEAC35'}}>{data.item.message}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    </Animated.View>
  );

  renderHiddenItem = () => (
    <View style={{backgroundColor: '#F69400', marginTop: 20, height: 100}}>
        <Text style={{alignSelf: 'flex-end', margin: 30, color: '#fff', fontWeight: 'bold'}}>Mark as read</Text>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data = {this.state.allNotifications}
          renderItem = {this.renderItem}
          renderHiddenItem = {this.renderHiddenItem}
          rightOpenValue = {-Dimensions.get("window").width}
          previewRowKey = {"0"}
          previewOpenValue = {-125}
          previewOpenDelay = {1500}
          previewDuration = {500}
          onSwipeValueChange = {this.onSwipeValueChange}
          keyExtractor = {(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE0B2"
  }
});
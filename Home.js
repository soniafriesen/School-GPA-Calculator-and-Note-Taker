import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler"; 
import firebase from "../config/firebase";

class Home extends React.Component {
  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      console.log("*************** SIGN OUT SUCCESS *******************");
      // this.props.navigation.navigate('SignIn');
      this.setState({ logout: true });
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Button
          style={styles.buttonStyle}
          onPress={this.signOutUser}
          title="Logout from app"
        ></Button>
        <Button
          style={styles.buttonStyle}
          onPress={() => this.props.navigation.navigate("Calculate GPA")}
          title="Calculate Your GPA"
        ></Button>
        <Button
          style={styles.buttonStyle}
          onPress={() => this.props.navigation.navigate("Take Notes")}
          title="Take Notes"
        ></Button>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 150,
  },
  buttonStyle: {
    width: 120,
    height: 120,
    marginTop: 40,
    marginBottom: 10,
  },
});
export default Home;

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Button,Text, View } from 'react-native';

import firebase from '../config/firebase'

class AddCourse extends React.Component {
    
    signOutUser = async () => {
        try {
            await firebase.auth().signOut();
            console.log('*************** SIGN OUT SUCCESS *******************')
            // this.props.navigation.navigate('SignIn');
            this.setState({logout:true})
        } catch (e) {
            console.log(e);
        }
    }
    render(){
        return (
            <View style={styles.container}>
               <Text>Add Course</Text>
                
              <StatusBar style="auto" />
            </View>
          );
    }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AddCourse;

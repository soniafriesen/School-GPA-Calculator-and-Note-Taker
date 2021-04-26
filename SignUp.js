import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text,Alert } from 'react-native'
import firebase from '../config/firebase';
class SignUp extends React.Component {
    state = {
        name: '',
        email: '',
        password: ''
    }
    handleSignUp = () => {
        const { email, password } = this.state
        let name=this.state.name
        if(!name.length){
            Alert.alert("Please Enter your name")
        }
        if(!email.length){
            Alert.alert("Please Enter your email")
        }
        if(!password.length){
            Alert.alert("Please Enter your password")
        }
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userProfile) => {
               
                    Alert.alert("User created successfully !")
                
                 
            })
            .catch(error => 
                {
                    Alert.alert(error)
                    console.log(error)

                }
                )
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputBox}
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                    placeholder='Full Name'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button}
                onPress={this.handleSignUp}
                >
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#2196F3',
        borderColor: '#FFA611',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonSignup: {
        fontSize: 12
    }
})

export default SignUp
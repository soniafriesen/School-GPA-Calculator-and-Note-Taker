import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Button,Text, View ,TextInput,Alert,Modal} from 'react-native';
import { ScrollView, TouchableOpacity,TouchableHighlight } from 'react-native';
// import {  } from 'react-native';
import * as Sharing from 'expo-sharing'; 


import firebase from '../config/firebase'
import * as MailComposer from 'expo-mail-composer';


class CalculateGPA extends React.Component {
    
    state={
      addCourseModal:false,
      isLoaded:false,
      currentGPA:0,
      currentCredits:1,
      newCourse:{
        courseName:"",
        coursePercentage:0,
        courseCredits:0,
      },
      allCourses:[
        
      ]
    }
    componentDidMount(){
      try {
        let currentUser=firebase.auth().currentUser.uid;
        firebase.database().ref(currentUser+"/courses").on('value',(snapshot) => {
          // const courses = snapshot.val();
          let allCourses=[]
          let currentCredits=0

          snapshot.forEach(function(item) {
            var itemVal = item.val();
            console.log('course credits--->',itemVal.courseCredits)
            currentCredits+= parseFloat(itemVal.courseCredits);
            allCourses.push(itemVal);
        });
          // courses.forEach(function(course){
          //   allCourses.push(course);
          // })
          this.setState({allCourses:allCourses,isLoaded:true,currentCredits})

          // console.log( courses);
        })
      } catch (error) {
        
      }

      //  this.dbRef = firebase.firestore().collection('')
      // if
    }

    addCourse = async () => {
        try {
          let currentUser=firebase.auth().currentUser.uid;
          console.log('--->',currentUser)
          // firebase.firestore();
          if(!this.state.newCourse.courseCredits){
            Alert.alert("Please Enter Course Credit")
            return;

          }else if(!this.state.newCourse.coursePercentage){
            Alert.alert("Please Enter Course Percentage")
            return;
          }else if(!this.state.newCourse.courseName||!this.state.newCourse.courseName.length){
            Alert.alert("Please Enter Course Name")
            return;
          }
          firebase.database().ref(currentUser+"/courses/"+this.state.newCourse.courseName).set(this.state.newCourse).then(course=>{
            this.setState({addCourseModal:false})
            Alert.alert("Course Added ! ")

          }).catch(err=>{
            console.log(err)
          })

        } catch (e) {
        }
    }
    
    clearCourses=()=>{
      try {
        let currentUser=firebase.auth().currentUser.uid;
        firebase.database().ref(currentUser+"/courses").set(null).then(course=>{
          // this.setState({addCourseModal:false})
          Alert.alert("Course Cleared ! ")

        }).catch(err=>{
          console.log(err)
        })
      } catch (error) {
        
      }

    }
    onChangeText=(text,value)=>{
        let newCourse=this.state.newCourse;
        newCourse[text]=value
        this.setState({newCourse:newCourse})
    }
    calculateGPA=()=>{
      let semesterGPA=0;
      let gpaTimesCredits=0;

      if(this.state.allCourses&&this.state.allCourses.length){
          this.state.allCourses.map(course=>{
            let courseGPA=parseInt(course.coursePercentage)/20
            courseGPA-=1;
            gpaTimesCredits+=courseGPA*parseFloat(course.courseCredits);

          })
          semesterGPA=gpaTimesCredits/this.state.currentCredits
          this.setState({currentGPA:semesterGPA})

      }else{
        Alert.alert("No Courses to Calculate GPA")
      }

    }
   openShareDialogAsync = async () => {
      // if (!(await MailComposer.isAvailableAsync())) {
      //   Alert.alert(`Uh oh, sharing isn't available on your platform`);
      //   return;
      // }
  
      // // await Sharing.shareAsync("Hello");
      // await MailComposer.composeAsync()
      let email=firebase.auth().currentUser.email;
      let coursegrade=""
      this.state.allCourses.map(course=>{
          coursegrade+=course.courseName+" - "+course.coursePercentage+"\n"
      })
      

      let body= `Hi ${email},\nYour current GPA is: ${this.state.currentGPA}\nBelow is the list of your courses and your grade:
                  COURSE NAME – GRADE
                  ${coursegrade}

                  
      `
      MailComposer.composeAsync({
        recipients: 
        [''],
        subject: 'Grade Evaluation',
        body: body,
      });
    }
    render(){

        if(!this.state.isLoaded){  
            return <Text>Loading ...</Text>

        }else
        return (
            <View style={styles.container}>
                <View style={{paddingHorizontal:20}}> 
                   <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
                               <Text style={{fontSize:20}}>{'Current Credits: '}
                                  <Text style={{fontSize:18,textDecorationLine:'underline',fontWeight:'bold'}}>{this.state.currentCredits}</Text>
                               </Text>
                                {/* <Text style={{fontSize:20}}>{'Current GPA : '}
                                
                                <Text style={styles.courseText}>{this.state.currentGPA}</Text>
                                
                                </Text> */}
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',backgroundColor: '#2196F3'}}>
                               <Text style={styles.courseTextHeading}>{'Course'}</Text>
                                <Text style={styles.courseTextHeading}>{'Credits'}</Text>
                                <Text style={styles.courseTextHeading}>{'Percentage'}</Text>
                    </View>
                    <ScrollView>
                    {
                      this.state.allCourses&&this.state.allCourses.length?
                       this.state.allCourses.map((course,index)=>{
                          return(
                            <View key={index} style={{flexDirection:'row',justifyContent:'space-between',marginTop:10,marginHorizontal:10,backgroundColor:'green'}}>
                             
                                <Text style={styles.courseText}>{course['courseName']}</Text>
                                <Text style={styles.courseText}>{course['courseCredits']}</Text>
                                <Text style={styles.courseText}>{course['coursePercentage']}</Text>


                            </View>
                          )

                       })
                       :null
                    }
                    </ScrollView>
                </View>
              <View>
                <View style={{flexDirection:'row' ,justifyContent:'space-between',marginVertical:20}}>
                        <TouchableHighlight
                          style={{ ...styles.openButton,marginHorizontal:5, flex:1,backgroundColor: 'green' }}
                          onPress={() =>this.calculateGPA()}>
                      <Text style={styles.textStyle}>Calculate</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{ ...styles.openButton,flex:1,marginHorizontal:5,backgroundColor: 'red' }}
                      onPress={() =>this.clearCourses()}>
                  <Text style={styles.textStyle}>Clear</Text>
                </TouchableHighlight>
              </View>
                <TouchableHighlight
                  style={{ ...styles.openButton, marginHorizontal:40,backgroundColor: '#2196F3' }}
                  onPress={() => {
                    this.setState({addCourseModal:true});
                  }}>
              <Text style={styles.textStyle}>Add Course</Text>
            </TouchableHighlight>

            {
              this.state.currentGPA ?
                
                <TouchableHighlight
                    style={{ ...styles.openButton, marginHorizontal:40,marginTop:5,backgroundColor: '#2196F3' }}
                    onPress={() => {
                    this.openShareDialogAsync()
                    }}>
                <Text style={styles.textStyle}>Share Results</Text>
              </TouchableHighlight>
              :null
            }
            
              <View
                    style={{ ...styles.openButton,marginTop:10,borderRadius:0,backgroundColor: '#2196F3' }}
              
              >
                <Text style={styles.textStyle}>Current semester GPA : {this.state.currentGPA}</Text>  
              </View>
            </View>


              <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.addCourseModal}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Text style={{fontSize:20}}>Add Course</Text>

                <View style={{justifyContent:'space-between',margin:10}}>

                    <TextInput
                      style={styles.textInput}
                      keyboardType={'default'}
                      maxLength={10}
                      placeholder="Enter Course Name"
                      onChangeText={(text)=>this.onChangeText("courseName",text)}
                    >

                    </TextInput>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter Credit"
                      keyboardType={'numeric'}

                      onChangeText={(text)=>this.onChangeText("courseCredits",text)}
                    >

                    </TextInput>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter Course %"
                      keyboardType={'numeric'}

                      onChangeText={(text)=>this.onChangeText("coursePercentage",text)}
                    >

                    </TextInput>
                    </View>

                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                    onPress={() => {
                      this.addCourse();
                    }}>
                    <Text style={styles.textStyle}>Add Course</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: '#2196F3',marginLeft:10 }}
                    onPress={() => {
                      this.setState({addCourseModal:false});
                    }}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableHighlight>
                </View>
                </View>
              </View>
            </Modal>

             

            </View>
          );
    }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseText:{textDecorationLine:'underline',fontSize:20,padding:8,color:'white'},
  courseTextHeading:{
    fontSize:20,
    padding:7,
    color:'white',
    fontWeight:'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput:{borderWidth:1,padding:10,marginTop:10}
  
});
export default CalculateGPA;

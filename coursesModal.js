import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function App(props) {
   const selectClass=(classValue)=>{
        props.selectClassFunction(classValue)
    }
//   const [modalVisible, setModalVisible] = useState(false);
  return (
    // <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.coursesModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
              <ScrollView>
              {
                  props&&props.classes&&props.classes.length?
                    props.classes.map((course,index)=>{
                        return(
                            <TouchableHighlight
                            key={index}
                            style={{...styles.openButton,width:200,marginTop:5, backgroundColor: '#2196F3'}}
                            onPress={()=>props.selectClassFunction(course.courseName)}
                        >
                            <Text style={styles.textStyle}>{course.courseName}</Text>

                        </TouchableHighlight>


                        )
                    })
                  :
                  <Text>No Classes Available Please Add Class First</Text>
              }
              </ScrollView>
             
            {/* <Text style={styles.modalText}>Hello World!</Text> */}

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: 'red',marginTop:10 }}
              onPress={() => {
                props.showCourseModal(false);
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

 
  );
}

const styles = StyleSheet.create({
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
});
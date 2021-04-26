import firebase from "../config/firebase";

import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  TextInput,
  Alert,
  Button,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { TouchableHighlight } from "react-native-gesture-handler";
// import * as SQLite from 'expo-sqlite';
// const db = SQLite.openDatabase('final_exam.testDb')
import CourseModal from "../components/coursesModal";
import * as Sharing from "expo-sharing";

export default function TakeNotes() {
  const [recording, setRecording] = React.useState();
  const [recordingPath, setRecordingPath] = useState(null);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [sound, setSound] = React.useState();
  const [allAudio, setAllAudio] = React.useState([]);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [dbContentModal, setDbContentModal] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [courseImage, setCourseImage] = useState({});
  const [courseAudio, setCourseAudio] = useState({});

  const [option, setOption] = useState("image");
  const [selectedClass, setSelectedClass] = useState(null);
  const [coursesModal, setCoursesModal] = useState(false);

  const [startRecordingDisabled, setStartRecordingDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  /*
     CREATING SQL LITE TABLES AT START OF APPLICATION
                    &
     FETCHING THE IMAGE
  */
  useEffect(() => {
    (() => {
      let currentUser = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref(currentUser + "/courses")
        .on("value", (snapshot) => {
          // const courses = snapshot.val();
          let allCourses = [];
          let courseImage = {};
          let courseAudio = {};
          snapshot.forEach(function (item) {
            var itemVal = item.val();

            allCourses.push(itemVal);
            courseImage[itemVal.courseName] = [];
            if (itemVal && itemVal.images) {
              Object.values(itemVal.images).map(function (imageVal) {
                courseImage[itemVal.courseName].push(imageVal);
              });
              setCourseImage(courseImage);
            }

            courseAudio[itemVal.courseName] = [];
            if (itemVal && itemVal.audios) {
              Object.values(itemVal.audios).map(function (audio) {
                courseAudio[itemVal.courseName].push(audio);
              });
              setCourseAudio(courseAudio);
            }
          });
          // courses.forEach(function(course){
          //   allCourses.push(course);
          // })
          // this.setState({allCourses:allCourses,isLoaded:true})
          setAllCourses(allCourses);
          setLoadingProfile(false);
          // console.log( courses);
        });
    })();
  }, []);

  /*
    SHOWING ALL AVAILABLE RECORDINGS WHEN SHOW ALL DB
 
  */

  /*
    **************************************************************
    **************************************************************
    **************************************************************

            LAUNCHING CAMERA TO TAKE IMAGES

    **************************************************************
    **************************************************************
    **************************************************************
  
  
  */

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const saveImage = () => {
    if (!image || !image.length) {
      Alert.alert("please add image first");
    }
    setCoursesModal(true);
  };

  /*
    **************************************************************
    **************************************************************
    **************************************************************

            RECORDING FUNCTION

    **************************************************************
    **************************************************************
    **************************************************************
  
  
  */

  async function startRecording() {
    try {
      await setStartRecordingDisabled(true);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await setStartRecordingDisabled(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    await setRecordingPath(uri);
  }

  async function playSound(audiopath) {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      { uri: audiopath },
      { shouldPlay: true }
    );
    setSound(sound);

    console.log("Playing Sound");
    Alert.alert("PLAYING Audio Notes");

    await sound.playAsync();
  }
  const saveImageToDB = (value) => {
    if (image && image.length) {
      if (value && value.length) {
        let currentUser = firebase.auth().currentUser.uid;

        firebase
          .database()
          .ref(currentUser + "/courses/" + value + "/images")
          .push(image)
          .then((image) => {
            // this.setState({addCourseModal:false})
            setCoursesModal(false);
            setImage(null);
            Alert.alert("Image Added ! ");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Alert.alert("Course is missing !");
      }
    } else {
      Alert.alert(" Image is missing !");

      return;
    }
  };
  const shareImage = async (image) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }
    const results = await Sharing.shareAsync(image);
    console.log(results);
  };

  /*
    **************************************************************
    **************************************************************
    **************************************************************

            SAVING AUDIO TO FIREBASE FUNCTION

    **************************************************************
    **************************************************************
    **************************************************************
  
  
  */
  const saveAudioToDB = (value) => {
    if (recordingPath && recordingPath.length) {
      if (value && value.length) {
        let currentUser = firebase.auth().currentUser.uid;

        firebase
          .database()
          .ref(currentUser + "/courses/" + value + "/audios")
          .push(recordingPath)
          .then((image) => {
            // this.setState({addCourseModal:false})
            setCoursesModal(false);
            //   setImage(null)
            setRecordingPath(null);
            Alert.alert("Audio Added ! ");
          })
          .catch((err) => {
            Alert.alert("Failed to add Audio ! ");

            console.log(err);
          });
      } else {
        Alert.alert("Course is missing !");
      }
    } else {
      Alert.alert(" Audio is missing !");

      return;
    }
  };
  const saveAudio = () => {
    if (!recordingPath || !recordingPath.length) {
      Alert.alert("please add audio first");
    }
    setCoursesModal(true);
  };
  const selectClassFunction = (value) => {
    setSelectedClass(value);
    if (option == "image") {
      saveImageToDB(value);
    } else {
      saveAudioToDB(value);
    }
  };

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <TouchableHighlight
          onPress={() => setOption("image")}
          style={
            option == "image"
              ? { ...styles.selectedButton, backgroundColor: "#555555" }
              : styles.selectedButton
          }
        >
          <Text
            style={
              option == "image"
                ? { ...styles.topButtonText, color: "white" }
                : styles.topButtonText
            }
          >
            Add Image Note
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={
            option == "audio"
              ? { ...styles.selectedButton, backgroundColor: "#555555" }
              : styles.selectedButton
          }
          onPress={() => setOption("audio")}
        >
          <Text
            style={
              option == "audio"
                ? { ...styles.topButtonText, color: "white" }
                : styles.topButtonText
            }
          >
            Add Audio Note
          </Text>
        </TouchableHighlight>
      </View>

      <View>
        {option == "image" ? (
          <View>
            {image ? (
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{ uri: image }}
                  style={{ ...styles.profileImage, marginLeft: 10 }}
                ></Image>
                <TouchableOpacity
                  style={{ ...styles.saveButon, marginLeft: 20 }}
                  onPress={saveImage}
                >
                  <Text style={styles.blueButtonText}>SAVE</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                style={{ ...styles.blueButton, marginLeft: 10, marginTop: 10 }}
              >
                <Text style={styles.blueButtonText}>New Image Note</Text>
              </TouchableOpacity>
            )}

            <View style={{ paddingHorizontal: 10 }}>
              {courseImage && Object.keys(courseImage).length ? (
                Object.keys(courseImage).map((course, topIndex) => {
                  return (
                    <View key={topIndex}>
                      <View
                        style={{
                          width: "100%",
                          borderBottomWidth: 0.5,
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                          {course}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          paddingBottom: 10,
                        }}
                      >
                        {courseImage[course]
                          ? courseImage[course].map((image, index) => {
                              console.log("image===>", image);
                              return (
                                <View>
                                  <Image
                                    key={topIndex + index + 1}
                                    style={{
                                      height: 150,
                                      width: 150,
                                      marginLeft: 4,
                                      borderRadius: 10,
                                      marginBottom: 10,
                                    }}
                                    source={{ uri: image }}
                                  ></Image>
                                  <Button
                                    style={styles.buttonStyle}
                                    onPress={() => shareImage(image)}
                                    title="Share"
                                  ></Button>
                                </View>
                              );
                            })
                          : null}
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text>No Image Notes Available</Text>
              )}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, marginHorizontal: 5 }}>
            {!startRecordingDisabled ? (
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{ ...styles.blueButton1 }}
                  onPress={startRecording}
                >
                  {/* <Text style={{...styles.blueButtonText,paddingHorizontal:5}}>Record Audio</Text> */}
                  <Image
                    style={{ width: 40, height: 40 }}
                    source={{
                      uri:
                        "data:image/jpeg;base64,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",
                    }}
                  />
                </TouchableOpacity>
                {recordingPath && recordingPath.length ? (
                  <TouchableOpacity
                    style={{
                      ...styles.saveButon,
                      marginTop: 0,
                      marginLeft: 5,
                      width: 140,
                      marginRight: 8,
                    }}
                    onPress={saveAudio}
                  >
                    <Text style={styles.blueButtonText}>Save Audio</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : (
              <View>
                {
                  <View>
                    <TouchableOpacity
                      style={styles.blueButton1}
                      onPress={stopRecording}
                    >
                      {/* <Text style={styles.blueButtonText}>Stop Recording</Text> */}
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={{
                          uri:
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXbQUbCDnjFqpSglxoYABn9-flvb5oTqrCLg&usqp=CAU",
                        }}
                      />
                    </TouchableOpacity>
                    <Text> Speaking ... </Text>
                  </View>
                }
              </View>
            )}

            <View style={{ paddingHorizontal: 10 }}>
              {courseImage && Object.keys(courseAudio).length ? (
                Object.keys(courseAudio).map((course, topIndex) => {
                  return (
                    <View key={topIndex}>
                      <View
                        style={{
                          width: "100%",
                          borderBottomWidth: 0.5,
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                          {course}
                        </Text>
                      </View>
                      <View style={{ paddingBottom: 10 }}>
                        {courseAudio[course]
                          ? courseAudio[course].map((audio, index) => {
                              return (
                                <TouchableHighlight
                                  onPress={() => playSound(audio)}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <Image
                                      key={topIndex + index + 1}
                                      style={{
                                        height: 30,
                                        width: 30,
                                        marginLeft: 4,
                                        borderRadius: 10,
                                        marginBottom: 10,
                                      }}
                                      source={{
                                        uri:
                                          "data:image/png;base64,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",
                                      }}
                                    ></Image>
                                    <Text
                                      style={{ paddingLeft: 10, marginTop: 5 }}
                                    >
                                      {" "}
                                      Click to Play{" "}
                                    </Text>
                                  </View>
                                </TouchableHighlight>
                              );
                            })
                          : null}
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text>No Image Notes Available</Text>
              )}
            </View>
          </View>
        )}
      </View>
      <CourseModal
        showCourseModal={(value) => setCoursesModal(value)}
        coursesModal={coursesModal}
        classes={allCourses}
        selectClassFunction={(value) => selectClassFunction(value)}
      ></CourseModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  subContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },

  headingText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  blueButton: {
    backgroundColor: "blue",
    // backgroundColor: '#2196F3',
    width: 140,
    height: 40,
    justifyContent: "center",
    marginLeft: 4,
    borderRadius: 7,
    marginBottom: 10,
  },
  blueButton1: {
    // backgroundColor:'blue',
    // backgroundColor: '#2196F3',
    width: 140,
    height: 40,
    justifyContent: "center",
    marginLeft: 4,
    borderRadius: 7,
    marginBottom: 10,
  },
  blueButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  captionStyle: {
    width: 250,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 7,
    paddingLeft: 8,
    margin: 10,
  },
  saveButon: {
    backgroundColor: "green",
    width: 80,
    height: 40,
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 7,
  },
  showDBButton: {
    // width:'95%',
    margin: 10,
    height: 40,
    backgroundColor: "blue",
    justifyContent: "center",
    marginTop: 0,
    borderRadius: 7,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 22,
    width: "80%",
    height: "50%",
    backgroundColor: "white",
    borderWidth: 1,
    justifyContent: "space-between",
    margin: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
  },
  recordingRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    borderWidth: 0.5,
  },
  modalStyles: {
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
    alignSelf: "center",
  },
  rowPlayButton: { flex: 1, justifyContent: "flex-end", flexDirection: "row" },
  recordingDataHeading: {
    fontWeight: "bold",
    fontSize: 18,
  },
  playRecordingData: {
    fontWeight: "bold",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  topButton: {},
  topButtonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
  },
  selectedButton: {
    width: 150,
    paddingHorizontal: 5,
    justifyContent: "center",
    height: 40,
    borderRadius: 10,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    flex: 1,
  },
});

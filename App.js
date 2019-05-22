import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight, Image, TouchableOpacity, PermissionsAndroid} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import TopAppBar from './components/TopAppBar';
import ImagePicker from 'react-native-image-crop-picker';
import { SpeechToText } from 'react-native-watson';

export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      language: '',
      isRecording: false,
      showImage: false,
      value: '',
      imagePath: 'http://aux.iconspalace.com/uploads/camera-icon-256-803400574.png',
      data: [{
      value: 'Mangel',
      }]
    };
    SpeechToText.initialize("apikey", "OOw52y9fvugbh0Z4M3jUSERym5ep0ero6cfo48rcGts7");
  }

  _startRecognition(e) {
    try {
      SpeechToText.startStreaming((error, text) =>
        {
            console.log(text);
            this.setState({
              value: text
            });
        });
    } catch (e) {
      console.error(e);
    }
  }

  _stopRecognition(e) {
    try {
      SpeechToText.stopStreaming();
    } catch (e) {
      console.error(e);
    }
  }

  async onRecord(e){
    const micPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    console.log(micPermission);
    if (micPermission === PermissionsAndroid.RESULTS.GRANTED) {
      console.log(micPermission);
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone permission for recording',
        message:
          'This App needs access to your microphone ' +
          'so you can take record audio to convert to text.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted) {
      if (this.state.isRecording) {
        this.setState({ isRecording: false });
        try {
          SpeechToText.stopStreaming();
        } catch (e) {
          console.error(e);
        }
      }else {
        this.setState({ isRecording: true });
        try {
          SpeechToText.startStreaming((error, text) =>
            {
                this.setState({
                  value: text
                });
            });
        } catch (e) {
          console.error(e);
        }
      }
    }


  }

  renderCroppedImage(){
    if (this.state.showImage) {
            return (
                <TouchableHighlight
                    onPress={this.openCameraAndCrop.bind(this)}>
                    <Image source={{uri:this.state.imagePath}} style={{width: 200, height: 200, justifyContent:'center', alignItems:'center',}} />
                </TouchableHighlight>
            );
        } else {
          return(
            <View style={styles.cameraView}>
              <TouchableOpacity onPress={this.openCameraAndCrop.bind(this)}>
                <Image source={require('./images/camera.png')} style={{width: 200, height: 200, justifyContent:'center', alignItems:'center',}} />
              </TouchableOpacity>
            </View>
          );
        }
  }

  openCameraAndCrop(){
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image.path);
      this.setState({ imagePath: image.path, showImage: true });
    });
  }

  render() {
    return (
      <View style={styles.containerMain}>
        <TopAppBar />
        <View style={styles.container}>
        <Dropdown
          value='Mangel'
          data={this.state.data}
        />
        <View style={{margin: 10, flex: 1,}}>
          <Text style={styles.black}>Mangelbeschreibung</Text>

          <View style={styles.inputView}>
            <View style={{flex:6}}>
              <TextInput
                  onChangeText={text=>this.setState({value:text})}
                  style={styles.input}
                  value={this.state.value}
                  multiline={true}
                  underlineColorAndroid='transparent'
                  numberOfLines = {8}
                />
            </View>
            <View style={{flex:1}}>
              <TouchableOpacity
                  style={{padding: 5, alignItems:'flex-end'}}
                  onPress={this.onRecord.bind(this)}>
                    <Image
                      source={require('./images/mic.png')}
                      style={ { width: 20, height: 20 } } />
              </TouchableOpacity>
            </View>
          </View>


          {this.renderCroppedImage()}
        </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:20,
    backgroundColor: '#F5FCFF',
  },
  containerMain: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  inputView:{
    flex:0.5,
    flexDirection:'row',
    width: window.width,
    padding:4,
    alignItems:'flex-end',
    justifyContent:'center',
    borderWidth:2,
    borderColor:'#888',
    borderRadius:2,
    backgroundColor:'#fff'
  },
  cameraView:{
    flex:0.5,
    flexDirection:'row',
    width: window.width,
    marginTop: 30,
    marginLeft: 45,
    marginRight: 45,
    marginBottom: 10,
    padding:4,
    alignItems:'center',
    justifyContent:'center',
    borderWidth:2,
    borderColor:'#888',
    borderRadius:2,
    backgroundColor:'#fff'
  },
  input: {
    textAlignVertical: 'top',
  },
  black: {
    color: 'black',
    fontSize: 16,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

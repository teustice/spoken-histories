import React, { Component } from 'react';
import { View, Text, StyleSheet, Button} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Api from '../../lib/api';
import Tts from 'react-native-tts';


import ActionCreators from '../../actions/index';
import getUserLocation from '../../selectors/userLocation';
import getUserCity from '../../selectors/userCity';

export class Main extends Component {
  stopTalking(){
    Tts.stop();
  }

  parseSection(sectionId){
    let root = 'https://en.wikipedia.org/w/api.php';
    let params = `?action=parse&format=json&page=${this.props.userCity}&section=${sectionId}`
    Api.get(root + params).then((val) => {
      let regex = /(<([^>]+)>)/ig;
      let text = val.parse.text['*'];
      let result = text.replace(regex, "");
      let noContents = result.substring(result.indexOf("History[edit]") + 7);
      let finalResult = noContents.replace(/(\[.+\])/g, '');
      let anotherResult = finalResult.replace(/ *\([^)]*\) */g, "");
      console.log(anotherResult);
      Tts.setDefaultVoice('com.apple.ttsbundle.Tessa-compact');
      Tts.speak(`You are currently in ${this.props.userCity}`);
      Tts.speak(anotherResult);
    });
  }

  findSection(){
    let root = 'https://en.wikipedia.org/w/api.php';
    let params = `?action=parse&prop=sections&format=json&page=${this.props.userCity}`
    Api.get(root + params).then((val) => {
      let sections = val.parse.sections
      for(let i=0; i<sections.length; i++){
        if(sections[i].line == "History"){
          this.parseSection(sections[i].index);
        }
      }
    });

  //   var regex = /(<([^>]+)>)/ig
  // ,   body = "<p>test</p>"
  // ,   result = body.replace(regex, "");
  //
  // console.log(result);
  }

  formatCity(obj){
    let city;
    let state;
    for(let i=0; i<obj[0].address_components.length; i++){
      if(obj[0].address_components[i].types[0] == "locality"){
        city = obj[0].address_components[i].long_name;
      }
    }
    for(let i=0; i<obj[0].address_components.length; i++){
      if(obj[0].address_components[i].types[0] == "administrative_area_level_1"){
        state = obj[0].address_components[i].long_name;
      }
    }
    return `${city},_${state}`;
  }

  findCity(){
    let root;
    let params;
    let city;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        root = 'https://maps.googleapis.com/maps/api/geocode/json?';
        params = `latlng=${lat},${long}&key=AIzaSyB0FneXrH53zsC5_LcbWD_WsarbL38m9X4`;

        Api.get(root + params).then((val) => {
          city = this.formatCity(val.results);
          this.props.setUserCity(city);
          this.findSection();
        });
      },
      (error) => console.log(error.message),
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.userCity}</Text>
        <Button
          title="Learn About Where You Are"
          onPress={() => this.findCity()}
        />
        <Button
          title="Shut It"
          onPress={() => this.stopTalking()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(store) {
  return {
    userLocation: getUserLocation(store),
    userCity: getUserCity(store)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

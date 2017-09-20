import React, { Component } from 'react';
import { View, Text, StyleSheet, Button} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Api from '../../lib/api';

import ActionCreators from '../../actions/index';
import getUserLocation from '../../selectors/userLocation';
import getUserCity from '../../selectors/userCity';

export class Main extends Component {
  componentDidMount() {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     this.props.setUserLocation({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     });
    //   },
    //   (error) => this.setState({ error: error.message }),
    // );
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
          title="Click to see what city your in"
          onPress={() => this.findCity()}
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

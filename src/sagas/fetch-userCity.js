import { call, put, takeLatest } from 'redux-saga/effects';

import { USER_CITY_FETCH } from '../lib/constants/actions';
import Api from '../lib/api';
import setUserCity from '../actions/set-userCity';
import { genericError } from '../actions/errors';

// const executeFetchUserCity = (lat, long) => {
//   let root;
//   let params;
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       let lat = position.coords.latitude;
//       let long = position.coords.longitude;
//       root = 'https://maps.googleapis.com/maps/api/geocode/json?';
//       params = `latlng=${lat},${long}&key=AIzaSyB0FneXrH53zsC5_LcbWD_WsarbL38m9X4`;
//
//       Api.get(root + params).then((val) => {
//         console.log(val);
//         return val.results;
//       });
//     },
//     (error) => console.log(error.message),
//   )
//
// };

function formatCity(obj){
  let city;
  for(let i=0; i<obj[0].address_components.length; i++){
    if(obj[0].address_components[i].types[0] == "locality"){
      city = obj[0].address_components[i].long_name;
    }
  }
  return city;
}

function* fetchUserCity(action) {
  try {
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
          city = formatCity(val.results);
          console.log(city);
        });
      },
      (error) => console.log(error.message),
    )
    yield put(setUserCity(city));
  } catch (error) {
    console.warn(error);
    yield put(genericError('Failed to fetch Title'));
  }
}

export default function* watchFetchCity() {
  yield takeLatest(USER_CITY_FETCH, fetchUserCity);
}

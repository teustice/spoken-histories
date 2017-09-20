import Api from '../api';

const findCity = (lat, long) => {
  const root = 'https://maps.googleapis.com/maps/api/geocode/json?';
  const params = `latlng=${lat},${long}&key=AIzaSyB0FneXrH53zsC5_LcbWD_WsarbL38m9X4`;
  return Api.get(root + params).then((val) => {
    console.log(val.results);
    return val.results;
  });
};

export default findCity

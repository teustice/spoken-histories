import setTitle from './set-title';
import fetchTitle from './fetch-title';
import setUserLocation from './set-userLocation';
import fetchUserLocation from './fetch-userLocation';
import setUserCity from './set-userCity';
import fetchUserCity from './fetch-userCity';
import setConnectivity from './set-connectivity';
import { genericError } from './errors';

const ActionCreators = {
  setUserLocation,
  fetchUserLocation,
  setUserCity,
  fetchUserCity,
  setTitle,
  fetchTitle,
  setConnectivity,
  genericError,
};

export default ActionCreators;

import { combineReducers } from 'redux';

import title from './title';
import userLocation from './userLocation';
import userCity from './userCity';
import connectivity from './connectivity';

export const reducers = { title, connectivity, userLocation, userCity};

export default function getRootReducer(navReducer) {
  return combineReducers({
    nav: navReducer,
    ...reducers,
  });
}

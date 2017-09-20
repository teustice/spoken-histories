import { Map } from 'immutable';

import createReducer from '../lib/helpers/createReducer';
import { USER_CITY_SET } from '../lib/constants/actions';


const defaultState = Map().set('userCity', "");

export default createReducer(defaultState, {

  [USER_CITY_SET](state, action) {
    return state.set('userCity', action.payload);
  },

});

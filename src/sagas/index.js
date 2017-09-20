import { fork, all } from 'redux-saga/effects';

import watchFetchTitle from './fetch-title';
import watchFetchCity from './fetch-userCity';

export default function* rootSaga() {
  yield all([
    fork(watchFetchCity),
    fork(watchFetchTitle),
  ]);
}

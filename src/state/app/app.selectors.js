import * as R from 'ramda';

export const apiHostSelector = R.path(['app', 'apiHost']);

export const appStatusSelector = R.path(['app', 'appStatus']);

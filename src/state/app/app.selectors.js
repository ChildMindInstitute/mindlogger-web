import * as R from 'ramda';

export const apiHostSelector = R.path(['app', 'apiHost']);
export const appStatusSelector = R.path(['app', 'appStatus']);
export const appletsSelector = R.path(['app', 'applets']);
export const responsesSelector = R.path(['app', 'responses']);
export const finishedEventsSelector = R.path(['app', 'finishedEvents']);
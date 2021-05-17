import * as R from 'ramda';

export const allAppletsSelector = R.path(['applets', 'applets']);

export const currentTimeSelector = R.path(['applets', 'currentTime']);

export const appletDataSelector = R.path(['applets', 'appletResponseData']);

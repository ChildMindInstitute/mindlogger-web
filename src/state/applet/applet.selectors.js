import * as R from 'ramda';

export const appletsSelector = R.path(['applet', 'applets']);

export const currentTimeSelector = R.path(['applet', 'currentTime']);

export const appletDataSelector = R.path(['applet', 'appletResponseData']);

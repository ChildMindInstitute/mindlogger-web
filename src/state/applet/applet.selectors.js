import * as R from 'ramda';
import { createSelector } from "reselect";

export const appletsSelector = R.path(['applet', 'applets']);

export const currentTimeSelector = R.path(['applet', 'currentTime']);

export const appletDataSelector = R.path(['applet', 'appletResponseData']);

export const appletCumulativeActivities = R.path(['applet', 'cumulativeActivities']);

export const profileSelector = createSelector(
  R.path(['applet', 'profiles']),
  R.path(["app", "currentApplet"]),
  (profiles, currentApplet) => {
    return profiles[currentApplet] || {};
  }
)
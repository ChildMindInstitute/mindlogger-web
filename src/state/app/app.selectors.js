import * as R from 'ramda';
import { createSelector } from "reselect";

export const apiHostSelector = R.path(['app', 'apiHost']);
export const appStatusSelector = R.path(['app', 'appStatus']);
export const appletsSelector = R.path(['app', 'applets']);
export const responsesSelector = R.path(['app', 'responses']);

export const currentAppletSelector = createSelector(
  R.path(['app', 'currentApplet']),
  appletsSelector,
  // TODO: this could return undefined. So do we catch it here, or later on?
  (currentAppletId, applets) => applets.find((applet) => {
    if (applet.id === currentAppletId) {
      return true;
    }
  }) || null,
);
export const finishedEventsSelector = R.path(['app', 'finishedEvents']);

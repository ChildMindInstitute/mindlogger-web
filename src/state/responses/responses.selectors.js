import { createSelector } from "reselect";
import * as R from "ramda";

export const responsesSelector = R.path(["responses", "responseHistory"]);

export const uploadQueueSelector = R.path(["responses", "uploadQueue"]);

export const isDownloadingResponsesSelector = R.path([
  "responses",
  "isDownloadingResponses",
]);

export const isSummaryScreenSelector = R.path(["responses", "isSummaryScreen"]);

export const downloadProgressSelector = R.path([
  "responses",
  "downloadProgress",
]);

export const inProgressSelector = R.path(["responses", "inProgress"]);

export const currentAlertsSelector = R.path(["responses", "alerts"]);

export const activityOpenedSelector = R.path(["responses", "activityOpened"]);

export const lastResponseTimeSelector = R.path(["responses", "lastResponseTime"]);

export const activityLastResponseTimeSelector = createSelector(
  lastResponseTimeSelector,
  R.path(["app", "currentActivity"]),
  R.path(["app", "currentApplet"]),
  (lastResponseTime, currentActivity, currentApplet) => {
    const appletResponseTimes = (lastResponseTime || {})[currentApplet];

    return (appletResponseTimes || {})[currentActivity];
  }
)

export const currentAppletResponsesSelector = createSelector(
  responsesSelector,
  R.path(["app", "currentApplet"]),

  (responses, currentApplet) => {
    let currentAppletResponses = R.filter(
      (x) => x.appletId === currentApplet,
      responses
    );

    if (currentAppletResponses.length === 1) {
      // eslint-disable-next-line
      currentAppletResponses = currentAppletResponses[0];
    } else {
      currentAppletResponses = {};
    }
    return currentAppletResponses;
  }
);

export const currentAppletTokenBalanceSelector = createSelector(
  currentAppletResponsesSelector,
  (responseHistory) => {
    return responseHistory.tokens;
  }
)

export const currentResponsesSelector = createSelector(
  R.path(["app", "currentActivity"]),
  R.path(["responses", "currentEvent"]),
  inProgressSelector,
  (activityId, eventId, inProgress) => {
    return inProgress[eventId ? activityId + eventId : activityId]
  }
);

export const currentScreenResponseSelector = createSelector(
  currentResponsesSelector,
  (progress) => {
    return progress ? progress.responses[progress.screenIndex] : progress;
  }
);

export const screenResponsesSelector = createSelector(
  currentResponsesSelector,
  (progress) => {
    return progress ? progress.responses : progress;
  }
);

export const currentScreenIndexSelector = createSelector(
  currentResponsesSelector,
  (progress) => {
    return progress ? progress.screenIndex : 0;
  }
)

import { createSelector } from "reselect";
import * as R from "ramda";
import { testVisibility } from "../../services/visibility";
import { IS_VIS } from "../../models/json-ld";

export const responsesSelector = R.path(["response", "responseHistory"]);

export const uploadQueueSelector = R.path(["response", "uploadQueue"]);

export const isDownloadingResponsesSelector = R.path([
  "response",
  "isDownloadingResponses",
]);

export const isSummaryScreenSelector = R.path(["response", "isSummaryScreen"]);

export const downloadProgressSelector = R.path([
  "response",
  "downloadProgress",
]);

export const inProgressSelector = R.path(["response", "inProgress"]);

export const activityOpenedSelector = R.path(["response", "activityOpened"]);

export const responseScheduleSelector = R.path(["response", "schedule"]);

export const currentAppletResponseSelector = createSelector(
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
  currentAppletResponseSelector,
  (responseHistory) => {
    return responseHistory.tokens;
  }
)

export const currentResponseSelector = createSelector(
  R.path(["app", "currentActivity"]),
  R.path(["app", "currentEvent"]),
  inProgressSelector,
  (activityId, eventId, inProgress) => {
    return inProgress[eventId ? activityId + eventId : activityId]
  }
);


export const currentScreenSelector = createSelector(
  currentResponseSelector,
  R.path(["screenIndex"])
);

export const itemVisiblitySelector = createSelector(
  currentResponseSelector,
  (current) => {
    if (!current) {
      return [];
    }
    const { responses, activity } = current;

    return activity.addProperties.map((property) =>
      testVisibility(property[IS_VIS][0]['@value'], activity.items, responses)
    );
  }
);

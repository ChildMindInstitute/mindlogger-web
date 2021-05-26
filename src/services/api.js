import * as R from 'ramda';
import {
  getLast7DaysData,
  postResponse,
} from './network';
import { transformResponses } from '../models/response';
import { decryptAppletResponses } from '../models/response';

export const downloadAppletResponse = (authToken, applet) => {
  const appletId = applet.id.split("/").pop();

  return getLast7DaysData({
    authToken,
    appletId,
    localItems: [],
    localActivities: [],
    startDate: null,
    groupByDateActivity: false,
  }).then((responses) => {
    return {
      ...decryptAppletResponses(applet, responses),
      appletId: applet.id
    }
  });
}

export const downloadAllResponses = (authToken, applets, onProgress) => {
  let numDownloaded = 0;
  onProgress(numDownloaded, applets.length);
  const requests = applets.map((applet) => {

    return downloadAppletResponse(authToken, applet).then(response => {
      numDownloaded += 1;
      onProgress(numDownloaded, applets.length);
      return response;
    })
  });
  return Promise.all(requests)
    .then(transformResponses);
};

const uploadResponse = (authToken, response) =>
  postResponse({
    authToken,
    response,
  });

export const uploadResponseQueue = (
  authToken,
  responseQueue,
  progressCallback,
) => {
  if (responseQueue.length === 0) {
    return Promise.resolve();
  }
  return uploadResponse(authToken, responseQueue[0])
    .then(() => {
      progressCallback();
      return uploadResponseQueue(
        authToken,
        R.remove(0, 1, responseQueue),
        progressCallback,
      );
    })
    .catch((e) => console.warn(e));
};


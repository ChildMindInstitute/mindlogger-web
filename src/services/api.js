import * as R from 'ramda';
import {
  getLast7DaysData,
  postResponse,
} from './network';
import { transformResponses } from '../models/response';
import { decryptData } from './encryption';
import { activityTransformJson, itemTransformJson, itemAttachExtras } from './json-ld';
import { ORDER } from '../constants'

export const downloadAppletResponse = async (authToken, applet) => {
  const appletId = applet.id.split("/").pop();

  return getLast7DaysData({
    authToken,
    appletId,
    localItems: [],
    localActivities: [],
    startDate: null,
    groupByDateActivity: false,
  }).then((responses) => {
    /** decrypt responses */
    if (responses.dataSources && applet.encryption) {
      Object.keys(responses.dataSources).forEach((key) => {
        try {
          responses.dataSources[key] = JSON.parse(
            decryptData({
              key: applet.AESKey,
              text: responses.dataSources[key],
            })
          );
        } catch {
          responses.dataSources[key] = {};
          responses.hasDecryptionError = true;
        }
      });
    }

    responses.tokens = responses.tokens || {};
    if (applet.encryption) {
      if (responses.tokens.cumulativeToken) {
        try {
          const cumulative = typeof responses.tokens.cumulativeToken.data !== 'object' ? JSON.parse(
            decryptData({
              key: applet.AESKey,
              text: responses.tokens.cumulativeToken.data,
            })
          ) : responses.tokens.cumulativeToken.data;

          responses.tokens.cumulativeToken = cumulative.value || 0;
        } catch {
          responses.tokens.cumulativeToken = 0;
        }
      } else {
        responses.tokens.cumulativeToken = 0;
      }

      responses.tokens.tokenUpdates = responses.tokens.tokenUpdates || [];
      responses.tokens.tokenUpdates.forEach(tokenUse => {
        try {
          const tokenUpdate = typeof tokenUse.data !== 'object' ? JSON.parse(
            decryptData({
              key: applet.AESKey,
              text: tokenUse.data,
            })
          ) : tokenUse.data;

          tokenUse.value = tokenUpdate.value || 0;
        } catch {
          tokenUse.value = 0;
        }
      })
    }

    /** replace response to plain format */
    if (responses.responses) {
      Object.keys(responses.responses).forEach((item) => {
        for (let response of responses.responses[item]) {
          if (
            response.value &&
            response.value.src &&
            response.value.ptr !== undefined
          ) {
            response.value =
              responses.dataSources[response.value.src][response.value.ptr];

            if (response.value && response.value.value) {
              response.value = response.value.value;
            }
          }
        }

        responses.responses[item] = responses.responses[item].filter(
          (response) => response.value
        );
        if (responses.responses[item].length === 0) {
          delete responses.responses[item];
        }
      });
    }

    if (responses.items) {
      for (let itemId in responses.items) {
        const item = responses.items[itemId];
        responses.items[itemId] = {
          ...itemAttachExtras(itemTransformJson(item), itemId),
          original: item.original,
          activityId: item.activityId,
        };
      }
    }

    if (responses.itemReferences) {
      for (let version in responses.itemReferences) {
        for (let itemId in responses.itemReferences[version]) {
          const id = responses.itemReferences[version][itemId];
          if (id) {
            const item = responses.items[id];
            responses.itemReferences[version][itemId] = item;
          }
        }
      }
    }

    if (responses.activities) {
      for (let activityId in responses.activities) {
        const activity = responses.activities[activityId];
        if (activity[ORDER]) {
          delete activity[ORDER];
        }

        responses.activities[activityId] = {
          ...activityTransformJson(activity, []),
          original: activity.original,
        };
      }
    }

    if (responses.cumulatives) {
      Object.keys(responses.cumulatives).forEach((itemIRI) => {
        const cumulative = responses.cumulatives[itemIRI];
        if (
          cumulative.src &&
          cumulative.ptr !== undefined
        ) {
          cumulative.value = responses.dataSources[cumulative.src][cumulative.ptr];
        }

        const oldItem = responses.itemReferences[cumulative.version] &&
          responses.itemReferences[cumulative.version][itemIRI];
        if (oldItem) {
          const currentActivity = applet.activities.find(activity => activity.id.split('/').pop() == oldItem.original.activityId)

          if (currentActivity) {
            const currentItem = currentActivity.items.find(item => item.id.split('/').pop() === oldItem.original.screenId);

            if (currentItem && currentItem.schema !== itemIRI) {
              responses.cumulatives[currentItem.schema] = responses.cumulatives[itemIRI];

              delete responses.cumulatives[itemIRI];
            }
          }
        }
      })
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


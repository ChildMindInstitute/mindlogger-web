import * as R from 'ramda';
import packageJson from '../../package.json';
import config from '../util/config';
import { encryptData, decryptData } from '../services/encryption';
import { getSubScaleResult, getValuesFromResponse, getFinalSubScale, evaluateCumulatives } from '../services/scoring';
import { getAlertsFromResponse } from '../services/alert';

import {
  activityTransformJson,
  itemTransformJson,
  itemAttachExtras,
} from '../services/json-ld';

import { ORDER } from '../constants';

// Convert ids like "applet/some-id" to just "some-id"
const trimId = typedId => typedId.split('/').pop();

export const transformResponses = responses => R.unnest(responses);
export const getEncryptedData = (response, key) => encryptData({ key, text: JSON.stringify(response) });

export const prepareResponseForUpload = (
  inProgressResponse,
  appletMetaData,
  responseHistory,
  isTimeout,
  finishedTime
) => {
  const languageKey = "en";
  const { activity, responses, subjectId, events } = inProgressResponse;
  const { cumActivities, nonHiddenCumActivities } = evaluateCumulatives(responses, activity);
  const appletVersion = appletMetaData.schemaVersion[languageKey];
  const scheduledTime = activity.event && activity.event.scheduledTime;
  let cumulative = responseHistory.tokens?.cumulativeToken || 0;

  const alerts = [];

  for (let i = 0; i < responses.length; i += 1) {
    const item = activity.items[i];

    if (item.valueConstraints) {
      const { valueType, responseAlert, enableNegativeTokens } = item.valueConstraints;

      if (responses[i] !== null && responses[i] !== undefined && responseAlert) {
        const messages = getAlertsFromResponse(item, responses[i].value !== undefined ? responses[i].value : responses[i]);
        messages.forEach(msg => {
          alerts.push({
            id: activity.items[i].id.split('/')[1],
            schema: activity.items[i].schema,
            message: msg
          });
        })
      }

      if (valueType && valueType.includes('token') && responses[i] !== undefined && responses[i] !== null) {
        const responseValues = getValuesFromResponse(item, responses[i].value) || [];
        const positiveSum = responseValues.filter(v => v >= 0).reduce((a, b) => a + b, 0);
        const negativeSum = responseValues.filter(v => v < 0).reduce((a, b) => a + b, 0);

        cumulative += positiveSum;
        if (enableNegativeTokens && cumulative + negativeSum >= 0) {
          cumulative += negativeSum;
        }
      }
    }
  }

  const responseData = {
    activity: {
      id: trimId(activity.id),
      schema: activity.schema,
      schemaVersion: activity.schemaVersion[languageKey],
    },
    applet: {
      id: trimId(appletMetaData.id),
      schema: activity.appletSchema,
      schemaVersion: appletVersion,
    },
    subject: subjectId,
    responseStarted: inProgressResponse.timeStarted,
    responseCompleted: Date.now(),
    timeout: isTimeout ? 1 : 0,
    event: activity.event ? {
      id: activity.event.id,
      scheduledTime: new Date(scheduledTime).getTime(),
      finishedTime: finishedTime.getTime()
    } : null,
    client: {
      appId: 'mindlogger-web',
      appVersion: packageJson.version
    },
    languageCode: languageKey,
    alerts,
    nextActivities: cumActivities.concat(nonHiddenCumActivities).map(name => {
      const activity = appletMetaData.activities.find(activity => activity.name.en == name)
      return activity && activity.id.split('/').pop()
    }).filter(id => id)
  };

  if (appletMetaData.publicId) {
    responseData.publicId = appletMetaData.publicId;
  }

  const index = activity.items.findIndex(
    item => item.valueConstraints && item.valueConstraints.isResponseIdentifier
  );

  if (index >= 0) {
    responseData.identifier = responses[index].value !== undefined ? responses[index].value : responses[index];
  }

  let subScaleResult = [];
  if (activity.subScales) {
    subScaleResult = getSubScaleResult(
      activity.subScales,
      responses,
      activity.items
    )
  }

  /** process for encrypting response */
  if (appletMetaData.encryption) {
    const formattedResponses = activity.items.reduce(
      (accumulator, item, index) => ({ ...accumulator, [item.schema]: index }),
      {},
    );
    const dataSource = getEncryptedData(responses, appletMetaData.AESKey);
    responseData['responses'] = formattedResponses;
    responseData['dataSource'] = dataSource;

    responseData['events'] = getEncryptedData(events.map(event => ({
      ...event,
      screen: activity.items[event.screen].schema
    })), appletMetaData.AESKey);

    if (activity.finalSubScale) {
      subScaleResult.push(getFinalSubScale(responses, activity.items, activity.finalSubScale.isAverageScore, activity.finalSubScale.lookupTable));
    }

    if (subScaleResult.length) {
      responseData['subScaleSource'] = getEncryptedData(subScaleResult, appletMetaData.AESKey);
      responseData['subScales'] = (activity.subScales || []).reduce((accumulator, subScale, index) => ({ ...accumulator, [subScale.variableName]: index }), {});

      if (activity.finalSubScale) {
        responseData['subScales'][activity.finalSubScale.variableName] = (activity.subScales || []).length;
      }
    }

    responseData['tokenCumulation'] = {
      value: cumulative
    };

    responseData['userPublicKey'] = appletMetaData.userPublicKey;

  } else {
    const formattedResponses = activity.items.reduce((accumulator, item, index) => {
      return {
        ...accumulator,
        [item.schema]: responses[index],
      };
    }, {});
    responseData['responses'] = formattedResponses;
    responseData['events'] = events.map(event => ({
      ...event,
      screen: activity.items[event.screen].schema
    }));

    if (activity.subScales) {
      responseData['subScales'] = activity.subScales.reduce((accumulator, subScale, index) => {
        return {
          ...accumulator,
          [subScale.variableName]: subScaleResult[index],
        }
      });
    }

    if (activity.finalSubScale) {
      responseData['subScales'] = responseData['subScales'] || {};
      responseData['subScales'][activity.finalSubScale.variableName] =
        getFinalSubScale(responses, activity.items, activity.finalSubScale.isAverageScore, activity.finalSubScale.lookupTable);
    }

    responseData['tokenCumulation'] = {
      value: cumulative
    };
  }

  return responseData;
};

export const getTokenUpdateInfo = (
  offset,
  responseHistory,
  appletMetaData
) => {
  const cumulative = responseHistory.tokens.cumulativeToken + offset;

  if (appletMetaData.encryption) {
    return {
      offset: getEncryptedData(
        {
          value: offset
        },
        appletMetaData.AESKey
      ),
      cumulative: {
        value: cumulative
      },
      userPublicKey: appletMetaData['userPublicKey']
    }
  }

  return {
    offset: { value: offset },
    cumulative: { value: cumulative }
  }
};

export const mergeResponses = (old, latest) => {
  if (old.dataSources && latest.dataSources) {
    Object.keys(old.dataSources).forEach(key => {
      if (!latest.dataSources[key]) {
        latest.dataSources[key] = old.dataSources[key];
      }
    })
  }

  if (old.responses && latest.responses) {
    Object.keys(old.responses).forEach(item => {
      if (!latest.responses[item]) {
        latest.responses[item] = old.responses[item];
      }
    })
  }
}

export const decryptAppletResponses = (applet, responses) => {
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
          response.id = response.value.src;

          response.value =
            responses.dataSources[response.value.src][response.value.ptr];

          if (response.value && response.value.value !== undefined) {
            response.value = response.value.value;
          }
        }
      }

      responses.responses[item] = responses.responses[item].filter(
        (response) => response.value !== undefined && response.value !== null
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
        const currentActivity = applet.activities.find(activity => activity.id.split('/').pop() === oldItem.original.activityId)

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
  return { ...responses };
}

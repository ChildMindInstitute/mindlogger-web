import { createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";

import RESPONSE_CONSTANTS from './responses.constants';
import { authTokenSelector, userInfoSelector, loggedInSelector } from "../user/user.selectors";
import { prepareResponseKeys, setCumulativeActivities } from '../applet/applet.reducer';
import { appletCumulativeActivities } from '../applet/applet.selectors';
import { setFinishedEvents } from '../app/app.reducer';
import { currentAppletSelector, currentActivitySelector, currentEventSelector } from '../app/app.selectors';
import { getPrivateKey } from '../../services/encryption';
import { evaluateCumulatives } from '../../services/scoring';
import { sendPDFExport } from '../../services/reports';
import {
  currentResponsesSelector,
  currentAppletResponsesSelector,
  uploadQueueSelector,
} from './responses.selectors';

import {
  addToUploadQueue,
  setDownloadingResponses,
  setResponsesDownloadProgress,
  replaceResponses,
  replaceAppletResponse,
  setLastResponseTime,
  shiftUploadQueue,
  removeResponseInProgress,
  setAlerts
} from './responses.reducer';
import { appletsSelector } from '../applet/applet.selectors';

import { getAESKey, getPublicKey } from '../../services/encryption';
import { getTokenUpdateInfo, prepareResponseForUpload } from '../../models/response';
import { updateUserTokenBalance, getSchedule } from '../../services/network';
import { downloadAllResponses, uploadResponseQueue, downloadAppletResponse } from '../../services/api';

export const updateKeys = (applet, userInfo) => (dispatch) => {
  if (!applet.encryption) return;

  const AESKey = getAESKey(
    userInfo.privateKey,
    applet.encryption.appletPublicKey,
    applet.encryption.appletPrime,
    applet.encryption.base
  );

  const userPublicKey = Array.from(
    getPublicKey(
      userInfo.privateKey,
      applet.encryption.appletPrime,
      applet.encryption.base
    )
  );

  dispatch(
    prepareResponseKeys({
      appletId: applet.id,
      keys: {
        AESKey,
        userPublicKey
      }
    })
  );
};

export const completeResponse = createAsyncThunk(RESPONSE_CONSTANTS.COMPLETE_RESPONSES, async (isTimeout, { dispatch, getState }) => {
  let state = getState();
  const authToken = authTokenSelector(state);
  let applet = currentAppletSelector(state);
  const inProgressResponse = currentResponsesSelector(state);
  const activity = currentActivitySelector(state);
  const event = currentEventSelector(state);

  if ((!applet.AESKey || !applet.userPublicKey || applet.publicId)) {
    if (applet.publicId) {
      const pass = activity.items.findIndex(item => item.correctAnswer?.en)
      const identifier = activity.items.findIndex(item => item.valueConstraints?.isResponseIdentifier)

      dispatch(updateKeys(applet, {
        privateKey: getPrivateKey({
          userId: applet.publicId,
          email: identifier >= 0 && inProgressResponse['responses'][identifier] || '',
          password: pass >= 0 && inProgressResponse['responses'][pass] || ''
        })
      }))
    } else {
      dispatch(updateKeys(applet, userInfoSelector(state)));
    }

    state = getState()
    applet = currentAppletSelector(state)
  }

  const responseHistory = currentAppletResponsesSelector(state);
  const finishedTime = new Date();

  if (activity.isPrize === true) {
    const selectedPrizeIndex = inProgressResponse["responses"][0];
    const version = inProgressResponse["activity"].schemaVersion['en'];
    const selectedPrize = activity.items[0].valueConstraints.itemList[selectedPrizeIndex];

    const updates = getTokenUpdateInfo(
      -selectedPrize.price,
      responseHistory,
      applet,
    );

    await updateUserTokenBalance(
      authToken,
      applet.id.split('/').pop(),
      updates.offset,
      updates.cumulative,
      version,
      updates.userPublicKey || null
    );

    if (!applet.publicId) {
      await dispatch(downloadResponses())
    }

  } else {
    const { cumActivities, nonHiddenCumActivities } = evaluateCumulatives(inProgressResponse.responses, activity);
    const cumulativeActivities = appletCumulativeActivities(state);

    if (cumActivities.length || nonHiddenCumActivities.length) {
      let archieved = [...cumulativeActivities[applet.id].archieved];
      let available = [...cumulativeActivities[applet.id].available];
      const activityId = activity.id.split('/').pop();

      if (nonHiddenCumActivities.length) {
        const ids = nonHiddenCumActivities.map(name => {
          const activity = applet.activities.find(activity => activity.name.en == name)
          return activity && activity.id.split('/').pop()
        }).filter(id => id)

        available = available.concat(_.intersection(archieved, ids));
        archieved = _.difference(archieved, ids);
        available = _.uniq(available.concat(ids));
      } else if (archieved.indexOf(activityId) < 0) {
        archieved.push(activityId);
      }

      available = available.concat(
        cumActivities.map(name => {
          const activity = applet.activities.find(activity => activity.name.en == name)
          return activity && activity.id.split('/').pop()
        }).filter(id => id)
      ).filter(id => id != activity.id.split('/').pop())

      dispatch(
        setCumulativeActivities({
          ...cumulativeActivities,
          [applet.id]: {
            available,
            archieved
          }
        })
      );
    }

    const preparedResponse = prepareResponseForUpload(inProgressResponse, applet, responseHistory, isTimeout, finishedTime);

    dispatch(setAlerts(preparedResponse.alerts));

    dispatch(addToUploadQueue(preparedResponse));
    await dispatch(startUploadQueue());
  }

  if (event) {
    dispatch(setFinishedEvents({
      [event]: finishedTime.getTime()
    }));
  }

  state = getState();

  setTimeout(() => {
    const { activity } = inProgressResponse;

    dispatch(
      removeResponseInProgress(activity.event ? activity.id + activity.event.id : activity.id)
    );

    if (activity.allowExport) {
      sendPDFExport(
        authToken,
        applet,
        [activity],
        currentAppletResponsesSelector(state),
        activity.id,
      );
    }
  }, 200);
})

export const downloadResponses = createAsyncThunk(RESPONSE_CONSTANTS.DOWNLOAD_RESPONSES, async (args, { dispatch, getState }) => {
  const state = getState();
  const authToken = authTokenSelector(state);
  const applets = appletsSelector(state);
  const userInfo = userInfoSelector(state);

  for (const applet of applets) {
    if ((!applet.AESKey || !applet.userPublicKey)) {
      dispatch(updateKeys(applet, userInfo));
    }
  }

  dispatch(setDownloadingResponses(true));

  const responses = await downloadAllResponses(authToken, applets, (downloaded, total) => {
    dispatch(setResponsesDownloadProgress({ downloaded, total }));
  })
  if (loggedInSelector(getState())) {
    dispatch(replaceResponses(responses));
  }
  dispatch(setDownloadingResponses(false));

  const timezone = -new Date().getTimezoneOffset() / 60;
  const schedule = await getSchedule(authToken, timezone);
  dispatch(setLastResponseTime(schedule));
})

export const downloadResponse = createAsyncThunk(RESPONSE_CONSTANTS.DOWNLOAD_RESPONSE, async (args, { dispatch, getState }) => {
  const state = getState();
  const authToken = authTokenSelector(state);
  const userInfo = userInfoSelector(state);
  const applet = currentAppletSelector(state);
  const allApplets = appletsSelector(state);

  if ((!applet.AESKey || !applet.userPublicKey)) {
    dispatch(updateKeys(applet, userInfo))
  }

  dispatch(setDownloadingResponses(true));

  const appletResponse = await downloadAppletResponse(authToken, applet);

  if (loggedInSelector(getState())) {
    dispatch(replaceAppletResponse({
      response: appletResponse,
      index: allApplets.findIndex(d => d.id == applet.id)
    }));
  }
  dispatch(setDownloadingResponses(false));

  const timezone = -new Date().getTimezoneOffset() / 60;
  const schedule = await getSchedule(authToken, timezone);
  dispatch(setLastResponseTime(schedule));
})

export const startUploadQueue = createAsyncThunk(RESPONSE_CONSTANTS.START_UPLOAD_QUEUE, async (args, { dispatch, getState }) => {
  const state = getState();
  const uploadQueue = uploadQueueSelector(state);
  const authToken = authTokenSelector(state);
  const applet = currentAppletSelector(state);

  await uploadResponseQueue(authToken, uploadQueue, () => {
    dispatch(shiftUploadQueue());
  })

  if (!applet.publicId) {
    if (applet) {
      await dispatch(downloadResponse());
    } else {
      await dispatch(downloadResponses());
    }
  }
})

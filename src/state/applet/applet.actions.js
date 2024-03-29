import { createAsyncThunk } from "@reduxjs/toolkit";

import { authTokenSelector, userInfoSelector } from '../user/user.selectors';
import { getLocalInfo, modifyApplet } from '../../util/applet';
import { appletsSelector } from './applet.selectors';
import { updateKeys } from '../responses/responses.actions';
import { responsesSelector } from '../responses/responses.selectors';
import { replaceResponses, setLastResponseTime } from '../responses/responses.reducer';
import { setCumulativeActivities, setProfiles } from './applet.reducer';

import { transformApplet, parseAppletEvents } from '../../services/json-ld';
import { getAppletsAPI, getPublicAppletAPI } from '../../services/applet.service';
import { decryptAppletResponses, mergeResponses } from '../../models/response';
import { setFinishedEvents } from '../app/app.reducer';

import APPLET_CONSTANTS from './applet.constants';

// NOTE: this is for now, when we implemented the rest widgets we should remove this code
const INPUT_TYPES = ["radio", "checkox", "slider", "text", "ageSelector", "dropdownList", "duration"]

export const getApplets = createAsyncThunk(APPLET_CONSTANTS.GET_APPLETS, async (args, { getState, dispatch }) => {
  const state = getState();
  const token = authTokenSelector(state);
  const userInfo = userInfoSelector(state);
  const currentApplets = appletsSelector(state);
  const oldResponses = responsesSelector(state) || [];
  const localInfo = getLocalInfo(currentApplets, oldResponses);
  const responses = [];
  const applets = await getAppletsAPI({ token, localInfo });

  const transformedApplets = [];
  let finishedEvents = {};
  let lastResponseTime = {}, profiles = {};
  let cumulativeActivities = {};

  for (let index = 0; index < applets.data.length; index++) {
    const appletInfo = applets.data[index];
    const nextActivities = appletInfo.cumulativeActivities;
    Object.assign(finishedEvents, appletInfo.finishedEvents);
    lastResponseTime[`applet/${appletInfo.id}`] = appletInfo.lastResponses;
    profiles[`applet/${appletInfo.id}`] = appletInfo.profile;

    if (!appletInfo.applet) {
      const applet = modifyApplet(appletInfo, currentApplets);
      const appletData = parseAppletEvents(applet);

      // NOTE: this is for now, when we implemented the rest widgets we should remove this code
      let isIgnore = false;
      const appletActivities = appletData.activities.filter(act => {
        if (isIgnore) return;

        isIgnore = act.items.find(item => !INPUT_TYPES.includes(item.inputType));
        // if (!isIgnore)
        //   isIgnore = act.compute && act.compute[0];

        return !act.isPrize;
      });

      applet.isIgnore = !!isIgnore;
      if (appletActivities.length > 0) {
        responses.push({
          ...decryptAppletResponses(applet, appletInfo.responses),
          appletId: 'applet/' + appletInfo.id
        });

        transformedApplets.push(applet)
        cumulativeActivities[applet.id] = nextActivities;
      }
    } else {
      const applet = transformApplet(appletInfo, currentApplets);
      const appletData = parseAppletEvents(applet);

      // NOTE: this is for now, when we implemented the rest widgets we should remove this code
      let isIgnore = false;
      const appletActivities = appletData.activities.filter(act => {
        if (isIgnore) return;
        isIgnore = act.items.find(item => !INPUT_TYPES.includes(item.inputType));

        // if (!isIgnore)
          // isIgnore = act.compute && act.compute[0];

        return !act.isPrize;
      });

      applet.isIgnore = !!isIgnore;
      if (appletActivities.length > 0) {
        if (!applet.AESKey || !applet.userPublicKey) {
          dispatch(updateKeys(applet, userInfo));
        }

        responses.push({
          ...decryptAppletResponses(applet, appletInfo.responses),
          appletId: 'applet/' + appletInfo.id
        });
        transformedApplets.push(applet);

        cumulativeActivities[applet.id] = nextActivities;
      }
    }
  };

  for (let i = 0; i < responses.length; i++) {
    const old = oldResponses.find(old => old && old.appletId == responses[i].appletId);

    if (old) {
      mergeResponses(old, responses[i]);
    }
  }

  dispatch(setProfiles(profiles));
  dispatch(setLastResponseTime(lastResponseTime));
  dispatch(setFinishedEvents(finishedEvents));
  dispatch(setCumulativeActivities(cumulativeActivities));
  dispatch(replaceResponses(responses));

  return transformedApplets;
});

export const getPublicApplet = createAsyncThunk(APPLET_CONSTANTS.GET_PUBLIC_APPLET, async (publicId, { getState, dispatch }) => {
  const appletInfo = await getPublicAppletAPI({
    publicId, nextActivity: ''
  })

  const applet = transformApplet(appletInfo);

  applet.publicId = publicId;

  return applet
});

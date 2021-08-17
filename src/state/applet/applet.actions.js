import { createAsyncThunk } from "@reduxjs/toolkit";

import { authTokenSelector, userInfoSelector } from '../user/user.selectors';
import { getLocalInfo, modifyApplet } from '../../util/applet';
import { responsesSelector } from '../app/app.selectors';
import { appletsSelector } from './applet.selectors';
import { updateKeys } from '../responses/responses.actions';
import { replaceResponses } from '../responses/responses.reducer';

import { transformApplet, parseAppletEvents } from '../../services/json-ld';
import { getAppletsAPI, getPublicAppletAPI } from '../../services/applet.service';
import { decryptAppletResponses } from '../../models/response';

import APPLET_CONSTANTS from './applet.constants';

// NOTE: this is for now, when we implemented the rest widgets we should remove this code
const INPUT_TYPES = ["radio", "checkox", "slider", "text", "duration"]

export const getApplets = createAsyncThunk(APPLET_CONSTANTS.GET_APPLETS, async (args, { getState, dispatch }) => {
  const state = getState();
  const token = authTokenSelector(state);
  const userInfo = userInfoSelector(state);
  const currentApplets = appletsSelector(state);
  const currentResponses = responsesSelector(state) || [];
  const localInfo = getLocalInfo(currentApplets, currentResponses);
  const responses = [];
  const applets = await getAppletsAPI({ token, localInfo });

  const transformedApplets = [];
  for (let index = 0; index < applets.data.length; index++) {
    const appletInfo = applets.data[index];

    if (!appletInfo.applet) {
      const applet = modifyApplet(appletInfo, currentApplets);
      const appletData = parseAppletEvents(applet);

      // NOTE: this is for now, when we implemented the rest widgets we should remove this code
      let isIgnore = false;
      const appletActivities = appletData.activities.filter(act => {
        if (isIgnore) return;

        isIgnore = act.items.find(item => !INPUT_TYPES.includes(item.inputType));
        if (!isIgnore)
          isIgnore = act.compute && act.compute[0];

        return !act.isPrize;
      });

      if (appletActivities.length > 0 && !isIgnore) {
        responses.push({
          ...decryptAppletResponses(applet, appletInfo.responses),
          appletId: 'applet/' + appletInfo.id
        });

        transformedApplets.push(applet)
      }
    } else {
      const applet = transformApplet(appletInfo, currentApplets);
      const appletData = parseAppletEvents(applet);

      // NOTE: this is for now, when we implemented the rest widgets we should remove this code
      let isIgnore = false;
      const appletActivities = appletData.activities.filter(act => {
        if (isIgnore) return;
        isIgnore = act.items.find(item => !INPUT_TYPES.includes(item.inputType));

        if (!isIgnore)
          isIgnore = act.compute && act.compute[0];

        return !act.isPrize;
      });

      if (appletActivities.length > 0 && !isIgnore) {
        if (!applet.AESKey || !applet.userPublicKey) {
          dispatch(updateKeys(applet, userInfo));
        }

        responses.push({
          ...decryptAppletResponses(applet, appletInfo.responses),
          appletId: 'applet/' + appletInfo.id
        });
        transformedApplets.push(applet);
      }
    }
  };

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

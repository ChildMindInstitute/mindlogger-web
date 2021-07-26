import { createAsyncThunk } from "@reduxjs/toolkit";

import { authTokenSelector, userInfoSelector } from '../user/user.selectors';
import { getLocalInfo, modifyApplet } from '../../util/applet';
import { responsesSelector } from '../app/app.selectors';
import { appletsSelector } from './applet.selectors';
import { updateKeys } from '../responses/responses.actions';
import { replaceResponses } from '../responses/responses.reducer';

import { transformApplet } from '../../services/json-ld';
import { getAppletsAPI, getPublicAppletAPI } from '../../services/applet.service';
import { decryptAppletResponses } from '../../models/response';

import APPLET_CONSTANTS from './applet.constants';

export const getApplets = createAsyncThunk(APPLET_CONSTANTS.GET_APPLETS, async (args, { getState, dispatch }) => {
  const state = getState();
  const token = authTokenSelector(state);
  const userInfo = userInfoSelector(state);
  const currentApplets = appletsSelector(state);
  const currentResponses = responsesSelector(state) || [];
  const localInfo = getLocalInfo(currentApplets, currentResponses);
  const responses = [];
  const applets = await getAppletsAPI({
    token, localInfo
  })

  const transformedApplets = applets
    .map((appletInfo) => {
      if (!appletInfo.applet) {
        const applet = modifyApplet(appletInfo, currentApplets);

        responses.push({
          ...decryptAppletResponses(applet, appletInfo.responses),
          appletId: 'applet/' + appletInfo.id
        });

        return applet
      } else {
        const applet = transformApplet(appletInfo, currentApplets);

        if (!applet.AESKey || !applet.userPublicKey) {
          dispatch(updateKeys(applet, userInfo));
        }

        responses.push({
          ...decryptAppletResponses(applet, appletInfo.responses),
          appletId: 'applet/' + appletInfo.id
        });
        return applet;
      }
    });

  dispatch(replaceResponses(responses));

  return transformedApplets;
});

export const getPublicApplet = createAsyncThunk(APPLET_CONSTANTS.GET_PUBLIC_APPLET, async (publicId, { getState, dispatch }) => {
  const appletInfo = await getPublicAppletAPI({
    publicId, nextActivity: ''
  })

  const applet = transformApplet(appletInfo);

  applet.publicId = publicId;

  if (!applet.AESKey || !applet.userPublicKey) {
    // dispatch(updateKeys(applet, userInfo));
  }

  return applet
});

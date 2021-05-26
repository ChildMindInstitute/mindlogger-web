import { createAsyncThunk } from "@reduxjs/toolkit";

import { authTokenSelector, userInfoSelector } from '../user/user.selectors';
import { getLocalInfo, modifyApplet } from '../../util/applet';
import { responsesSelector } from '../app/app.selectors';
import { appletsSelector } from './applet.selectors';
import { prepareResponseKeys } from './applet.reducer';
import { updateKeys } from '../responses/responses.actions';

import { transformApplet } from '../../services/json-ld';
import { getAppletsAPI } from '../../services/applet.service';
import { decryptAppletResponses } from '../../models/response';

import APPLET_CONSTANTS from './applet.constants';

export const getApplets = createAsyncThunk(APPLET_CONSTANTS.GET_APPLETS, async (keys, { getState, dispatch }) => {
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
        responses.push(currentResponses.find(({ appletId }) => {
          return appletId.split("/").pop() === appletInfo.id
        }));
        return modifyApplet(appletInfo, currentApplets);
      } else {
        const applet = transformApplet(appletInfo, currentApplets);

        if (!applet.AESKey || !applet.userPublicKey) {
          const appletId = applet.id.split('/')[1];

          if (keys && keys[appletId]) {
            dispatch(prepareResponseKeys(applet.id, keys[appletId]))
            Object.assign(applet, keys[appletId]);
          } else {
            dispatch(updateKeys(applet, userInfo));
          }
        }

        responses.push({
          ...decryptAppletResponses(applet, appletInfo.responses),
          appletId: 'applet/' + appletInfo.id
        });
        return applet;
      }
    });

  return transformedApplets;
});

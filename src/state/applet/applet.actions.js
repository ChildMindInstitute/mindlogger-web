import { createAsyncThunk } from "@reduxjs/toolkit";

import { authTokenSelector } from "../user/user.selectors";
import { getLocalInfo, modifyApplet } from "../../util/applet";
import { appletsSelector, responsesSelector } from "../app/app.selectors";

import { transformApplet } from '../../services/json-ld';
import { getAppletsAPI } from '../../services/applet.service';

import APPLET_CONSTANTS from './applet.constants';

export const getApplets = createAsyncThunk(APPLET_CONSTANTS.GET_APPLETS, async (args, { getState }) => {
  const state = getState();
  const token = authTokenSelector(state);
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

          // Todo: decrypt applet responses
        }
        return applet;
      }
    });

  return transformedApplets;
});

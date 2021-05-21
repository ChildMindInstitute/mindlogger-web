import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalInfo, modifyApplet } from "../../util/applet";
import { authTokenSelector, userInfoSelector } from "../user/user.selectors";
import { appletsSelector, responsesSelector } from "../app/app.selectors";
import {
  getInvitationAPI,
  acceptInvitationAPI,
  declineInvitationAPI,
} from '../../services/invitation.service';
import { transformApplet } from '../../services/json-ld';
import { getAppletsAPI } from '../../services/applet.service';
import APP_CONSTANTS from './app.constants';

export const getInvitation = createAsyncThunk(APP_CONSTANTS.GET_INVITATION, async (invitationId, { getState }) => {
  try {
    const state = getState();
    const token = authTokenSelector(state);
    const res = await getInvitationAPI({ invitationId, token });
    return res;
  } catch (error) {
    throw new Error(error);
  }
});

export const getApplets = createAsyncThunk(APP_CONSTANTS.GET_APPLETS, async (args, { getState }) => {
  const state = getState();
  const token = authTokenSelector(state);
  const currentApplets = appletsSelector(state);
  const currentResponses = responsesSelector(state) || [];
  const localInfo = getLocalInfo(currentApplets, currentResponses);
  const responses = [];
  const applets = await getAppletsAPI({
    token, localInfo
  })
  const transformedApplets = applets.data
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

export const acceptInvitation = createAsyncThunk(APP_CONSTANTS.ACCEPT_INVITATION, async (invitationId, { getState }) => {
  try {
    const state = getState();
    const user = userInfoSelector(state);
    const token = authTokenSelector(state);

    const res = await acceptInvitationAPI({
      token,
      invitationId,
      email: user.email
    })

    return res;
  } catch (error) {
    throw new Error(error.message);
  }
});

export const declineInvitation = createAsyncThunk(APP_CONSTANTS.DECLINE_INVITATION, async (invitationId, { getState }) => {
  try {
    const state = getState();
    const token = authTokenSelector(state);

    const res = await declineInvitationAPI({ invitationId, token });

    return res;
  } catch (error) {
    throw new Error(error.message);
  }
});


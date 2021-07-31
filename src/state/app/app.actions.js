import { createAsyncThunk } from "@reduxjs/toolkit";
import { authTokenSelector, userInfoSelector } from "../user/user.selectors";
import { appletsSelector } from "../app/app.selectors";
import {
  getInvitationAPI,
  acceptInvitationAPI,
  declineInvitationAPI,
} from '../../services/invitation.service';
import {acceptInviteLinkAPI, getInviteLinkInfoAPI} from "../../services/invite-link.service";
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


export const getInviteLinkInfo = createAsyncThunk(APP_CONSTANTS.GET_INVITE_LINK_INFO, async (inviteLinkId, { getState }) => {
  return await getInviteLinkInfoAPI({ inviteLinkId });
});


export const acceptInviteLink = createAsyncThunk(APP_CONSTANTS.ACCEPT_INVITE_LINK, async (inviteLinkId, { getState }) => {
  const state = getState();
  const token = authTokenSelector(state);

  return await acceptInviteLinkAPI({
    token,
    inviteLinkId
  });
});

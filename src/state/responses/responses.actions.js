import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalInfo, modifyApplet } from "../../util/applet";
import { authTokenSelector, userInfoSelector } from "../user/user.selectors";
import { appletsSelector, responsesSelector } from "../app/app.selectors";
import {
  getInvitationAPI,
  acceptInvitationAPI,
  declineInvitationAPI,
} from '../../services/invitation.service';
import { getAppletsAPI } from '../../services/applet.service';
import APP_CONSTANTS from './app.constants';

// export const declineInvitation = createAsyncThunk(APP_CONSTANTS.DECLINE_INVITATION, async (invitationId, { getState }) => {
//   try {
//     const state = getState();
//     const token = authTokenSelector(state);

//     const res = await declineInvitationAPI({ invitationId, token });

//     return res;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });


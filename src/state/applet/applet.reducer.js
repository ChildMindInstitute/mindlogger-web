import { createSlice } from '@reduxjs/toolkit';

import APPLET_CONSTANTS from './applet.constants';

export const initialState = {
  /**
   * List of applets for the current logged in account.
   *
   * @type {object}.
   */
  applets: [],
  applet: {},
  responses: [],
  isReminderSet: false,
  scheduleUpdated: false,
  currentTime: new Date(),
  isDownloadingApplets: false,
  isDownloadingTargetApplet: false,
  downloadProgress: {
    total: 0,
    downloaded: 0,
  },
  notifications: {},
  invites: [],
  currentInvite: '',
  appletResponseData: {},
  activityAccess: {},
};

const appletSlice = createSlice({
  name: "applet",
  initialState,
  reducers: {
    clearApplets: () => initialState,
    selectApplet: (state, action) => { state.applet = action.payload },
    selectActivity: (state, action) => { state.activityAccess = action.payload },

  },
  extraReducers: {
    [`${APPLET_CONSTANTS.GET_APPLETS}/pending`]: (state, action) => { state.loading = true; state.error = null },
    [`${APPLET_CONSTANTS.GET_APPLETS}/fulfilled`]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.applets = action.payload;
    },
    [`${APPLET_CONSTANTS.GET_APPLETS}/rejected`]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  }

})

export default appletSlice.reducer;

export const { clearApplets, selectApplet, selectActivity } = appletSlice.actions;
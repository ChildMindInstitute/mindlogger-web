import { createSlice } from '@reduxjs/toolkit';

import APPLET_CONSTANTS from './applet.constants';

export const initialState = {
  /**
   * List of applets for the current logged in account.
   *
   * @type {object}.
   */
  applets: [],
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

  },
})

export default appletSlice.reducer;

export const { clearUser } = appletSlice.actions;

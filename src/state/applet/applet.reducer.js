import { createSlice } from '@reduxjs/toolkit';
import _ from "lodash";

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
  currentTime: new Date().getTime(),
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
  cumulativeActivities: {},
  hiddenCumulativeActivities: [],
};

const appletSlice = createSlice({
  name: "applet",
  initialState,
  reducers: {
    clearApplets: () => ({ ...initialState, cumulativeActivities, hiddenCumulativeActivities }),
    selectApplet: (state, action) => { state.applet = action.payload },
    selectActivity: (state, action) => { state.activityAccess = action.payload },
    setCumulativeActivities: (state, action) => { state.cumulativeActivities = { ...state.cumulativeActivities, ...action.payload } },
    setHiddenCumulativeActivities: (state, action) => {
      const { id, isRemove } = action.payload || {};
      let hiddenCumulativeActivities = [...state.hiddenCumulativeActivities];
      if (isRemove) {
        _.remove(hiddenCumulativeActivities, val => val === id);
      } else
        hiddenCumulativeActivities = [...hiddenCumulativeActivities, id];

      state.hiddenCumulativeActivities = hiddenCumulativeActivities;
    },
    prepareResponseKeys: (state, action) => {
      const { appletId, keys } = action.payload;
      const index = state.applets.findIndex(applet => applet.id == appletId);

      if (index >= 0) {
        state.applets[index].AESKey = keys.AESKey;
        state.applets[index].userPublicKey = keys.userPublicKey;
      }
    }
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

    [`${APPLET_CONSTANTS.GET_PUBLIC_APPLET}/pending`]: (state, action) => { state.loading = true; state.error = null; },
    [`${APPLET_CONSTANTS.GET_PUBLIC_APPLET}/fulfilled`]: (state, action) => {
      state.loading = false;
      state.error = null;

      const newApplet = action.payload;

      const index = state.applets.findIndex(applet => applet.id == newApplet.id);

      if (index >= 0) {
        state.applets[index] = newApplet;
      } else {
        state.applets.push(newApplet);
      }
    },
    [`${APPLET_CONSTANTS.GET_PUBLIC_APPLET}/rejected`]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  }

})

export default appletSlice.reducer;

export const {
  clearApplets,
  selectApplet,
  selectActivity,
  prepareResponseKeys,
  setCumulativeActivities,
  setHiddenCumulativeActivities
} = appletSlice.actions;

import { createSlice } from '@reduxjs/toolkit'

import APP_CONSTANTS from './app.constants'
import config from '../../util/config'

export const initialState = {
  /**
   * The URL to the HTTP API server.
   *
   * @type {string}
   */
  apiHost: config.defaultApiHost,
  applets: [],
  responses: [],

  /**
   * The current skin (theme) for the app.
   *
   * @type {object}
   * @property {string} name the name of the skin.
   * @property {object} colors the current colors.
   * @property {string} colors.primary the primary color.
   * @property {string} colors.secondary the secondary color.
   */
  skin: config.defaultSkin,

  /**
   * The ID of the current applet.
   *
   * @type {string}
   */
  currentApplet: null,

  /**
   * The ID of the current activity.
   *
   * @type {string}
   */
  currentActivity: null,

  /**
   * Whether the applet cards are disabled.
   *
   * @type {boolean}.
   */
  appletSelectionDisabled: false,

  /**
   * Whether the activity cards are disabled.
   *
   * @type {boolean}.
   */
  activitySelectionDisabled: false,

  /**
   * If false, applet data will only be downloaded using Wi-Fi.
   *
   * @type {boolean}
   */
  mobileDataAllowed: true,

  /**
   * True if the application is in the foreground, false otherwise.
   *
   * @type {boolean}
   */
  appStatus: false,

  /**
   * Maps applet IDs to the last time the schedule was fetched for that applet.
   *
   * @type {object}
   */
  lastUpdatedTime: {},

  /**
   * redirect url for app
   *
   * @type {string}
   */
  redirectUrl: null
}

const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setApiHost: (state, action) => { state.apiHost = action.payload },
    resetApiHost: (state, action) => { state.apiHost = initialState.apiHost },
    setSkin: (state, action) => { state.skin = action.payload },
    setUpdatedTime: (state, action) => { state.lastUpdatedTime = action.payload },
    setCurrentApplet: (state, action) => { state.currentApplet = action.payload },
    setCurrentActivity: (state, action) => { state.currentActivity = action.payload },
    setAppletSelectionDisabled: (state, action) => { state.appletSelectionDisabled = action.payload },
    setActivitySelectionDisabled: (state, action) => { state.activitySelectionDisabled = action.payload },
    setAppStatus: (state, action) => { state.appStatus = action.payload },
    toggleMobileDataAllowed: (state, action) => { state.mobileDataAllowed = !state.mobileDataAllowed },
    setRedirectUrl: (state, action) => { state.redirectUrl = action.payload },
  },
  extraReducers: {
    [`${APP_CONSTANTS.GET_APPLETS}/pending`]: (state, action) => { state.loading = true; state.error = null },
    [`${APP_CONSTANTS.GET_APPLETS}/fulfilled`]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.applets = action.payload;
    },
    [`${APP_CONSTANTS.GET_APPLETS}/rejected`]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  }
})

export default AppSlice.reducer;
export const {
  setApiHost,
  setSkin,
  setUpdatedTime,
  setCurrentApplet,
  setCurrentActivity,
  setAppletSelectionDisabled,
  setActivitySelectionDisabled,
  setAppStatus,
  setRedirectUrl,
  toggleMobileDataAllowed,
  resetApiHost,
} = AppSlice.actions;

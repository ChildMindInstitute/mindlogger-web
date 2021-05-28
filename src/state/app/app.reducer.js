import { createSlice } from '@reduxjs/toolkit'

import APP_CONSTANTS from './app.constants'
import config from '../../util/config'

export const initialState = {
  appStatus: false,
  apiHost: config.defaultApiHost,
  skin: config.defaultSkin,
  currentApplet: null,
  currentActivity: null,
  appletSelectionDisabled: false,
  activitySelectionDisabled: false,
  mobileDataAllowed: true,
  lastUpdatedTime: {},
  finishedEvents: {},
  responses: [],
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
    setFinishedEvents: (state, action) => { state.finishedEvents = action.payload },
    setActivitySelectionDisabled: (state, action) => { state.activitySelectionDisabled = action.payload },
    setAppStatus: (state, action) => { state.appStatus = action.payload },
    toggleMobileDataAllowed: (state, action) => { state.mobileDataAllowed = !state.mobileDataAllowed },
    setRedirectUrl: (state, action) => { state.redirectUrl = action.payload },
  }
})

export default AppSlice.reducer;
export const {
  setApiHost,
  setSkin,
  setFinishedEvents,
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

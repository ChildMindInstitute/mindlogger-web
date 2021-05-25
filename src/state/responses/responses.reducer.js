<<<<<<< HEAD
import { createSlice } from '@reduxjs/toolkit';
import * as R from 'ramda';

export const initialState = {
  responseHistory: [],
  inProgress: {},
  isSelected: false,
  isDownloadingResponses: false,
  isSummaryScreen: false,
  downloadProgress: {
    total: 0,
    downloaded: 0,
  },
  uploadQueue: [],
  schedule: {},
  activityOpened: false,
};

const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    createResponseInProgress: (state, action) => {
      const { activity, event, subjectId, timeStarted } = action.payload;

      console.log(activity);

      state.inProgress[activity.id] = {
        responses: new Array(activity.items.length),
        subjectId: subjectId,
        timeStarted: timeStarted,
        screenIndex: 0,
      }
    },

    setCurrentScreen: (state, action) => {
      const { screenIndex, activityId } = action.payload;
      state.inProgress[activityId].screenIndex = screenIndex;
    },

    setAnswer: (state, action) => {
      const { screenIndex, activityId, answer } = action.payload;

      state.inProgress[activityId].responses[screenIndex] = answer;
    }
  },
})

export const { createResponseInProgress, setCurrentScreen, setAnswer } = responseSlice.actions;
export default responseSlice.reducer;
=======
import { createSlice } from '@reduxjs/toolkit'

import APP_CONSTANTS from './responses.constants'
import config from '../../util/config'

export const initialState = {
  /**
   * The URL to the HTTP API server.
   *
   * @type {string}
   */
  inProgress: {},
}

const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInProgress: (state, action) => { state.inProgress = action.payload },

  },
  extraReducers: {
    // [`${APP_CONSTANTS.GET_APPLETS}/pending`]: (state, action) => { state.loading = true; state.error = null },
    // [`${APP_CONSTANTS.GET_APPLETS}/fulfilled`]: (state, action) => {
    //   state.loading = false;
    //   state.error = null;
    //   state.applets = action.payload;
    // },
    // [`${APP_CONSTANTS.GET_APPLETS}/rejected`]: (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // },
  }
})

export default AppSlice.reducer;
export const {
  setInProgress
} = AppSlice.actions;
>>>>>>> 5ade2fa1a38df818cde671d4a99d2c6486bcb835

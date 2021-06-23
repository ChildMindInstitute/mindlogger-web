import * as R from 'ramda';
import { createSlice } from '@reduxjs/toolkit';

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

    addToUploadQueue: (state, action) => {
      state.uploadQueue = [...state.uploadQueue, action.payload]
    },

    setAnswer: (state, action) => {
      const { screenIndex, activityId, answer } = action.payload;
      console.log('set answer ---------', answer)
      state.inProgress[activityId].responses[screenIndex] = answer;
    },
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

export const {
    addToUploadQueue,
    createResponseInProgress,
    setCurrentScreen,
    setAnswer,
    setInProgress
} = responseSlice.actions;
export default responseSlice.reducer;

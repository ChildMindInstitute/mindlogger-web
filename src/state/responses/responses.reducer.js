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

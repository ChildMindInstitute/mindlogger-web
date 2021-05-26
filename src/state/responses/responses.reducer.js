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

    setAnswer: (state, action) => {
      const { screenIndex, activityId, answer } = action.payload;

      state.inProgress[activityId].responses[screenIndex] = answer;
    },
    setInProgress: (state, action) => { state.inProgress = action.payload },
    addToUploadQueue: (state, action) => {
      state.uploadQueue.push(action.payload);
    },
    setDownloadingResponses: (state, action) => {
      state.isDownloadingResponses = action.payload;
    },
    setResponsesDownloadProgress: (state, action) => {
      state.downloadProgress = {
        downloaded: action.payload.downloaded,
        total: action.payload.total,
      };
    },
    replaceResponses: (state, action) => {
      state.responseHistory = action.payload;
    },
    replaceAppletResponse: (state, action) => {
      state.responseHistory[action.payload.index] = action.payload.response;
    },
    setSchedule: (state, action) => {
      state.schedule = state.action.payload
    },
    shiftUploadQueue: (state, action) => {
      state.uploadQueue = R.remove(0, 1, state.uploadQueue);
    }
  },
  extraReducers: {
  }
})

export const {
    createResponseInProgress,
    setCurrentScreen,
    setAnswer,
    setInProgress,
    addToUploadQueue,
    setDownloadingResponses,
    setResponsesDownloadProgress,
    replaceResponses,
    setSchedule,
    replaceAppletResponse,
    shiftUploadQueue
} = responseSlice.actions;
export default responseSlice.reducer;

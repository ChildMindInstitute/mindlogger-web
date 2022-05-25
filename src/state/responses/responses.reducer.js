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
  currentEvent: null,
};

const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    createResponseInProgress: (state, action) => {
      const { activity, event, subjectId, timeStarted } = action.payload;
      if (event) state.currentEvent = event.id.toString();
      else state.currentEvent = '';

      state.inProgress[activity.event ? activity.id + activity.event.id : activity.id] = {
        responses: new Array(activity.items.length),
        subjectId: subjectId,
        timeStarted: timeStarted,
        screenIndex: 0,
        activity: activity,
        events: []
      }
    },

    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },

    setCurrentScreen: (state, action) => {
      const { screenIndex, activityId } = action.payload;
      const currentEvent = state.currentEvent || '';
      state.inProgress[activityId + currentEvent].screenIndex = screenIndex;
    },

    setAnswer: (state, action) => {
      const { screenIndex, activityId, answer } = action.payload;
      const currentEvent = state.currentEvent || '';

      state.inProgress[activityId + currentEvent].responses[screenIndex] = answer;
    },

    addUserActivityEvent: (state, action) => {
      const { activityId, event } = action.payload;
      const currentEvent = state.currentEvent || '';

      state.inProgress[activityId + currentEvent].events.push(event);
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
    setLastResponseTime: (state, action) => {
      state.lastResponseTime = action.payload
    },
    shiftUploadQueue: (state, action) => {
      state.uploadQueue = R.remove(0, 1, state.uploadQueue);
    },
    removeResponseInProgress: (state, action) => {
      delete state.inProgress[action.payload];
    },
  },
  extraReducers: {
  }
})

export const {
  createResponseInProgress,
  setCurrentScreen,
  setCurrentEvent,
  setAnswer,
  setInProgress,
  addToUploadQueue,
  setDownloadingResponses,
  setResponsesDownloadProgress,
  replaceResponses,
  setLastResponseTime,
  replaceAppletResponse,
  shiftUploadQueue,
  removeResponseInProgress,
  addUserActivityEvent,
} = responseSlice.actions;
export default responseSlice.reducer;
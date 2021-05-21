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

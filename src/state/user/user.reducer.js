import { createSlice } from '@reduxjs/toolkit';

import USER_CONSTANTS from './user.constants';

export const initialState = {
  auth: null,
  info: null,
  error: null,
  loading: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: () => {
      localStorage.clear();
      return initialState
    },
  },
  extraReducers: {
    [`${USER_CONSTANTS.SIGNIN}/pending`]: (state, action) => { state.loading = true; state.error = null },
    [`${USER_CONSTANTS.SIGNIN}/fulfilled`]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.info = action.payload.user;
      state.auth = action.payload.authToken;
    },
    [`${USER_CONSTANTS.SIGNIN}/rejected`]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [`${USER_CONSTANTS.SIGNUP}/pending`]: (state, action) => { state.loading = true; state.error = null },
    [`${USER_CONSTANTS.SIGNUP}/fulfilled`]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.auth = action.payload.authToken;
      const user = { ...action.payload };
      delete user['authToken'];
      state.info = user;
    },
    [`${USER_CONSTANTS.SIGNUP}/rejected`]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [`${USER_CONSTANTS.FORGOT_PASSWORD}/pending`]: (state, action) => { state.loading = true; state.error = null },
    [`${USER_CONSTANTS.FORGOT_PASSWORD}/fulfilled`]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [`${USER_CONSTANTS.FORGOT_PASSWORD}/rejected`]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [`${USER_CONSTANTS.CHANGE_PASSWORD}/pending`]: (state, action) => { state.loading = true; state.error = null },
    [`${USER_CONSTANTS.CHANGE_PASSWORD}/fulfilled`]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [`${USER_CONSTANTS.CHANGE_PASSWORD}/rejected`]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    [`${USER_CONSTANTS.REMOVE_ACCOUNT}/pending`]: (state, action) => { state.loading = true; state.error = null },
    [`${USER_CONSTANTS.REMOVE_ACCOUNT}/fulfilled`]: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    [`${USER_CONSTANTS.REMOVE_ACCOUNT}/rejected`]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

  }
})

export default userSlice.reducer;

export const { clearUser } = userSlice.actions;

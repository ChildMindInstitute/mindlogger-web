import { createAsyncThunk } from '@reduxjs/toolkit';

import { clearUser } from './user.reducer';
import { clearApplets } from '../applet/applet.reducer';
import { getPrivateKey } from '../../services/encryption';
import { authTokenSelector, userInfoSelector } from './user.selectors';
import { forgotPasswordAPI, deleteUserAccount } from '../../services/network';
import { signInAPI, signUpAPI, updatePasswordAPI, signOutAPI } from '../../services/authentication.service';

import USER_CONSTANTS from './user.constants';
import { Mixpanel } from '../../services/mixpanel';


export const signIn = createAsyncThunk(USER_CONSTANTS.SIGNIN, async (user) => {
  try {
    const response = await signInAPI(user)
    const privateKey = getPrivateKey({
      userId: response.user._id,
      email: user.email,
      password: user.password
    });

    Mixpanel.track('Login Successful');
    Mixpanel.login(response.user._id);

    return {
      ...response,
      user: { ...response.user, privateKey, email: user.email }
    }

  } catch (error) {
    throw new Error(error);
  }
});

export const signUp = createAsyncThunk(USER_CONSTANTS.SIGNUP, async (user) => {
  const response = await signUpAPI(user)
  const privateKey = getPrivateKey({
    userId: response._id,
    email: user.email,
    password: user.password
  });

  if (!response.error) {
    Mixpanel.track('Account Creation complete');
    Mixpanel.login(response._id);
  }

  return { ...response, privateKey, email: user.email };
});

export const forgotPassword = createAsyncThunk(USER_CONSTANTS.FORGOT_PASSWORD, async (email) => {
  try {
    const response = await forgotPasswordAPI(email)
    return response;

  } catch (error) {
    throw new Error(error);
  }
});

export const updatePassword = createAsyncThunk(USER_CONSTANTS.CHANGE_PASSWORD, async ({ token, passwordData }) => {
  try {
    const response = await updatePasswordAPI(token, passwordData)
    return response;

  } catch (error) {
    throw new Error(error);
  }
});

export const doLogout = createAsyncThunk(USER_CONSTANTS.LOGOUT, async (args, { getState, dispatch }) => {
  try {
    const state = getState();
    const authToken = authTokenSelector(state);

    // Delete files for activities in progress
    if (authToken !== null)
      signOutAPI(authToken);

    dispatch(clearUser());
    dispatch(clearApplets());
    Mixpanel.logout();
  } catch (error) {
    throw new Error(error);
  }
});

export const removeAccount = createAsyncThunk(USER_CONSTANTS.REMOVE_ACCOUNT, async (args, { getState, dispatch }) => {
  try {
    const state = getState();
    const user = userInfoSelector(state);
    const authToken = authTokenSelector(state);

    await deleteUserAccount(authToken, user._id)
    dispatch(clearUser());

  } catch (error) {
    throw new Error(error);
  }
});

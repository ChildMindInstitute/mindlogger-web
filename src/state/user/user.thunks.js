import * as R from 'ramda';
import {
  setInfo,
  setAuth,
} from './user.actions';
import { push } from 'connected-react-router'
export const signInSuccessful = response => {
  return (dispatch) => {
  dispatch(setInfo(response.user));
  dispatch(setAuth(response.authToken));
  dispatch(push('/profile'))
}};

export const signUpSuccessful = response => (dispatch) => {
  dispatch(setInfo(R.omit(['authToken'], response)));
  dispatch(setAuth(R.prop('authToken', response)));
  dispatch(push('/profile'))
};

export const updateUserDetailsSuccessful = response => (dispatch) => {
  dispatch(setInfo(response));
};

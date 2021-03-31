import * as R from 'ramda'
import { setInfo, setAuth } from './user.actions'
import { setRedirectUrl } from '../app/app.actions'
import { push } from 'connected-react-router'
export const signInSuccessful = (response) => {
  return (dispatch, getState) => {
    dispatch(setInfo(response.user))
    dispatch(setAuth(response.authToken))
    if (getState().app.redirectUrl) dispatch(push(getState().app.redirectUrl))
    else dispatch(push('/profile'))
    dispatch(setRedirectUrl(null))
  }
}

export const signUpSuccessful = (response) => (dispatch, getState) => {
  dispatch(setInfo(R.omit(['authToken'], response)))
  dispatch(setAuth(R.prop('authToken', response)))
  if (getState().app.redirectUrl) dispatch(push(getState().app.redirectUrl))
  else {
    dispatch(push('/profile'))
    dispatch(setRedirectUrl(null))
  }
}

export const updateUserDetailsSuccessful = (response) => (dispatch) => {
  dispatch(setInfo(response))
}


import { clearUser } from '../user/user.actions';
import { signOut, deleteUserAccount, postAppletBadge } from '../../services/network';
import { authTokenSelector, userInfoSelector } from '../user/user.selectors';
import { push } from 'connected-react-router'




export const doLogout = () => (dispatch, getState) => {
  const state = getState();
  // Delete files for activities in progress
  if (state.user.auth !== null) {
    signOut(state.user.auth.token);
  }
  dispatch(clearUser());
  dispatch(push('/login'))
};

export const removeAccount = () => (dispatch, getState) => {
  const state = getState();
  const authToken = authTokenSelector(state);
  const user = userInfoSelector(state);

  deleteUserAccount(authToken, user._id).then(() => {
    dispatch(clearUser());
  });
};

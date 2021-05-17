import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { connectRouter } from 'connected-react-router'

import app from './app/app.reducer';
import user from './user/user.reducer';
import applet from './applet/applet.reducer';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  app,
  form,
  user,
  applet,

});
export default createRootReducer

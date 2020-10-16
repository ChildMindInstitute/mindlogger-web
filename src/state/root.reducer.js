import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import app from './app/app.reducer';
import user from './user/user.reducer';
import { connectRouter } from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  app,
  form,
  user,

});
export default createRootReducer

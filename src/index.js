import './custom.scss';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore from './store';
import { clearUser } from './state/user/user.actions';
import moment from 'moment';
import { currentAppletSelector } from './state/app/app.selectors';

const checkAuthToken = (store) => {
    const state = store.getState();
    if (state.user.auth === null) {
        store.dispatch(clearUser()); // Just in case
        return false;
    }

    const authExpiration = moment(state.user.auth.expires);
    if (moment().isAfter(authExpiration)) {
        store.dispatch(clearUser()); // Auth token expired
        return false;
    }

    return true;
};


const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

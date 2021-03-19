import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import './i18Next'
import { Provider } from 'react-redux'
import configureStore from './store'
import { clearUser } from './state/user/user.actions'

import './custom.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import './index.css'

import App from './App'

import * as serviceWorker from './serviceWorker'

const checkAuthToken = (store) => {
  const state = store.getState()
  const auth = state.user.auth
  const expirationDate = moment(auth.expires)

  if (auth === null || moment().isAfter(expirationDate)) {
    store.dispatch(clearUser()) // Just in case
    return false
  }

  return true
}

const store = configureStore()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger/src';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createRootReducer from './state/root.reducer';
import isDev from "./util/utils";

let store;

export const history = createBrowserHistory()

export default function configureStore(onCompletion) {
  const persistConfig = {
    key: 'root-v3',
    storage,
    // whitelist: [],
    blacklist: ['form'],
  };

  const persistedReducer = persistReducer(persistConfig, createRootReducer(history));

  // eslint-disable-next-line no-undef
  const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    // eslint-disable-next-line no-undef
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25,
    }))
    || compose;

  const middlewares = [
    thunk,
  ];
  if (isDev()) {
    middlewares.push(
      createLogger({
        level: 'info',
        collapsed: true,
        diff: true,
      }),
    );
  }

  store = createStore(persistedReducer, {}, composeEnhancers(
    applyMiddleware(routerMiddleware(history), ...middlewares),
  ));
  persistStore(store, null, onCompletion);

  return store;
}

export const getStore = () => store;

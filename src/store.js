import logger from 'redux-logger';
import { createBrowserHistory } from 'history';
import storage from 'redux-persist/lib/storage';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import createRootReducer from './state/root.reducer';
import isDev from "./util/utils";

let store;

export const history = createBrowserHistory()

export default (onCompletion) => {
  const persistConfig = {
    key: 'root-v3',
    storage,
    // whitelist: [],
    blacklist: ['form'],
  };

  const persistedReducer = persistReducer(persistConfig, createRootReducer(history));

  store = configureStore({
    reducer: persistedReducer,
    middleware: [...getDefaultMiddleware(), logger, routerMiddleware(history)],
    devTools: isDev,
  });

  const persist = persistStore(store, null, onCompletion);

  return { store, persist };
}

export const getStore = () => store;

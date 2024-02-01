

import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';

import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import generalReducer from "./general";

import crossBrowserListener from "./persist_listener";

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, generalReducer);

export const store = configureStore({
    reducer: {
        general: persistedReducer
    },
    middleware: [thunk]
});


export const persistor = persistStore(store);

window.addEventListener('storage', crossBrowserListener(store, persistConfig));
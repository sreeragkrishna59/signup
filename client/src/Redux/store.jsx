import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storageData from 'redux-persist/lib/storage'
console.log("storage ",storageData.default);
let storage=storageData.default
import userslicePage from './userSlice'
const persistConfig = {
  key: 'diginet',
  version: 1,
  storage,
}

const persistedReducer = persistReducer(persistConfig,userslicePage)

export const store = configureStore({
  reducer:{loginInfo:persistedReducer},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)


import { configureStore } from '@reduxjs/toolkit';
import huntSlice from './Slices/HuntSlice';
import authSlice from './Slices/authSlice';
import { combineReducers } from '@reduxjs/toolkit';
import {
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from 'redux-logger';

const reducers = combineReducers({
	huntSlice: huntSlice,
	authSlice: authSlice,
});

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: true,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

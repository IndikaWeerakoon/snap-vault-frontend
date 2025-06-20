import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from './slices/counter-slice';
import authReducer from './slices/auth-slice';

export const rootReducer = combineReducers({
    counter: counterReducer,
    auth: authReducer, 
});
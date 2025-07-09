import { combineReducers } from "@reduxjs/toolkit";
import authReducer from './slices/auth-slice';
import fileReducer from './slices/file-slice';

export const rootReducer = combineReducers({
    auth: authReducer, 
    file: fileReducer
});
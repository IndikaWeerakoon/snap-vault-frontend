/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from 'redux-persist/lib/storage';

export interface AuthState {
    loading: { [key: string]: boolean };
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    loading: {},
    error: null,
    isAuthenticated: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginAsync: (state, _action: PayloadAction<{ username: string; password: string }>) => {
            state.loading.login = true;
            state.error = null;
        },
        loginStatus: (state, action: PayloadAction<{ isAuthenticated: boolean; error?: string }>) => {
            console.log('Login status:', action.payload);
            state.loading.login = false;
            state.isAuthenticated = action.payload.isAuthenticated;
            state.error = action.payload.error ?? null;
        },
        logoutAsync: (state) => {
            state.loading.logout = true;
            state.error = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.error = null;
            state.loading.logout = false;
        }
    }
});

export const { loginAsync, loginStatus, logout, logoutAsync } = authSlice.actions;

const counterPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['isAuthenticated'],
  };

export default persistReducer(counterPersistConfig, authSlice.reducer);

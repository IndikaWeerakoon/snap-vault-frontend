/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from 'redux-persist/lib/storage';
import type { CreateAccount, UserResponse } from "../../api/type/api.type";

export interface AuthState {
    loading: { [key: string]: boolean };
    error: string | null;
    isAuthenticated: boolean;
    user: UserResponse | null;
}

const initialState: AuthState = {
    loading: {},
    error: null,
    isAuthenticated: false,
    user: null,
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
            state.user = null;
        },
        signUpAsync: (state, _action: PayloadAction<CreateAccount>) => {
            state.loading.signUp = true;
            state.error = null;
        },
        signUpStatus: (state, action: PayloadAction<{ error?: string }>) => {
            state.loading.signUp = false;
            state.error = action.payload.error ?? null;
        },
        getMeObjectAsync: (state) => {
            state.loading.getMe = true;
            state.error = null;
        },
        getMeObjectStatus: (state, action: PayloadAction<{ user: UserResponse | null; error?: string }>) => {
            state.loading.getMe = false;
            state.user = action.payload.user;
            state.error = action.payload.error ?? null;
        }
    }
});

export const { 
    loginAsync, 
    loginStatus, 
    logout, 
    logoutAsync, 
    signUpStatus, 
    signUpAsync, 
    getMeObjectAsync, 
    getMeObjectStatus 
} = authSlice.actions;

const counterPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['isAuthenticated', 'user'], 
  };

export default persistReducer(counterPersistConfig, authSlice.reducer);

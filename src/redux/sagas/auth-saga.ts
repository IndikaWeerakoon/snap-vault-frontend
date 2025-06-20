import { call, put, takeLatest } from "redux-saga/effects";
import { loginAsync, loginStatus, logout, logoutAsync } from "../slices/auth-slice";
import { AuthError, signIn, signOut } from "aws-amplify/auth";
import type { PayloadAction } from "@reduxjs/toolkit";

function signinErrors(error: Error): string {
    if (error instanceof AuthError) {
      return error.message;
    }
    return 'Unknown error occurred';
}

function* watchLogin({ payload }: PayloadAction<{ username: string; password: string }>) {
   try {
    yield call(signIn,{
        username: payload.username,
        password: payload.password
    });
    yield put(loginStatus({ isAuthenticated: true }));
  } catch (error) {
    console.error('Login failed:', signinErrors(error as Error));
    yield put(loginStatus({ isAuthenticated: false, error: signinErrors(error as Error) }));
  }
}

function* watchLogout() {
    try {
        yield call(signOut, {global: true});
        yield put(logout());
    } catch (error) {
        console.error('Logout failed:', error);
        yield put(loginStatus({ isAuthenticated: true, error: (error as Error).message }));
    }
}


export default function* authSaga() {
    yield takeLatest(loginAsync, watchLogin);
    yield takeLatest(logoutAsync, watchLogout);
}
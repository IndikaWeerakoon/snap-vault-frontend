import { call, put, takeLatest } from "redux-saga/effects";
import { getMeObjectAsync, getMeObjectStatus, loginAsync, loginStatus, logout, logoutAsync, signUpAsync, signUpStatus } from "../slices/auth-slice";
import { AuthError, signIn, signOut } from "aws-amplify/auth";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CreateAccount, UserResponse } from "../../api/type/api.type";
import { createAccount, getMeObject } from "../../api/backend-api";
import type { AxiosResponse } from "axios";

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
    yield put(getMeObjectAsync());
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

function* watchSignUp({ payload }: PayloadAction<CreateAccount>) {
    try {
        yield call(createAccount, payload);
        yield put(signUpStatus({}));
        yield put(loginAsync({ username: payload.email, password: payload.password }));
    } catch (error) {
        console.error('Sign up failed:', error);
        yield put(signUpStatus({ error: (error as Error).message }));
    }
}

function* watchGetMeObject() {
    try {
        const user: AxiosResponse<UserResponse> = yield call(getMeObject);
        yield put(getMeObjectStatus({ user: user.data }));
    } catch (error) {
        console.error('Get user object failed:', error);
        yield put(getMeObjectStatus({ user: null, error: (error as Error).message }));
    }
}

export default function* authSaga() {
    yield takeLatest(loginAsync, watchLogin);
    yield takeLatest(logoutAsync, watchLogout);
    yield takeLatest(signUpAsync, watchSignUp);
    yield takeLatest(getMeObjectAsync, watchGetMeObject);
}
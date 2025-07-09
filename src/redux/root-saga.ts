import { all, fork } from "redux-saga/effects"
import authSaga from "./sagas/auth-saga"
import fileSaga from "./sagas/file-saga"

export function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(fileSaga)
    ])  
}
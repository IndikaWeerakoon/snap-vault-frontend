import { all, fork } from "redux-saga/effects"
import userSaga from "./sagas/counter-saga"
import authSaga from "./sagas/auth-saga"

export function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(authSaga),
        // Add your sagas here
        // Example: fork(someSaga),
    ])  
}
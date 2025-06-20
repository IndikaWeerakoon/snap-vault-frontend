import { call, put, takeLatest } from "redux-saga/effects";
import { incrementByAmount, incrementAsync } from "../slices/counter-slice";

function* watchIncrementAsync() {
  yield call(() => new Promise(resolve => setTimeout(resolve, 1000)));
  yield put(incrementByAmount(2));
}

export default function* userSaga() {
    yield takeLatest(incrementAsync.type, watchIncrementAsync);
}
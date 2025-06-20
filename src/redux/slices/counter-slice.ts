import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export interface CounterState {
    value: number;
}

const initialState: CounterState = {
    value: 0,  
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        incrementAsync: (_state) => {}
    },
})

export const { increment, decrement, incrementByAmount, incrementAsync } = counterSlice.actions;

const counterPersistConfig = {
    key: 'counter',
    storage,
    whitelist: ['value'], // Only persist the 'value' field
  };

export default persistReducer(counterPersistConfig, counterSlice.reducer);


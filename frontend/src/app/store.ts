import { configureStore } from "@reduxjs/toolkit";
import shiftsReducer from "../store/shiftsSlice";
import leavesReducer from "../store/leavesSlice";
import employeesReducer from "../store/employeesSlice";

export const store = configureStore({
  reducer: {
    shifts: shiftsReducer,
    leaves: leavesReducer,
    employees: employeesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Leave } from "../types/leave";

interface LeavesState {
  items: Leave[];
}

const initialState: LeavesState = {
  items: [],
};

const leavesSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {
    setLeaves(state, action: PayloadAction<Leave[]>) {
      state.items = action.payload;
    },

    addLeave(state, action: PayloadAction<Leave>) {
      state.items.unshift(action.payload);
    },

    updateLeaveInStore(state, action: PayloadAction<Leave>) {
      const index = state.items.findIndex(
        (leave) => leave.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    removeLeave(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (leave) => leave.id !== action.payload
      );
    },
  },
});

export const {
  setLeaves,
  addLeave,
  updateLeaveInStore,
  removeLeave,
} = leavesSlice.actions;

export default leavesSlice.reducer;

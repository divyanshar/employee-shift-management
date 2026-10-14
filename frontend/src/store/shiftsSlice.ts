import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Shift } from "../types/shift";

interface ShiftsState {
  items: Shift[];
  selectedShift: Shift | null;
}

const initialState: ShiftsState = {
  items: [],
  selectedShift: null,
};

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setShifts(state, action: PayloadAction<Shift[]>) {
      state.items = action.payload;
    },

    setSelectedShift(state, action: PayloadAction<Shift | null>) {
      state.selectedShift = action.payload;
    },

    addShift(state, action: PayloadAction<Shift>) {
      state.items.push(action.payload);
    },

    updateShiftInStore(state, action: PayloadAction<Shift>) {
      const index = state.items.findIndex(
        (shift) => shift.id === action.payload.id,
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

      if (state.selectedShift?.id === action.payload.id) {
        state.selectedShift = action.payload;
      }
    },

    removeShift(state, action: PayloadAction<string>) {
      state.items = state.items.filter((shift) => shift.id !== action.payload);

      if (state.selectedShift?.id === action.payload) {
        state.selectedShift = null;
      }
    },

    clearSelectedShift(state) {
      state.selectedShift = null;
    },
  },
});

export const {
  setShifts,
  setSelectedShift,
  addShift,
  updateShiftInStore,
  removeShift,
  clearSelectedShift,
} = shiftsSlice.actions;

export default shiftsSlice.reducer;

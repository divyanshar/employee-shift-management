import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export interface Employee {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface EmployeesState {
  items: Employee[];
}

const initialState: EmployeesState = {
  items: [],
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.items = action.payload;
    },
    addEmployee(state, action: PayloadAction<Employee>) {
      state.items.push(action.payload);
    },

    removeEmployee(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (employee) => employee.id !== action.payload
      );
    },

    clearEmployees(state) {
      state.items = [];
    },
  },
});

export const {
  setEmployees,
  addEmployee,
  removeEmployee,
  clearEmployees,
} = employeesSlice.actions;

export default employeesSlice.reducer;

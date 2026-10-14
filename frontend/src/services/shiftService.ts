import axiosInterceptor from "./axiosInterceptor";
import type { ShiftInput,ShiftStatus } from "../types/shift";

export async function getShifts(search = "", status = "") {
  const response = await axiosInterceptor.get("/shifts", {
    params: {
      search: search.trim() || undefined,
      status: status || undefined,
    },
  });

  return response.data;
}

export const getMyShifts = async () => {
  const response = await axiosInterceptor.get("/shifts/my-schedule");
  return response.data;
};

export const getShiftById = async (id: string) => {
  const response = await axiosInterceptor.get(`/shifts/${id}`);
  return response.data;
};

export const createShift = async (data: ShiftInput) => {
  const response = await axiosInterceptor.post("/shifts", data);
  return response.data;
};

export const updateShift = async (id: string, data: Partial<ShiftInput>) => {
  const response = await axiosInterceptor.patch(`/shifts/${id}`, data);
  return response.data;
};

export const assignShift = async (shiftId: string, employeeId: string) => {
  const response = await axiosInterceptor.post("/assignments", {
    shiftId,
    employeeId,
  });
  return response.data;
};

export const completeShift = async (id: string) => {
  const response = await axiosInterceptor.patch(`/shifts/${id}/complete`);
  return response.data;
};

export const cancelShift = async (id: string) => {
  const response = await axiosInterceptor.patch(`/shifts/${id}/cancel`);
  return response.data;
};
export const deleteShift = async (id: string) => {
  const response = await axiosInterceptor.delete(`/shifts/${id}`);
  return response.data;
};

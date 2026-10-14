import axiosInterceptor from "./axiosInterceptor";
import type { Leave, LeaveInput } from "../types/leave";

export async function getLeaves(): Promise<Leave[]> {
  const response = await axiosInterceptor.get<Leave[]>("/leaves");
  return response.data;
}

export async function getLeaveById(id: string): Promise<Leave> {
  const response = await axiosInterceptor.get<Leave>(`/leaves/${id}`);
  return response.data;
}

export async function createLeave(data: LeaveInput): Promise<Leave> {
  const response = await axiosInterceptor.post<Leave>("/leaves", data);
  return response.data;
}

export async function approveLeave(id: string): Promise<Leave> {
  const response = await axiosInterceptor.patch<Leave>(`/leaves/${id}/approve`);
  return response.data;
}

export async function rejectLeave(id: string): Promise<Leave> {
  const response = await axiosInterceptor.patch<Leave>(`/leaves/${id}/reject`);
  return response.data;
}

export async function cancelLeave(id: string): Promise<Leave> {
  const response = await axiosInterceptor.patch<Leave>(`/leaves/${id}/cancel`);
  return response.data;
}
export async function updateLeave(id:string,data:LeaveInput){
  const response=await axiosInterceptor.patch(`/leaves/${id}/edit`, data);
  return response.data;
}
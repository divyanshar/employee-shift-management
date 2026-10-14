
export type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface Leave {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveInput {
  startDate: string;
  endDate: string;
  reason: string;
}

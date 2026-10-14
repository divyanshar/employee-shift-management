export type ShiftStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "COMPLETED"
  | "CANCELLED";

export interface Shift {
  id: string;
  title: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  employeeId: string | null;
  status: ShiftStatus;
}

export interface ShiftInput {
  title: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}
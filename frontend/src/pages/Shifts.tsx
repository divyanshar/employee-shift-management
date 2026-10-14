import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getShifts,
  assignShift,
  completeShift,
  cancelShift,
  deleteShift,
} from "../services/shiftService";

import { getEmployees } from "../services/userService";
import ShiftTable from "../components/ShiftTable";
import type { Shift } from "../types/shift";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setShifts } from "../store/shiftsSlice";
import { setEmployees } from "../store/employeesSlice";

export default function Shifts() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const shifts = useAppSelector((state) => state.shifts.items);
  const employees = useAppSelector((state) => state.employees.items);

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const isAdmin = localStorage.getItem("Role")?.toUpperCase() === "ADMIN";

  async function loadShifts(
    searchValue: string = search,
    statusValue: string = statusFilter,
  ) {
    try {
      const data = await getShifts(
        searchValue,
        statusValue === "ALL" ? "" : statusValue,
      );

      dispatch(setShifts(data));
    } catch {
      toast.error("Failed to load shifts.");
    }
  }

  async function loadEmployees() {
    try {
      const data = await getEmployees();
      dispatch(setEmployees(data));
    } catch {
      toast.error("Failed to load employees.");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadShifts(search, statusFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  async function handleAssign() {
    if (!selectedShift || !employeeId) {
      toast.error("Please select an employee.");
      return;
    }

    try {
      await assignShift(selectedShift.id, employeeId);

      toast.success("Shift assigned successfully.");
      setSelectedShift(null);
      setEmployeeId("");

      await loadShifts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to assign shift.");
    }
  }

  async function handleComplete(shift: Shift) {
    try {
      await completeShift(shift.id);
      toast.success("Shift marked as completed.");
      await loadShifts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete shift.");
    }
  }

  async function handleCancel(shift: Shift) {
    if (!window.confirm("Are you sure you want to cancel this shift?")) {
      return;
    }

    try {
      await cancelShift(shift.id);
      toast.success("Shift cancelled successfully.");
      await loadShifts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel shift.");
    }
  }

  async function handleDelete(shift: Shift) {
    if (!isAdmin) {
      toast.error("Only administrators can delete shifts.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this shift?")) {
      return;
    }

    try {
      await deleteShift(shift.id);
      toast.success("Shift deleted successfully.");
      await loadShifts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete shift.");
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Shift Management</h1>

        <button
          className="primary-button"
          onClick={() => navigate("/shifts/create")}
        >
          Create Shift
        </button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by title or department"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <ShiftTable
        shifts={shifts}
        isAdmin={isAdmin}
        onView={(shift) => navigate(`/shifts/${shift.id}`)}
        onEdit={(shift) => navigate(`/shifts/${shift.id}/edit`)}
        onAssign={(shift) => {
          setSelectedShift(shift);
          setEmployeeId("");
        }}
        onComplete={handleComplete}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />

      {selectedShift && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Assign Shift</h2>

            <p>
              Select an employee for: <strong>{selectedShift.title}</strong>
            </p>

            <select
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
            >
              <option value="">Select Employee</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.email})
                </option>
              ))}
            </select>

            <div className="form-actions">
              <button className="primary-button" onClick={handleAssign}>
                Assign
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSelectedShift(null);
                  setEmployeeId("");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

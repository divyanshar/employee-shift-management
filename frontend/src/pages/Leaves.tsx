import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setLeaves, updateLeaveInStore } from "../store/leavesSlice";
import { setEmployees } from "../store/employeesSlice";

import { getEmployees } from "../services/userService";
import {
  getLeaves,
  approveLeave,
  rejectLeave,
  cancelLeave,
} from "../services/leaveService";

export default function Leaves() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const leaves = useAppSelector((state) => state.leaves.items);
  const employees = useAppSelector((state) => state.employees.items);

  const role = localStorage.getItem("Role")?.toUpperCase();
  const isReviewer = role === "ADMIN" || role === "MANAGER";
  const isEmployee = role === "EMPLOYEE";

  useEffect(() => {
    async function loadLeaves() {
      try {
        const data = await getLeaves();
        dispatch(setLeaves(data));
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Failed to load leave requests."
        );
      }
    }

    loadLeaves();
  }, [dispatch]);

  useEffect(() => {
    if (!isReviewer|| employees.length > 0) return;

    async function loadEmployees() {
      try {
        const data = await getEmployees();
        dispatch(setEmployees(data));
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Failed to load employees."
        );
      }
    }

    loadEmployees();
  }, [dispatch, employees.length]);

  async function handleApprove(id: string) {
    try {
      const updatedLeave = await approveLeave(id);
      dispatch(updateLeaveInStore(updatedLeave));
      toast.success("Leave approved successfully.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to approve leave."
      );
    }
  }

  async function handleReject(id: string) {
    try {
      const updatedLeave = await rejectLeave(id);
      dispatch(updateLeaveInStore(updatedLeave));
      toast.success("Leave rejected successfully.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to reject leave."
      );
    }
  }

  async function handleCancel(id: string) {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to cancel this leave request?</p>

        <button
          type="button"
          onClick={async () => {
            toast.dismiss(toastId);

            try {
              const updatedLeave = await cancelLeave(id);
              dispatch(updateLeaveInStore(updatedLeave));
              toast.success("Leave request cancelled successfully.");
            } catch (err: any) {
              toast.error(
                err.response?.data?.message ||
                  "Failed to cancel leave request."
              );
            }
          }}
          style={{ marginRight: "8px" }}
        >
          Confirm
        </button>

        <button
          type="button"
          onClick={() => toast.dismiss(toastId)}
        >
          Cancel
        </button>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  }

  return (
    <section className="page-container">
      <div className="page-header">
        <div>
          <h1>Leave Management</h1>
          <p className="muted">View and manage leave requests.</p>
        </div>

        {isEmployee && (
          <button onClick={() => navigate("/leaves/new")}>
            Request Leave
          </button>
        )}
      </div>

      {leaves.filter((leave) => leave.status !== "CANCELLED").length === 0 ? (
        <div className="empty-state">No leave requests found.</div>
      ) : (
        <div className="table-wrapper">
          <table className="simple-table">
            <thead>
              <tr>
                {isReviewer && <th>Employee Name</th>}
                <th>Start date</th>
                <th>End date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {leaves
                .filter((leave) => leave.status !== "CANCELLED")
                .map((leave) => {
                  const employee = employees.find(
                    (item) => item.id === leave.employeeId
                  );

                  return (
                    <tr key={leave.id}>
                      {isReviewer && (
                        <td>{employee?.name ?? leave.employeeId}</td>
                      )}

                      <td>{leave.startDate.slice(0, 10)}</td>
                      <td>{leave.endDate.slice(0, 10)}</td>
                      <td>{leave.reason}</td>

                      <td>
                        <span
                          className={`status-badge status-${leave.status.toLowerCase()}`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          {isReviewer && leave.status === "PENDING" && (
                            <>
                              <button
                                className="small-button"
                                onClick={() => handleApprove(leave.id)}
                              >
                                Approve
                              </button>

                              <button
                                className="small-button danger-button"
                                onClick={() => handleReject(leave.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isEmployee && leave.status === "PENDING" && (
                            <>
                              <button
                                className="small-button danger-button"
                                onClick={() => handleCancel(leave.id)}
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                className="secondary-button"
                                title="Edit leave"
                                onClick={() =>
                                  navigate(`/leaves/${leave.id}/edit`)
                                }
                              >
                                📝
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

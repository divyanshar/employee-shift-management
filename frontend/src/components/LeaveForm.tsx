import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { addLeave, updateLeaveInStore } from "../store/leavesSlice";

import {
  createLeave,
  getLeaveById,
  updateLeave,
} from "../services/leaveService";
import type { LeaveInput } from "../types/leave";
import { toast } from "react-toastify";
export default function LeaveForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Read the leave ID from the URL, if present
  const { id } = useParams();

  // ID exists = edit mode; no ID = create mode
  const isEditMode = Boolean(id);

  const [form, setForm] = useState<LeaveInput>({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing leave details when editing
  useEffect(() => {
    if (!id) return;
    async function loadLeave() {
      try {
        setLoading(true);
        const leave = await getLeaveById(id!);
        // Only pending requests can be edited
        if (leave.status !== "PENDING") {
          window.alert("Only pending leave requests can be edited.");
          navigate("/leaves");
          return;
        }

        // Populate the form with existing values
        setForm({
          startDate: leave.startDate.slice(0, 10),
          endDate: leave.endDate.slice(0, 10),
          reason: leave.reason,
        });
      } catch (err: any) {
        window.alert(
          err.response?.data?.message || "Failed to load leave request.",
        );
        navigate("/leaves");
      } finally {
        setLoading(false);
      }
    }
    loadLeave();
  }, [id, navigate]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.startDate > form.endDate) {
      window.alert("Start date cannot be after end date.");
      return;
    }

    try {
      if (isEditMode && id) {
        // EDIT: update the existing leave request
        const updatedLeave = await updateLeave(id, form);
        dispatch(updateLeaveInStore(updatedLeave));
        toast.success("Leave updated successfully.");
      } else {
        // CREATE: submit a new leave request
        const newLeave = await createLeave(form);
        dispatch(addLeave(newLeave));
        toast.success("Leave request submitted successfully.");
      }
      navigate("/leaves");
    } catch (err: any) {
      toast.error(
        `Failed to ${isEditMode ? "update" : "submit"} leave request.`,
      );
    }
  }

  if (loading) {
    return (
      <section className="page-container">
        <p>Loading leave request...</p>
      </section>
    );
  }

  return (
    <section className="page-container">
      <h1>{isEditMode ? "Edit Leave Request" : "Request Leave"}</h1>

      <p className="muted">
        {isEditMode
          ? "Update your pending leave request."
          : "Submit your leave dates for approval."}
      </p>

      <form className="simple-form" onSubmit={handleSubmit}>
        <label>
          Start date
          <input
            type="date"
            name="startDate"
            min={new Date().toISOString().split("T")[0]}
            value={form.startDate}
            onChange={handleChange}
            onKeyDown={(event) => event.preventDefault()}
            required
          />
        </label>

        <label>
          End date
          <input
            type="date"
            name="endDate"
            min={new Date().toISOString().split("T")[0]}
            value={form.endDate}
            onChange={handleChange}
            onKeyDown={(event) => event.preventDefault()}
            required
          />
        </label>

        <label>
          Reason
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            maxLength={500}
            rows={4}
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {isEditMode ? "Save Changes" : "Submit Request"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/leaves")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSelectedShift, clearSelectedShift } from "../store/shiftsSlice";
import { getShiftById } from "../services/shiftService";
import {toast} from 'react-toastify';
export default function ShiftDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const shift = useAppSelector((state) => state.shifts.selectedShift);

  useEffect(() => {
    async function loadShift() {
      if (!id) return;

      try {
        const data = await getShiftById(id);
        dispatch(setSelectedShift(data));
      } catch (err: any) {
        dispatch(clearSelectedShift());
        toast.error(
          err.response?.data?.message || "Failed to load shift details.",
        );
        navigate(-1);
      }
    }
    loadShift();
    return () => {
      dispatch(clearSelectedShift())};
  }, [id, dispatch, navigate]);

  if (!shift || shift.id !== id) {
    return <p>Loading shift details...</p>;
  }

  return (
    <section className="page-container">
      <button className="secondary-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="page-header">
        <div>
          <h1>{shift.title}</h1>
          <p className="muted">{shift.department}</p>
        </div>

        <span className={`status-badge status-${shift.status.toLowerCase()}`}>
          {shift.status}
        </span>
      </div>

      <div className="details-card">
        <div className="detail-item">
          <span>Department</span>
          <strong>{shift.department}</strong>
        </div>

        <div className="detail-item">
          <span>Date</span>
          <strong>{new Date(shift.date).toLocaleDateString()}</strong>
        </div>

        <div className="detail-item">
          <span>Start time</span>
          <strong>{shift.startTime}</strong>
        </div>

        <div className="detail-item">
          <span>End time</span>
          <strong>{shift.endTime}</strong>
        </div>

        <div className="detail-item">
          <span>Assigned employee</span>
          <strong>{shift.employeeId || "Not assigned"}</strong>
        </div>

        <div className="detail-item">
          <span>Status</span>
          <strong>{shift.status}</strong>
        </div>

        <div className="detail-item detail-description">
          <span>Description</span>
          <p>{shift.description || "No description provided."}</p>
        </div>
      </div>
    </section>
  );
}

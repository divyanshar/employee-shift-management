import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ShiftTable from "../components/ShiftTable";
import {
  getMyShifts,
  completeShift,
} from "../services/shiftService";
import type { Shift } from "../types/shift";

export default function MyShifts() {
  const navigate = useNavigate();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadShifts() {
    try {
      setError("");
      const data = await getMyShifts();
      setShifts(data);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Failed to load your shifts.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShifts();
  }, []);

  async function handleComplete(shift: Shift) {
    const toastId = toast.info(
      <div>
        <p>
          Are you sure you want to complete this shift?
        </p>

        <button
          onClick={async () => {
            toast.dismiss(toastId);

            try {
              await completeShift(shift.id);
              toast.success(
                "Shift completed successfully."
              );

              await loadShifts();
            } catch (err: any) {
              toast.error(
                err.response?.data?.message ||
                  "Failed to complete the shift."
              );
            }
          }}
          style={{ marginRight: "8px" }}
        >
          Confirm
        </button>

        <button onClick={() => toast.dismiss(toastId)}>
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

  if (loading) {
    return <p>Loading your shifts...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={loadShifts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>My Shifts</h1>

      <ShiftTable
        shifts={shifts}
        employeeView={true}
        onView={(shift) =>
          navigate(`/shifts/${shift.id}`)
        }
        onComplete={handleComplete}
      />
    </div>
  );
}

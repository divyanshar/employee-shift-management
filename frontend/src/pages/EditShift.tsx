import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShiftForm from "../components/ShiftForm";
import { getShiftById, updateShift } from "../services/shiftService";
import type { ShiftInput } from "../types/shift";

function toDateInput(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function EditShift() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shift, setShift] = useState<ShiftInput | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShift() {
      try {
        if (!id) return;

        const data = await getShiftById(id);

        setShift({
          title: data.title,
          department: data.department,
          date: toDateInput(data.date),
          startTime: data.startTime,
          endTime: data.endTime,
          description: data.description || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load shift.");
      }
    }

    loadShift();
  }, [id]);

  async function handleUpdate(data: ShiftInput) {
    if (!id) return;

    await updateShift(id, data);
    navigate("/shifts");
  }

  if (error) return <p className="error">{error}</p>;
  if (!shift) return <p>Loading shift...</p>;

  return (
    <section className="page-content">
      <h1>Edit Shift</h1>
      <ShiftForm
        initialValues={shift}
        submitLabel="Save Changes"
        onSubmit={handleUpdate}
      />
      <button type="button" onClick={() => navigate("/shifts")}>
        Cancel
      </button>
    </section>
  );
}

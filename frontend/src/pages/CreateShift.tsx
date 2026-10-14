import { useNavigate } from "react-router-dom";
import ShiftForm from "../components/ShiftForm";
import { createShift } from "../services/shiftService";
import type { ShiftInput } from "../types/shift";

export default function CreateShift() {
  const navigate = useNavigate();

  async function handleCreate(data: ShiftInput) {
    await createShift(data);
    navigate("/shifts");
  }

  return (
    <section className="page-content">
      <h1>Create Shift</h1>
      <ShiftForm submitLabel="Create Shift" onSubmit={handleCreate} />
      <button type="button" onClick={() => navigate("/shifts")}>
        Back to Shifts
      </button>
    </section>
  );
}
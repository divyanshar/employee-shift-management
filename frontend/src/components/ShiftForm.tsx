import { useEffect, useState, type FormEvent } from "react";
import type { ShiftInput } from "../types/shift";

interface Props {
  initialValues?: ShiftInput;
  submitLabel: string;
  onSubmit: (data: ShiftInput) => Promise<void>;
}

const emptyForm: ShiftInput = {
  title: "",
  department: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
};

export default function ShiftForm({
  initialValues = emptyForm,
  submitLabel,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<ShiftInput>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      await onSubmit(form);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Failed to save shift.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="shift-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Department
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Date
        <input
          type="date"
          name="date"
          value={form.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          onKeyDown={(event) => event.preventDefault()
            }
          required
        />
      </label>

      <label>
        Start Time
        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        End Time
        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
        />
      </label>

      <label className="full-width">
        Description
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          rows={3}
        />
      </label>

      <div className="form-actions full-width">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

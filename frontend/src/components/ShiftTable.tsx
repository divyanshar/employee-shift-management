import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Shift } from "../types/shift";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
interface Props {
  shifts: Shift[];
  onEdit?: (shift: Shift) => void;
  onAssign?: (shift: Shift) => void;
  onComplete?: (shift: Shift) => void;
  onCancel?: (shift: Shift) => void;
  onDelete?: (shift: Shift) => void;
  isAdmin?: boolean;
  employeeView?: boolean;
  onView?: (shift: Shift) => void;
}

export default function ShiftTable({
  shifts,
  onEdit,
  onAssign,
  onComplete,
  onCancel,
  onDelete,
  onView,
  isAdmin = false,
  employeeView = false,
}: Props) {
  const navigate = useNavigate();
  const employees = useAppSelector((state) => state.employees.items);
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      minWidth: 140,
      flex: 1,
    },
    {
      field: "department",
      headerName: "Department",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "",
    },
    {
      field: "startTime",
      headerName: "Start",
      width: 90,
    },
    {
      field: "endTime",
      headerName: "End",
      width: 90,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
...(!employeeView
  ? [
      {
        field: "employeeId",
        headerName: "Employee Name",
        minWidth: 160,
        flex: 1,
        valueGetter: (_value: unknown, row: Shift) => {
          if (!row.employeeId) {
            return "Unassigned";
          }

          const employee = employees.find(
            (item) => item.id === row.employeeId
          );

          return employee?.name ?? row.employeeId;
        },
      } as GridColDef,
    ]
  : []),

    // Actions column is visible to both employees and Admin/Manager
    {
      field: "actions",
      headerName: "Actions",
      width: employeeView ? 160 : 390,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const shift = params.row as Shift;

        return (
          <div className="table-actions">
            {/* View is available to everyone */}
            <button
              type="button"
              className="icon-button"
              title="View shift details"
              aria-label={`View ${shift.title}`}
              onClick={() =>
                onView ? onView(shift) : navigate(`/shifts/${shift.id}`)
              }
            >
              👁️
            </button>

            {/* Employee actions */}
            {employeeView && shift.status === "PUBLISHED" && (
              <button
                type="button"
                className="primary-button"
                onClick={() => onComplete?.(shift)}
              >
                Complete
              </button>
            )}

            {/* Admin/Manager actions */}
            {!employeeView && (
              <>
                {isAdmin &&
                  (shift.status === "DRAFT" ||
                    shift.status === "CANCELLED") && (
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDelete?.(shift)}
                    >
                      Delete
                    </button>
                  )}

                {shift.status === "DRAFT" && (
                  <>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => onEdit?.(shift)}
                    >
                      Edit
                    </button>

                    {!shift.employeeId && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => onAssign?.(shift)}
                      >
                        Assign
                      </button>
                    )}

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onCancel?.(shift)}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {shift.status === "PUBLISHED" && (
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => onCancel?.(shift)}
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="data-grid-container">
      <DataGrid
        rows={shifts}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <div className="grid-empty">No shifts found.</div>
          ),
        }}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { getEmployees,deleteEmployee } from "../services/userService";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setEmployees } from "../store/employeesSlice";
import { toast } from "react-toastify";

function Dashboard() {
  const dispatch = useAppDispatch();

  const employees = useAppSelector(
    (state) => state.employees.items
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch only when Redux has no employee data
    if (employees.length > 0) return;

    async function fetchEmployees() {
      try {
        setLoading(true);
        setError("");

        const data = await getEmployees();
        dispatch(setEmployees(data));
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch employees. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, [dispatch, employees.length]);
  
  const handleDelete=async(id:string)=>{
    try {
      await deleteEmployee(id);
      toast.success("Employee deleted successfully");
      dispatch(setEmployees(employees.filter((emp)=>emp.id!==id)));
    } catch (err:any) {
      setError(err.response?.data?.meesage || "failed to delete employee.")
      
    }
  }

  return (
    <section className="page-content">
      <h1>Employees</h1>
      <p>View all registered employees.</p>

      {loading && <p>Loading employees...</p>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && employees.length === 0 && (
        <p>No employees found.</p>
      )}

      {!loading && !error && employees.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.role}</td>
                  <td><button onClick={()=>handleDelete(employee.id)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
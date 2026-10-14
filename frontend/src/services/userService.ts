import axiosInterceptor from "./axiosInterceptor";

export const getEmployees = async () => {
  const response = await axiosInterceptor.get("/users/employees");
  return response.data;
};
export async function deleteEmployee(id: string) {
  await axiosInterceptor.delete(`/users/employees/${id}`);
  return "Employee deleted successfully";
}
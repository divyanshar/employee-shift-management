import axiosInterceptor from "./axiosInterceptor";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await axiosInterceptor.post("/auth/login", data);
  console.log(response.data);
  return response.data;
};

export const signup = async (data: SignupData) => {
  const response = await axiosInterceptor.post("/auth/signup", data);
  return response.data;
};

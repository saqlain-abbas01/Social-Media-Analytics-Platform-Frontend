import type { RegisterFormData } from "@/pages/register";
import api from "./api";
import type { AuthUser } from "@/types/user";

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
export const registerUser = async (
  data: RegisterFormData
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

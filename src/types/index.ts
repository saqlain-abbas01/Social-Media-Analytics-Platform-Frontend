import { AxiosError } from "axios";

// ✅ Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>; // e.g., validation errors
}

export type ApiError = AxiosError<ApiErrorResponse>;

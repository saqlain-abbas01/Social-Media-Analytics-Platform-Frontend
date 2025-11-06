// types/user.ts
export type UserRole = "admin" | "user";

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

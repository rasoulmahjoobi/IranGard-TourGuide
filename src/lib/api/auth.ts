import { apiClient } from "@/src/lib/apiClient";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignupPayload {
  name: string;
  phone: string;
  password: string;
}

export async function loginRequest(username: string, password: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>("/auth/login", { username, password });
  return data;
}

export async function signupRequest(payload: SignupPayload): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>("/auth/signup", payload);
  return data;
}

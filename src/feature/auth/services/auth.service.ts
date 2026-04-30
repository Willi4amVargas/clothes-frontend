import type { LoginInput } from "../schemas/login.schema";
import { apiClient } from "@/shared/lib/api";

export type LoginResponse = {
  token: string;
};

export class AuthService {
  public async login(credentials: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/signin",
      credentials,
      {
        dryRun: false,
        withAuth: false,
      },
    );

    return response;
  }
}

export const authService = new AuthService();

import {
  createContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { tokenStorage } from "@/shared/lib/token";
import type { LoginInput } from "../schemas/login.schema";
import { toast } from "react-toastify";
import { apiClient } from "@/shared/lib/api";
import type {
  RecoveryUser,
  RecoveryUserPassword,
} from "../schemas/recovery.schema";

export type LoginResponse = {
  token: string;
};

type AuthContextValue = {
  //   user: AuthUser | null
  isAuthenticated: boolean;
  login: (payload: LoginInput) => void;
  logout: () => void;
  sendRecoveryMail: (payload: RecoveryUser) => void;
  changePassword: (payload: RecoveryUserPassword) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = async (credentials: LoginInput) => {
    try {
      const token = await apiClient.post<LoginResponse>(
        "/signin",
        credentials,
        {
          dryRun: false,
          withAuth: false,
        },
      );
      if (token) {
        tokenStorage.setToken(token.token);
        setIsAuthenticated(true);
      } else {
        throw new Error("Error al obtener el token");
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error("Inicio de sesión incorrecto");
    }
  };

  const logout = () => {
    tokenStorage.clearToken();
    setIsAuthenticated(false);
  };

  const sendRecoveryMail = async (payload: RecoveryUser) => {
    try {
      const mailDelivered = await apiClient.post<{ message: string }>(
        "/recovery_password",
        payload,
        {
          dryRun: false,
          withAuth: false,
        },
      );
      return mailDelivered;
    } catch (error: any) {
      console.error(error.message);
      toast.error("Inicio de sesión incorrecto");
    }
  };

  const changePassword = async (payload: RecoveryUserPassword) => {
    const passwordChange = await apiClient.put("/recovery_password", payload, {
      dryRun: false,
      withAuth: false,
    });
    return passwordChange;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login,
      logout,
      sendRecoveryMail,
      changePassword,
    }),
    [logout, login, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

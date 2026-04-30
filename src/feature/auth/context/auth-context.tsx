import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { authService } from "../services/auth.service";
import { tokenStorage } from "@/shared/lib/token";
import type { LoginInput } from "../schemas/login.schema";
import { toast } from "react-toastify";

type AuthContextValue = {
  //   user: AuthUser | null
  isAuthenticated: boolean;
  login: (payload: LoginInput) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = useCallback(async (credentials: LoginInput) => {
    try {
      const token = await authService.login(credentials);
      if (token) {
        tokenStorage.setToken(token.token);
        setIsAuthenticated(true);
      } else {
        throw new Error("Error al obtener el token");
      }
    } catch (error: any) {
      toast.error("Inicio de sesión incorrecto");
    }
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearToken();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [logout, login, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

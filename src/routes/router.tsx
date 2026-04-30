import { LoginPage } from "@/feature/auth/pages/LoginPage";
import { DashboardPage } from "@/feature/dashboard/pages/DashboardPage";
import { createBrowserRouter } from "react-router";
import { loginLoader, protectedLoader } from "./protected-loader";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    loader: protectedLoader,
    element: <DashboardPage />,
  },
  {
    path: "/login",
    loader: loginLoader,
    element: <LoginPage />,
  },
]);

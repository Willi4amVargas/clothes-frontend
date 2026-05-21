import { LoginPage } from "@/feature/auth/pages/LoginPage";
import { DashboardPage } from "@/feature/dashboard/pages/DashboardPage";
import { createBrowserRouter } from "react-router";
import { loginLoader, protectedLoader } from "./protected-loader";
import { MainLayout } from "@/layouts/MainLayout";
import { TestComponent } from "@/components/TestComponent";
import { InventoryPage } from "@/feature/inventory/pages/InventoryPage";
import { CreateNewProductPage } from "@/feature/inventory/pages/CreateNewProductPage";
import { ClientsPage } from "@/feature/clients/pages/ClientsPage";
import { CreateClientPage } from "@/feature/clients/pages/CreateClientPage";
import { PosTerminalPage } from "@/feature/sales/pages/PosTerminalPage";

import { UserProfilePage } from "@/feature/user-profile/pages/UserProfilePage";
import { UpdateProductPage } from "@/feature/inventory/pages/UpdateProductPage";
import { RecoveryPasswordPage } from "@/feature/auth/pages/RecoveryPasswordPage";

export const appRouter = createBrowserRouter([
  {
    loader: protectedLoader,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "profile",
        element: <UserProfilePage />,
      },
      {
        path: "inventory",
        children: [
          {
            index: true,
            element: <InventoryPage />,
          },
          {
            path: "update",
            children: [
              {
                path: ":id",
                element: <UpdateProductPage />,
              },
            ],
          },
          {
            path: "new",
            element: <CreateNewProductPage />,
          },
        ],
      },
      {
        path: "clients",
        element: <ClientsPage />,
      },
      {
        path: "clients/new",
        element: <CreateClientPage />,
      },
      {
        path: "sales",
        element: <PosTerminalPage />,
      },
      // {
      //   path: "reports",
      //   element: <TestComponent label="Reports" />,
      // },
      {
        path: "settings",
        element: <TestComponent label="Settings" />,
      },
    ],
  },
  {
    path: "/login",
    loader: loginLoader,
    element: <LoginPage />,
  },
  {
    path: "/recovery-password",
    loader: loginLoader,
    element: <RecoveryPasswordPage />,
  },
]);

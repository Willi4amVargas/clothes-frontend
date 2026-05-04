import { LoginPage } from "@/feature/auth/pages/LoginPage";
import { DashboardPage } from "@/feature/dashboard/pages/DashboardPage";
import { createBrowserRouter } from "react-router";
import { loginLoader, protectedLoader } from "./protected-loader";
import { MainLayout } from "@/layouts/MainLayout";
import { TestComponent } from "@/components/TestComponent";
import { ProductsPage } from "@/feature/products/pages/ProductsPage";
import { InventoryPage } from "@/feature/inventory/pages/InventoryPage";
import { CreateNewProductPage } from "@/feature/inventory/pages/CreateNewProductPage";

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
        path: "inventory",
        element: <InventoryPage />,
      },
      {
        path: "inventory/new",
        element: <CreateNewProductPage />,
      },
      {
        path: "clients",
        element: <TestComponent label="Clients" />,
      },
      {
        path: "sales",
        element: <TestComponent label="Sales POS" />,
      },
      {
        path: "reports",
        element: <TestComponent label="Reports" />,
      },
      {
        path: "settings",
        element: <TestComponent label="Settings" />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
    ],
  },
  {
    path: "/login",
    loader: loginLoader,
    element: <LoginPage />,
  },
]);

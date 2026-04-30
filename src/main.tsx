import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./feature/auth/context/auth-context.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer
        position="bottom-right"
        pauseOnHover={false}
        closeOnClick={true}
        hideProgressBar={true}
      />
    </AuthProvider>
  </StrictMode>,
);

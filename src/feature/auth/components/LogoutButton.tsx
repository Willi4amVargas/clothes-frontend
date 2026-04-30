import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";
import { useNavigate } from "react-router";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <Button className="w-auto" onClick={handleLogout}>
      {children}
    </Button>
  );
}

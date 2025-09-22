// routes/RoleRoute.tsx
import { useAuth } from "@/hooks/useAuth/useAuth";
import { Navigate } from "react-router-dom";

type RoleRouteProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { role } = useAuth(); // e.g. "credit-agent", "manager", "director"

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

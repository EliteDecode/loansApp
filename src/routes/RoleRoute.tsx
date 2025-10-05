// routes/RoleRoute.tsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/store";

type RoleRouteProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { role } = useSelector((state: RootState) => state.auth);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

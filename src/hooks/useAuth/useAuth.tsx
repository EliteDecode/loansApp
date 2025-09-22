// useAuth.tsx (custom hook or context)
import { createContext, useContext } from "react";

type Role = "credit-agent" | "manager" | "director";

interface AuthContextType {
  role: Role;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const role: Role = "credit-agent"; // 🔥 Replace with actual user role from API

  return (
    <AuthContext.Provider value={{ role }}>{children}</AuthContext.Provider>
  );
}

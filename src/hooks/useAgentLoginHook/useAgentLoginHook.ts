import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/features/auth/authSlice";
import { getAgentProfile } from "@/services/features";
import { loginValidationSchema } from "../helpers/validationSchemas";
import type { RootState, AppDispatch } from "@/store";

export interface LoginValues {
  email: string;
  password: string;
}

export const useAgentLoginHook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, isError, message } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async (values: LoginValues) => {
    const resultAction = await dispatch(
      login({ ...values, role: "agent" }) as any
    );
    if (login.fulfilled.match(resultAction)) {
      // Fetch agent profile after successful login
      await dispatch(getAgentProfile());
      navigate("/"); // Redirect to dashboard on successful login
    }
  };

  return {
    isLoading,
    isError,
    message,
    handleLogin,
    validationSchema: loginValidationSchema,
  };
};

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/features/auth/authSlice";
import { loginValidationSchema } from "../helpers/validationSchemas";
import type { RootState } from "@/store";

export interface LoginValues {
  email: string;
  password: string;
}

export const useAgentLoginHook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, message } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async (values: LoginValues) => {
    const resultAction = await dispatch(
      login({ ...values, role: "agent" }) as any
    );
    if (login.fulfilled.match(resultAction)) {
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

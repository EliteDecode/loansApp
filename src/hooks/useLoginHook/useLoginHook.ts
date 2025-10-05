import { useState } from "react";
import { loginValidationSchema } from "../helpers/validationSchemas";

// Login form values type
export interface LoginValues {
  email: string;
  password: string;
}

// User role type
export type UserRole = "director" | "manager" | "agent";

// Login hook return type
export interface UseLoginReturn {
  // State
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;

  // Actions
  handleLogin: (values: LoginValues) => Promise<void>;
  resetLoginState: () => void;

  // Validation
  validationSchema: typeof loginValidationSchema;
}

export const useLoginHook = (): UseLoginReturn => {
  // Local state for login status
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");

  // Handle login - this is now just a placeholder since we use role-specific hooks
  const handleLogin = async (_values: LoginValues): Promise<void> => {
    // This is now just a placeholder - use role-specific login pages instead
    console.log(
      "Please use role-specific login pages: /director, /manager, or /agent"
    );
    setIsError(true);
    setMessage("Please use the appropriate role-specific login page");
  };

  // Reset login state
  const resetLoginState = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setMessage("");
  };

  return {
    // State
    isLoading,
    isSuccess,
    isError,
    message,

    // Actions
    handleLogin,
    resetLoginState,

    // Validation
    validationSchema: loginValidationSchema,
  };
};

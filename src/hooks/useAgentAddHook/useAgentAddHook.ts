import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { agentValidationSchemas, generatePassword } from "../helpers";
import {
  createCreditAgent,
  resetAgent,
} from "@/services/features/agent/agentSlice";
import type { AppDispatch, RootState } from "@/store";

// Agent form values type
export interface AgentFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: any;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  lgaOfResidence: string;
  bankName: string;
  bankAccount: string;
  employmentType: string;
  dateOfEmployment: any;
  validNIN: string;
  utilityBill: string;
  passport: string;
  employmentLetter: string;
  password: string;
  confirmPassword: string;
  canApproveLoans: boolean;
  canViewReports: boolean;
}

// Agent add hook return type
export interface UseAgentAddReturn {
  // State
  isSubmitting: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  errorMessage: string;

  // Actions
  handleFinish: (values: AgentFormValues) => Promise<void>;
  handleSuccessModalClose: () => void;
  handleErrorModalClose: () => void;
  generatePassword: () => string;

  // Validation
  validationSchemas: typeof agentValidationSchemas;
}

export const useAgentAddHook = (): UseAgentAddReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Local state for modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get Redux state for agent creation
  const {
    isLoading: isSubmitting,
    isSuccess,
    isError,
    message,
  } = useSelector((state: RootState) => state.agent);

  // Clear agent state when component mounts
  useEffect(() => {
    dispatch(resetAgent());
  }, [dispatch]);

  // Handle success state
  useEffect(() => {
    if (isSuccess && message === "agent created successfully") {
      setShowSuccessModal(true);
    }
  }, [isSuccess, message]);

  // Handle error state
  useEffect(() => {
    if (isError && message) {
      setErrorMessage(message);
      setShowErrorModal(true);
    }
  }, [isError, message]);

  // Handle agent creation
  const handleFinish = async (values: AgentFormValues): Promise<void> => {
    // Convert form values to API format
    const agentData = {
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender as "male" | "female",
      dateOfBirth: values.dateOfBirth.toISOString(),
      email: values.email,
      phoneNumber: values.phoneNumber,
      residentialAddress: values.residentialAddress,
      stateOfResidence: values.stateOfResidence,
      lgaOfResidence: values.lgaOfResidence,
      bankName: values.bankName,
      bankAccount: values.bankAccount,
      employmentType: values.employmentType as
        | "full-time"
        | "part-time"
        | "contract"
        | "self-employed",
      dateOfEmployment: values.dateOfEmployment.toISOString(),
      validNIN: values.validNIN,
      utilityBill: values.utilityBill,
      passport: values.passport,
      employmentLetter: values.employmentLetter,
      password: values.password,
      canApproveLoans: values.canApproveLoans,
      canViewReports: values.canViewReports,
    };

    dispatch(createCreditAgent(agentData));
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    dispatch(resetAgent());
    navigate("/credit-agents");
  };

  // Handle error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    dispatch(resetAgent());
  };

  return {
    // State
    isSubmitting,
    showSuccessModal,
    showErrorModal,
    errorMessage,

    // Actions
    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,
    generatePassword,

    // Validation
    validationSchemas: agentValidationSchemas,
  };
};

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { agentEditValidationSchemas } from "../helpers/validationSchemas";
import {
  updateCreditAgent,
  resetAgent,
} from "@/services/features/agent/agentSlice";
import { getCreditAgentDetails } from "@/services/features/agent/agentService";
import type { AppDispatch, RootState } from "@/store";
import type { CreditAgent } from "@/services/features/agent/agent.types";

// Agent edit form values type
export interface AgentEditFormValues {
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
}

// Agent edit hook return type
export interface UseAgentEditReturn {
  // State
  agent: CreditAgent | null;
  isLoading: boolean;
  isUpdating: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  errorMessage: string;

  // Actions
  handleFinish: (values: AgentEditFormValues) => Promise<void>;
  handleSuccessModalClose: () => void;
  handleErrorModalClose: () => void;

  // Validation
  validationSchemas: typeof agentEditValidationSchemas;
}

export const useAgentEditHook = (): UseAgentEditReturn => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  // Local state for agent editing
  const [agent, setAgent] = useState<CreditAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get Redux state for agent update
  const {
    isLoading: isUpdating,
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
    if (isSuccess && message === "agent updated successfully") {
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

  // Fetch agent details
  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await getCreditAgentDetails(id);
        if (response.success) {
          setAgent(response.data);
        }
      } catch (error) {
        console.error("Error fetching agent details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgentDetails();
  }, [id]);

  // Handle agent update
  const handleFinish = async (values: AgentEditFormValues): Promise<void> => {
    if (!id) return;

    const updateData = {
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth.toISOString(),
      email: values.email,
      phoneNumber: values.phoneNumber,
      residentialAddress: values.residentialAddress,
      stateOfResidence: values.stateOfResidence,
      lgaOfResidence: values.lgaOfResidence,
      bankName: values.bankName,
      bankAccount: values.bankAccount,
      employmentType: values.employmentType,
      dateOfEmployment: values.dateOfEmployment.toISOString(),
      validNIN: values.validNIN,
      utilityBill: values.utilityBill,
      passport: values.passport,
      employmentLetter: values.employmentLetter,
    };

    dispatch(updateCreditAgent({ creditAgentId: id, data: updateData }));
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
    agent,
    isLoading,
    isUpdating,
    showSuccessModal,
    showErrorModal,
    errorMessage,

    // Actions
    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,

    // Validation
    validationSchemas: agentEditValidationSchemas,
  };
};

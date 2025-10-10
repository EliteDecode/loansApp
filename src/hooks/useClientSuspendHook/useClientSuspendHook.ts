import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleClientStatus } from "@/services/features/client/clientSlice";
import type { AppDispatch } from "@/store";

// Client suspend hook return type
export interface UseClientSuspendReturn {
  // State
  isSuspending: boolean;
  showConfirmationModal: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  errorMessage: string;

  // Actions
  handleSuspendClick: () => void;
  handleConfirmSuspend: (
    clientId: string,
    currentStatus: string
  ) => Promise<void>;
  handleConfirmationClose: () => void;
  handleSuccessModalClose: () => void;
  handleErrorModalClose: () => void;
}

export const useClientSuspendHook = (): UseClientSuspendReturn => {
  const dispatch = useDispatch<AppDispatch>();

  // Local state for client suspension
  const [isSuspending, setIsSuspending] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle suspend button click
  const handleSuspendClick = () => {
    setShowConfirmationModal(true);
  };

  // Handle confirm suspend
  const handleConfirmSuspend = async (
    clientId: string,
    currentStatus: string
  ): Promise<void> => {
    setIsSuspending(true);
    setShowConfirmationModal(false);

    try {
      // Determine new status based on current status
      const newStatus = currentStatus === "active" ? "suspended" : "active";

      const response = await dispatch(
        toggleClientStatus({
          clientId,
          status: newStatus,
        })
      );

      if (response.payload?.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(
          response.payload?.message || "Failed to update client status"
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
      setShowErrorModal(true);
    } finally {
      setIsSuspending(false);
    }
  };

  // Handle confirmation modal close
  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Reload the page to fetch updated client details
    window.location.reload();
  };

  // Handle error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return {
    // State
    isSuspending,
    showConfirmationModal,
    showSuccessModal,
    showErrorModal,
    errorMessage,

    // Actions
    handleSuspendClick,
    handleConfirmSuspend,
    handleConfirmationClose,
    handleSuccessModalClose,
    handleErrorModalClose,
  };
};

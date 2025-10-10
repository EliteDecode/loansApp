import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { managerEditValidationSchemas } from "../helpers/validationSchemas";

import type { AppDispatch, RootState } from "@/store";
import type { Manager } from "@/services/features/manager/manager.types";
import {
  getManagerDetails,
  resetDirector,
  updateManager,
} from "@/services/features/director/directorSlice";

// Manager edit form values type
export interface ManagerEditFormValues {
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

// Manager edit hook return type
export interface UseManagerEditReturn {
  // State
  manager: Manager | null;
  isLoading: boolean;
  isUpdating: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  errorMessage: string;

  // Actions
  handleFinish: (values: ManagerEditFormValues) => Promise<void>;
  handleSuccessModalClose: () => void;
  handleErrorModalClose: () => void;

  // Validation
  validationSchemas: typeof managerEditValidationSchemas;
}

export const useManagerEditHook = (): UseManagerEditReturn => {
  console.log("working");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  // Get manager data from Redux store
  const { currentDirector, isFetching, isLoading, isError, message } =
    useSelector((state: RootState) => state.director);

  // Local state for manager editing
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const manager = currentDirector as Manager | null;

  // Fetch manager details using Redux
  useEffect(() => {
    if (id) {
      dispatch(getManagerDetails(id));
    }
  }, [id, dispatch]);

  // Handle error state
  useEffect(() => {
    if (isError && message) {
      setErrorMessage(message);
      setShowErrorModal(true);
    }
  }, [isError, message]);

  // Handle manager update
  const handleFinish = async (values: ManagerEditFormValues): Promise<void> => {
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

    dispatch(updateManager({ managerId: id, data: updateData }));
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    dispatch(resetDirector());
    navigate("/user-management?tab=managers");
  };

  // Handle error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    dispatch(resetDirector());
  };

  return {
    // State
    manager,
    isLoading: isFetching,
    isUpdating: isLoading,
    showSuccessModal,
    showErrorModal,
    errorMessage,

    // Actions
    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,

    // Validation
    validationSchemas: managerEditValidationSchemas,
  };
};

// src/hooks/useDirectorEditHook.ts
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { directorEditValidationSchemas } from "../helpers/validationSchemas";
import type { AppDispatch, RootState } from "@/store";
import type { Director } from "@/services/features/director/director.types";
import { resetDirector, updateDirector } from "@/services/features";
import { getDirectorDetails } from "@/services/features/director/directorService";

// import {
//   getDirectorDetails,
//   updateDirector,
//   resetDirector,
// } from "@/services/features/director/directorService";

// Director edit form values type
export interface DirectorEditFormValues {
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

// Hook return type
export interface UseDirectorEditReturn {
  director: Director | null;
  isLoading: boolean;
  isUpdating: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  errorMessage: string;

  handleFinish: (values: DirectorEditFormValues) => Promise<void>;
  handleSuccessModalClose: () => void;
  handleErrorModalClose: () => void;

  validationSchemas: typeof directorEditValidationSchemas;
}

export const useDirectorEditHook = (): UseDirectorEditReturn => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const [director, setDirector] = useState<Director | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    isLoading: isUpdating,
    isSuccess,
    isError,
    message,
  } = useSelector((state: RootState) => state.director);

  // Reset state
  useEffect(() => {
    dispatch(resetDirector());
  }, [dispatch]);

  // Handle success
  useEffect(() => {
    if (
      isSuccess &&
      message?.toLowerCase().includes("director updated successfully")
    ) {
      setShowSuccessModal(true);
    }
  }, [isSuccess, message]);

  // Handle error
  useEffect(() => {
    if (isError && message) {
      setErrorMessage(message);
      setShowErrorModal(true);
    }
  }, [isError, message]);

  // Fetch director details
  useEffect(() => {
    const fetchDirectorDetails = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await getDirectorDetails(id);
        if (response?.success) {
          setDirector(response.data);
        }
      } catch (error) {
        console.error("Error fetching director details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDirectorDetails();
  }, [id]);

  // Handle director update
  const handleFinish = async (
    values: DirectorEditFormValues
  ): Promise<void> => {
    if (!id) return;

    const updateData = {
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth?.toISOString(),
      email: values.email,
      phoneNumber: values.phoneNumber,
      residentialAddress: values.residentialAddress,
      stateOfResidence: values.stateOfResidence,
      lgaOfResidence: values.lgaOfResidence,
      bankName: values.bankName,
      bankAccount: values.bankAccount,
      employmentType: values.employmentType,
      dateOfEmployment: values.dateOfEmployment?.toISOString(),
      validNIN: values.validNIN,
      utilityBill: values.utilityBill,
      passport: values.passport,
      employmentLetter: values.employmentLetter,
    };

    dispatch(updateDirector({ directorId: id, data: updateData }));
  };

  // Success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    dispatch(resetDirector());
    navigate("/user-management?tab=directors");
  };

  // Error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    dispatch(resetDirector());
  };

  return {
    director,
    isLoading,
    isUpdating,
    showSuccessModal,
    showErrorModal,
    errorMessage,

    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,

    validationSchemas: directorEditValidationSchemas,
  };
};

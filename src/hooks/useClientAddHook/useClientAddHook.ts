import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clientValidationSchemas } from "../helpers/validationSchemas";
import { createClient } from "@/services/features/client/clientSlice";
import type { ClientCreateRequest } from "@/services/features/client/client.types";
import type { AppDispatch } from "@/store";

// Client form values type
export interface ClientFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date | null;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  lgaOfResidence: string;
  employmentType: string;
  occupationOrBusinessType: string;
  monthlyIncome: string | number;
  employer: string;
  workAddress: string;
  yearsInBusiness: string | number;
  guarantorFullName: string;
  guarantorRelationship: string;
  guarantorPhoneNumber: string;
  guarantorAddress: string;
  secondaryGuarantorFullName: string;
  secondaryGuarantorRelationship: string;
  secondaryGuarantorPhoneNumber: string;
  secondaryGuarantorAddress: string;
  validNIN: string;
  utilityBill: string;
  passport: string;
}

// Client add hook return type
export interface UseClientAddReturn {
  // State
  isSubmitting: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  errorMessage: string;

  // Actions
  handleFinish: (values: ClientFormValues) => Promise<void>;
  handleSuccessModalClose: () => void;
  handleErrorModalClose: () => void;

  // Validation
  validationSchemas: typeof clientValidationSchemas;
}

export const useClientAddHook = (): UseClientAddReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Local state for client creation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle client creation
  const handleFinish = async (values: ClientFormValues): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Convert form values to API format
      const clientData: ClientCreateRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender as "male" | "female",
        dateOfBirth: values.dateOfBirth?.toISOString().split("T")[0] || "",
        email: values.email,
        phoneNumber: values.phoneNumber,
        residentialAddress: values.residentialAddress,
        stateOfResidence: values.stateOfResidence,
        lgaOfResidence: values.lgaOfResidence,
        employmentType: values.employmentType as
          | "employed"
          | "self-employed"
          | "business-owner"
          | "unemployed",
        occupationOrBusinessType: values.occupationOrBusinessType,
        monthlyIncome: Number(values.monthlyIncome),
        employer: values.employer || null,
        workAddress: values.workAddress || null,
        yearsInBusiness: Number(values.yearsInBusiness),
        guarantorFullName: values.guarantorFullName,
        guarantorRelationship: values.guarantorRelationship,
        guarantorPhoneNumber: values.guarantorPhoneNumber,
        guarantorAddress: values.guarantorAddress,
        secondaryGuarantorFullName: values.secondaryGuarantorFullName,
        secondaryGuarantorRelationship: values.secondaryGuarantorRelationship,
        secondaryGuarantorPhoneNumber: values.secondaryGuarantorPhoneNumber,
        secondaryGuarantorAddress: values.secondaryGuarantorAddress,
        validNIN: values.validNIN,
        utilityBill: values.utilityBill,
        passport: values.passport,
      };

      const response = await dispatch(createClient(clientData));

      if (response.payload?.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(response.payload?.message || "Failed to create client");
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/clients");
  };

  // Handle error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
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

    // Validation
    validationSchemas: clientValidationSchemas,
  };
};

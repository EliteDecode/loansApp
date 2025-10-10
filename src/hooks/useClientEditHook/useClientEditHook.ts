import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clientValidationSchemas } from "../helpers/validationSchemas";
import {
  updateClient,
  getClientDetails,
} from "@/services/features/client/clientSlice";
import type {
  ClientCreateRequest,
  Client,
} from "@/services/features/client/client.types";
import type { RootState, AppDispatch } from "@/store";

// Client form values type (same as add client)
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

// Client edit hook return type
export interface UseClientEditReturn {
  // State
  isSubmitting: boolean;
  isLoading: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  errorMessage: string;
  clientData: Client | null;

  // Actions
  handleFinish: (values: ClientFormValues) => Promise<void>;
  handleSuccessModalClose: () => void;
  handleErrorModalClose: () => void;

  // Validation
  validationSchemas: typeof clientValidationSchemas;
}

export const useClientEditHook = (): UseClientEditReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  // Get client data from Redux store
  const { currentClient, isFetching, isError, message } = useSelector(
    (state: RootState) => state.client
  );

  // Local state for client editing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clientData = currentClient as Client | null;

  // Fetch client data using Redux
  useEffect(() => {
    if (id) {
      dispatch(getClientDetails(id));
    }
  }, [id, dispatch]);

  // Handle error state
  useEffect(() => {
    if (isError && message) {
      setErrorMessage(message);
      setShowErrorModal(true);
    }
  }, [isError, message]);

  // Handle client update
  const handleFinish = async (values: ClientFormValues): Promise<void> => {
    if (!id) return;

    setIsSubmitting(true);

    try {
      // Convert form values to API format
      const clientUpdateData: ClientCreateRequest = {
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

      const response = await dispatch(
        updateClient({ clientId: id, data: clientUpdateData })
      );

      if (response.payload?.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(response.payload?.message || "Failed to update client");
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
    navigate(`/clients/${id}`);
  };

  // Handle error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return {
    // State
    isSubmitting,
    isLoading: isFetching,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    clientData,

    // Actions
    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,

    // Validation
    validationSchemas: clientValidationSchemas,
  };
};

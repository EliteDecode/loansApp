import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clientValidationSchemas } from "../helpers/validationSchemas";
import {
  updateClient,
  getClientDetails,
} from "@/services/features/client/clientService";
import type {
  ClientCreateRequest,
  Client,
} from "@/services/features/client/client.types";

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
  const { id } = useParams<{ id: string }>();

  // Local state for client editing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientData, setClientData] = useState<Client | null>(null);

  // Fetch client data on mount
  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getClientDetails(id);

        if (response.success) {
          setClientData(response.data);
        } else {
          setErrorMessage(response.message || "Failed to fetch client details");
          setShowErrorModal(true);
        }
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "An error occurred"
        );
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

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

      const response = await updateClient(id, clientUpdateData);

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(response.message || "Failed to update client");
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
    isLoading,
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

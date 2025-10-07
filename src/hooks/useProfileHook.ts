import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  getDirectorProfile,
  getManagerProfile,
  getAgentProfile,
} from "@/services/features";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  directorID?: string;
  managerID?: string;
  creditAgentID?: string;
  gender?: string;
  dateOfBirth?: string;
  residentialAddress?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  bankName?: string;
  bankAccount?: string;
  employmentType?: string;
  dateOfEmployment?: string;
  status?: string;
  validNIN?: string;
  utilityBill?: string;
  passport?: string;
  employmentLetter?: string;
}

export const useProfileHook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { role } = useSelector((state: RootState) => state.auth);
  const { currentDirector, isLoading: directorLoading } = useSelector(
    (state: RootState) => state.director
  );
  const { currentManager, isLoading: managerLoading } = useSelector(
    (state: RootState) => state.manager
  );
  const { currentAgent, isLoading: agentLoading } = useSelector(
    (state: RootState) => state.agent
  );

  // Get current profile data based on role
  const getCurrentProfile = (): ProfileData | null => {
    switch (role) {
      case "director":
        return currentDirector
          ? {
              firstName: currentDirector.firstName,
              lastName: currentDirector.lastName,
              email: currentDirector.email,
              phoneNumber: currentDirector.phoneNumber,
              directorID: currentDirector._id,
              gender: currentDirector.gender,
              dateOfBirth: currentDirector.dateOfBirth,
              residentialAddress: currentDirector.residentialAddress,
              stateOfResidence: currentDirector.stateOfResidence,
              lgaOfResidence: currentDirector.lgaOfResidence,
              bankName: currentDirector.bankName,
              bankAccount: currentDirector.bankAccount,
              employmentType: currentDirector.employmentType,
              dateOfEmployment: currentDirector.dateOfEmployment,
              status: currentDirector.status,
              validNIN: currentDirector.validNIN,
              utilityBill: currentDirector.utilityBill,
              passport: currentDirector.passport,
              employmentLetter: currentDirector.employmentLetter,
            }
          : null;
      case "manager":
        return currentManager
          ? {
              firstName: currentManager.firstName,
              lastName: currentManager.lastName,
              email: currentManager.email,
              phoneNumber: currentManager.phoneNumber,
              managerID: currentManager._id,
              gender: currentManager.gender,
              dateOfBirth: currentManager.dateOfBirth,
              residentialAddress: currentManager.residentialAddress,
              stateOfResidence: currentManager.stateOfResidence,
              lgaOfResidence: currentManager.lgaOfResidence,
              bankName: currentManager.bankName,
              bankAccount: currentManager.bankAccount,
              employmentType: currentManager.employmentType,
              dateOfEmployment: currentManager.dateOfEmployment,
              status: currentManager.status,
              validNIN: currentManager.validNIN,
              utilityBill: currentManager.utilityBill,
              passport: currentManager.passport,
              employmentLetter: currentManager.employmentLetter,
            }
          : null;
      case "creditAgent":
        return currentAgent
          ? {
              firstName: currentAgent.firstName,
              lastName: currentAgent.lastName,
              email: currentAgent.email,
              phoneNumber: currentAgent.phoneNumber,
              creditAgentID: currentAgent._id,
              gender: currentAgent.gender,
              dateOfBirth: currentAgent.dateOfBirth,
              residentialAddress: currentAgent.residentialAddress,
              stateOfResidence: currentAgent.stateOfResidence,
              lgaOfResidence: currentAgent.lgaOfResidence,
              bankName: currentAgent.bankName,
              bankAccount: currentAgent.bankAccount,
              employmentType: currentAgent.employmentType,
              dateOfEmployment: currentAgent.dateOfEmployment,
              status: currentAgent.status,
              validNIN: currentAgent.validNIN,
              utilityBill: currentAgent.utilityBill,
              passport: currentAgent.passport,
              employmentLetter: currentAgent.employmentLetter,
            }
          : null;
      default:
        return null;
    }
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      switch (role) {
        case "director":
          await dispatch(getDirectorProfile());
          break;
        case "manager":
          await dispatch(getManagerProfile());
          break;
        case "creditAgent":
          await dispatch(getAgentProfile());
          break;
        default:
          throw new Error("Invalid role");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Auto-fetch profile on mount if not already loaded
  useEffect(() => {
    const profileData = getCurrentProfile();
    if (!profileData && role) {
      fetchProfile();
    }
  }, [role]);

  // Get loading state
  const isLoading = directorLoading || managerLoading || agentLoading;

  // Get role display name
  const getRoleDisplayName = () => {
    switch (role) {
      case "director":
        return "Director";
      case "manager":
        return "Manager";
      case "creditAgent":
        return "Credit Agent";
      default:
        return "User";
    }
  };

  // Get ID field
  const getIDField = () => {
    const profileData = getCurrentProfile();
    if (!profileData) return "";
    switch (role) {
      case "director":
        return profileData.directorID || "";
      case "manager":
        return profileData.managerID || "";
      case "creditAgent":
        return profileData.creditAgentID || "";
      default:
        return "";
    }
  };

  // Get ID label
  const getIDLabel = () => {
    switch (role) {
      case "director":
        return "Director ID";
      case "manager":
        return "Manager ID";
      case "creditAgent":
        return "Agent ID";
      default:
        return "ID";
    }
  };

  return {
    profileData: getCurrentProfile(),
    isLoading,
    role,
    fetchProfile,
    getRoleDisplayName,
    getIDField,
    getIDLabel,
  };
};

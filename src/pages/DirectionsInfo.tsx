import React, { useEffect, useState } from "react";
import arrowLeft from "@/assets/icons/arrow-left.svg";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "@/components/Button/Button";
import { Tab, Tabs } from "@mui/material";
import CreditAgentOverView from "@/components/ui/CreditAgentOverView";
import CreditAgentsClients from "@/components/ui/CreditAgentsClients";
import CreditAgentsLoans from "@/components/ui/CreditAgentsLoans";
import Modal from "@/components/Modal/Modal";
import { useProfileHook } from "@/hooks";
import {
  getDirectorDetails,
  toggleDirectorStatus,
} from "@/services/features/director/directorSlice";
import type { Director } from "@/services/features/director/director.types";
import editIcon from "@/assets/icons/edit-icon.svg";
import deactivateIcon from "@/assets/icons/info-circle-D.svg";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";
import type { AppDispatch } from "@/store";

// ✅ Main component
export default function DirectionsInfo() {
  const [openDeactivateAgentModal, setOpenDeactivateAgentModal] =
    useState(false);
  const [openActivateAgentModal, setOpenActivateAgentModal] = useState(false);
  const [director, setDirector] = useState<Director | null>(null);
  const [mainDirector, setMainDirector] = useState<Director | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { role, getIDField } = useProfileHook();

  const mainDirectorId = getIDField();

  const tabs = [
    { label: "Overview", id: "overview" },
    { label: "Clients", id: "clients" },
    { label: "Loans", id: "loans" },
    { label: "Finance", id: "finance" },
  ];

  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const initialTabIndex = tabs.findIndex((t) => t.id === tabFromUrl);
  const [value, setValue] = useState(
    initialTabIndex !== -1 ? initialTabIndex : 0
  );

  // ✅ Unified status toggle (Activate / Deactivate)
  const handleToggleStatus = async (action: "activate" | "deactivate") => {
    if (!director?._id) return;
    setIsToggling(true);

    try {
      const res = await dispatch(toggleDirectorStatus(director._id)).unwrap();

      showSuccessToast(
        res?.message ||
          (action === "activate"
            ? "Director activated successfully"
            : "Director deactivated successfully")
      );

      action === "activate"
        ? setOpenActivateAgentModal(false)
        : setOpenDeactivateAgentModal(false);

      const refreshed = await dispatch(
        getDirectorDetails(director._id)
      ).unwrap();
      setDirector(refreshed?.data || null);
    } catch (err: any) {
      showErrorToast(
        err?.message ||
          (action === "activate"
            ? "Failed to activate director. Try again."
            : "Failed to deactivate director. Try again.")
      );
    } finally {
      setIsToggling(false);
    }
  };

  // ✅ Fetch single director details
  useEffect(() => {
    const fetchDirectorDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await dispatch(getDirectorDetails(id)).unwrap();
        setDirector(response?.data || null);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch director details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectorDetails();
  }, [id, dispatch]);

  // ✅ Fetch main director details (if logged-in user is a director)
  useEffect(() => {
    const fetchMainDirector = async () => {
      if (role !== "director" || !mainDirectorId) return;
      try {
        const response = await dispatch(
          getDirectorDetails(mainDirectorId)
        ).unwrap();
        setMainDirector(response?.data || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMainDirector();
  }, [mainDirectorId, role, dispatch]);

  // ✅ Sync tab with URL
  useEffect(() => {
    if (tabFromUrl) {
      const index = tabs.findIndex((t) => t.id === tabFromUrl);
      if (index !== -1) setValue(index);
    }
  }, [tabFromUrl]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`?tab=${tabs[newValue].id}`, { replace: true });
  };

  // 🌀 Loading
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );

  // 🚨 Error
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    );

  // ❌ Not found
  if (!director)
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Director not found</p>
        <Button onClick={() => navigate("/user-management/directors")}>
          Back to Directors
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="p-6 bg-white space-y-4 rounded-xl">
        <div
          className="flex items-center gap-2 cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          <img src={arrowLeft} alt="arrowLeft" />
          <p className="text-[14px] text-primary">Back to User Management</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Profile */}
          <div className="flex items-center gap-6">
            <img
              src={director.passport || profileImage}
              alt={`${director.firstName} ${director.lastName}`}
              className="w-20 h-20 object-cover rounded-full"
              onError={(e) => (e.currentTarget.src = profileImage)}
            />

            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-700">
                {director.firstName} {director.lastName}
              </h4>
              <p className="text-sm text-gray-500">
                Director ID: {director.directorID}
              </p>
              <div
                className={`py-1 px-3 text-xs rounded-xl w-fit ${
                  director.status === "active"
                    ? "text-green-600 bg-green-100"
                    : director.status === "inactive"
                    ? "text-yellow-600 bg-yellow-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {director.status.charAt(0).toUpperCase() +
                  director.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Actions */}
          {mainDirector?.isMainDirector && role === "director" && (
            <div className="flex md:flex-row flex-col gap-4 md:ml-auto">
              <Button
                variant="outline"
                icon={<img src={editIcon} alt="edit" />}
                onClick={() => navigate(`/user-management/director/edit/${id}`)}
                width="md:w-[155px] w-full"
                height="h-14"
              >
                Edit Director
              </Button>

              {director.status === "active" ? (
                <Button
                  variant="danger"
                  icon={<img src={deactivateIcon} alt="deactivate" />}
                  onClick={() => setOpenDeactivateAgentModal(true)}
                  width="md:w-[155px] w-full"
                  height="h-14"
                >
                  Deactivate Director
                </Button>
              ) : (
                <Button
                  variant="success"
                  icon={<img src={deactivateIcon} alt="activate" />}
                  onClick={() => setOpenActivateAgentModal(true)}
                  width="md:w-[180px] w-full"
                  height="h-14"
                >
                  Activate Director
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="p-6 bg-white rounded-xl">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: "25px",
            "& .MuiTab-root": {
              textTransform: "none",
              height: 41,
              minWidth: "fit-content",
              px: 2,
            },
            "& .MuiTabs-flexContainer": { gap: "16px" },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={<span className="tab-text">{tab.label}</span>}
              sx={{
                "& .tab-text": { color: "#344054", whiteSpace: "nowrap" },
                "&.Mui-selected .tab-text": { color: "#002D62" },
                "&.Mui-selected": {
                  borderBottom: "1px solid #002D62",
                  bgcolor: "#E6EAEF",
                },
              }}
            />
          ))}
        </Tabs>

        {value === 0 && <CreditAgentOverView agent={director as any} />}
        {value === 1 && <CreditAgentsClients clients={director?.clients} />}
        {value === 2 && (
          <CreditAgentsLoans loanRequests={director?.loanRequests} />
        )}
        {value === 3 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Finance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinanceCard
                title="Current Salary"
                value={director.financeRecord?.currentSalary}
                color="green"
              />
              <FinanceCard
                title="Unpaid Amount"
                value={director.financeRecord?.totalUnpaidAmount}
                color="red"
              />
            </div>
          </div>
        )}
      </div>

      {/* Activate Modal */}
      <Modal
        isOpen={openActivateAgentModal}
        onClose={() => setOpenActivateAgentModal(false)}
        title="Confirm Action"
        maxWidth="max-w-[455px]"
        loading={isToggling}
      >
        <ConfirmAction
          loading={isToggling}
          actionText="activate"
          director={director}
          onCancel={() => setOpenActivateAgentModal(false)}
          onConfirm={() => handleToggleStatus("activate")}
        />
      </Modal>

      {/* Deactivate Modal */}
      <Modal
        isOpen={openDeactivateAgentModal}
        onClose={() => setOpenDeactivateAgentModal(false)}
        title="Confirm Action"
        maxWidth="max-w-[455px]"
        loading={isToggling}
      >
        <ConfirmAction
          loading={isToggling}
          actionText="deactivate"
          director={director}
          onCancel={() => setOpenDeactivateAgentModal(false)}
          onConfirm={() => handleToggleStatus("deactivate")}
        />
      </Modal>
    </div>
  );
}

// ✅ Subcomponents
type ConfirmActionProps = {
  loading: boolean;
  actionText: "activate" | "deactivate";
  director: Director;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmAction({
  loading,
  actionText,
  director,
  onCancel,
  onConfirm,
}: ConfirmActionProps) {
  return (
    <div className="space-y-8 pt-4 border-t border-gray-200">
      <p className="text-[16px] text-gray-700">
        Are you sure you want to {actionText}{" "}
        <span className="font-semibold">
          {director.firstName} {director.lastName}
        </span>
        ?{" "}
        {actionText === "deactivate"
          ? "This will restrict access but not delete data."
          : "This will restore their access."}
      </p>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={actionText === "activate" ? "success" : "danger"}
          onClick={onConfirm}
          loading={loading}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

function FinanceCard({
  title,
  value,
  color,
}: {
  title: string;
  value?: number;
  color: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
      <p className={`text-2xl font-bold text-${color}-600`}>
        ₦{value?.toLocaleString() || "N/A"}
      </p>
    </div>
  );
}

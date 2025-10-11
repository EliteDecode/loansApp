import React, { useEffect, useState } from "react";
import arrowLeft from "@/assets/icons/arrow-left.svg";
import editIcon from "@/assets/icons/edit-icon.svg";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import deactivateIcon from "@/assets/icons/info-circle-D.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button/Button";
import { Tab, Tabs } from "@mui/material";
import CreditAgentOverView from "@/components/ui/CreditAgentOverView";
import CreditAgentsClients from "@/components/ui/CreditAgentsClients";
import CreditAgentsLoans from "@/components/ui/CreditAgentsLoans";
import Modal from "@/components/Modal/Modal";
import type { Manager } from "@/services/features/manager/manager.types";
import { useProfileHook } from "@/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";

import type { AppDispatch } from "@/store";
import { toggleManagerStatus } from "@/services/features";
import { getManagerDetails } from "@/services/features/director/directorService";

export default function ManagersInfo() {
  const [openDeactivateAgentModal, setOpenDeactivateAgentModal] =
    useState(false);
  const [manager, setManager] = useState<Manager | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { role } = useProfileHook();

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

  /** ✅ Toggle manager activation/deactivation */
  const handleToggleStatus = async () => {
    if (!manager?._id) return;
    setIsToggling(true);

    try {
      const res = await dispatch(toggleManagerStatus(manager._id)).unwrap();

      showSuccessToast(
        res?.message ||
          (manager.status === "active"
            ? "Manager deactivated successfully"
            : "Manager activated successfully")
      );

      setOpenDeactivateAgentModal(false);

      // ✅ Refresh manager details after toggle
      const refreshed = await getManagerDetails(manager._id);
      if (refreshed.success) setManager(refreshed.data);
    } catch (err: any) {
      showErrorToast(
        err?.message ||
          err?.response?.data?.message ||
          "Failed to toggle manager status. Try again."
      );
    } finally {
      setIsToggling(false);
    }
  };

  /** ✅ Fetch manager details */
  useEffect(() => {
    const fetchManagerDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getManagerDetails(id);

        if (response.success) {
          setManager(response.data);
        } else {
          setError(response.message || "Failed to fetch manager details");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagerDetails();
  }, [id]);

  /** ✅ Update tab state when URL changes */
  useEffect(() => {
    if (tabFromUrl) {
      const index = tabs.findIndex((t) => t.id === tabFromUrl);
      if (index !== -1) setValue(index);
    }
  }, [tabFromUrl]);

  /** ✅ Handle tab change */
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const newTabId = tabs[newValue].id;
    navigate(`?tab=${newTabId}`, { replace: true });
  };

  // --- UI STATES ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate(-1)}>Back to Managers</Button>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Manager not found</p>
        <Button onClick={() => navigate(-1)}>Back to Managers</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white space-y-4 rounded-xl">
        <div
          className="flex items-center gap-2 cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          <img src={arrowLeft} alt="arrowLeft" />
          <p className="text-[14px] leading-[145%] text-primary">
            back to User Management
          </p>
        </div>

        <div className="flex md:items-center items-start justify-between flex-col md:flex-row gap-4 w-full">
          <div className="flex items-center gap-6 w-full">
            <img
              src={manager.passport || profileImage}
              alt={`${manager.firstName} ${manager.lastName}`}
              className="w-20 h-20 object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.src = profileImage;
              }}
            />

            <div className="space-y-2">
              <h4 className="text-[20px] font-semibold text-gray-700">
                {manager.firstName} {manager.lastName}
              </h4>
              <p className="text-[14px] text-gray-500">
                Manager ID: {manager.managerID}
              </p>
              <div
                className={`py-1 px-3 text-[12px] w-fit rounded-xl ${
                  manager.status === "active"
                    ? "text-[#0F973D] bg-[#0F973D1A]"
                    : manager.status === "inactive"
                    ? "text-[#F3A218] bg-[#F3A2181A]"
                    : "text-[#CB1A14] bg-[#CB1A141A]"
                }`}
              >
                {manager.status.charAt(0).toUpperCase() +
                  manager.status.slice(1)}
              </div>
            </div>
          </div>

          {role === "director" && (
            <div className="flex md:flex-row flex-col gap-4 md:ml-auto">
              <Button
                variant="outline"
                icon={<img src={editIcon} alt="" />}
                onClick={() => navigate(`/user-management/manager/edit/${id}`)}
                width="md:w-[155px] w-full"
                height="h-14"
              >
                Edit Manager
              </Button>

              {manager.status === "active" ? (
                <Button
                  variant="danger"
                  icon={<img src={deactivateIcon} alt="" />}
                  onClick={() => setOpenDeactivateAgentModal(true)}
                  width="md:w-[198px] w-full"
                  height="h-14"
                >
                  Deactivate Manager
                </Button>
              ) : (
                <Button
                  variant="success"
                  icon={<img src={deactivateIcon} alt="" />}
                  onClick={() => setOpenDeactivateAgentModal(true)}
                  width="md:w-[198px] w-full"
                  height="h-14"
                >
                  Activate Manager
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="p-6 bg-white space-y-4 rounded-xl">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: "25px",
            "& .MuiTabs-flexContainer": { gap: "16px" },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              sx={{
                textTransform: "none",
                minWidth: "fit-content",
                "&.Mui-selected": {
                  color: "#002D62",
                  borderBottom: "1px solid #002D62",
                  bgcolor: "#E6EAEF",
                },
              }}
            />
          ))}
        </Tabs>

        {value === 0 && <CreditAgentOverView agent={manager as any} />}
        {value === 1 && <CreditAgentsClients clients={manager?.clients} />}
        {value === 2 && (
          <CreditAgentsLoans loanRequests={manager?.loanRequests} />
        )}
        {value === 3 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Finance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Current Salary
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  ₦
                  {manager.financeRecord?.currentSalary?.toLocaleString() ||
                    "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Unpaid Amount
                </h4>
                <p className="text-2xl font-bold text-red-600">
                  ₦
                  {manager.financeRecord?.totalUnpaidAmount?.toLocaleString() ||
                    "0"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Unpaid Months
                </h4>
                <p className="text-lg">
                  {manager.financeRecord?.unpaidMonths?.length || 0} months
                </p>
                {manager.financeRecord?.unpaidMonths &&
                  manager.financeRecord.unpaidMonths.length > 0 && (
                    <div className="mt-2">
                      {manager.financeRecord.unpaidMonths.map(
                        (month, index) => (
                          <span
                            key={index}
                            className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                          >
                            {month}
                          </span>
                        )
                      )}
                    </div>
                  )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Payment Records
                </h4>
                {manager.financeRecord?.paymentRecords &&
                manager.financeRecord.paymentRecords.length > 0 ? (
                  <div>
                    <p className="text-lg font-semibold">
                      {manager.financeRecord.paymentRecords.length} payments
                    </p>
                    <p className="text-sm text-gray-600">
                      Last updated:{" "}
                      {manager.financeRecord.updatedAt
                        ? new Date(
                            manager.financeRecord.updatedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No payment records</p>
                )}
              </div>
              {/* Salary, unpaid amount, unpaid months, etc */}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={openDeactivateAgentModal}
        onClose={() => setOpenDeactivateAgentModal(false)}
        title="Confirm Action"
        maxWidth="max-w-[455px]"
      >
        <div className="space-y-8 pt-4 border-t border-gray-200">
          <p className="text-[16px] text-gray-700">
            Are you sure you want to{" "}
            {manager.status === "active" ? "deactivate" : "activate"}{" "}
            {manager.firstName} {manager.lastName}? This will{" "}
            {manager.status === "active"
              ? "restrict access but not delete data."
              : "reactivate their access."}
          </p>

          <div className="flex justify-end gap-4 ">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpenDeactivateAgentModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={manager.status === "active" ? "danger" : "success"}
              onClick={handleToggleStatus}
              disabled={isToggling}
            >
              {isToggling
                ? "Processing..."
                : manager.status === "active"
                ? "Deactivate"
                : "Activate"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

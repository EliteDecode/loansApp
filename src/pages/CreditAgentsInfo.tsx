import React, { useEffect, useState } from "react";
import arrowLeft from "@/assets/icons/arrow-left.svg";
import editIcon from "@/assets/icons/edit-icon.svg";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import deactivateIcon from "@/assets/icons/deactivate-icon.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Button/Button";
import { Tab, Tabs } from "@mui/material";
import CreditAgentOverView from "@/components/ui/CreditAgentOverView";
import CreditAgentsClients from "@/components/ui/CreditAgentsClients";
import CreditAgentsLoans from "@/components/ui/CreditAgentsLoans";
import Modal from "@/components/Modal/Modal";
import { getCreditAgentDetails } from "@/services/features/agent/agentSlice";
import type { CreditAgent } from "@/services/features/agent/agent.types";
import { useProfileHook } from "@/hooks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { toggleCreditAgentStatus } from "@/services/features";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";

export default function CreditAgentsInfo() {
  const [openDeactivateAgentModal, setOpenDeactivateAgentModal] =
    useState(false);
  const [agent, setAgent] = useState<CreditAgent | null>(null);
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

  // 🧩 Fetch agent details
  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // ✅ dispatch the thunk and unwrap the payload
        const response = await dispatch(getCreditAgentDetails(id)).unwrap();

        if (response?.success) {
          setAgent(response.data);
        } else {
          setError(response?.message || "Failed to fetch agent details");
        }
      } catch (err: any) {
        setError(err?.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentDetails();
  }, [id, dispatch]);

  // 🔁 Toggle activation/deactivation
  const handleToggleStatus = async () => {
    if (!agent?._id) return;
    setIsToggling(true);

    try {
      // ✅ unwrap so you get actual payload
      const res = await dispatch(toggleCreditAgentStatus(agent._id)).unwrap();

      showSuccessToast(res?.message || "Status updated successfully");
      setOpenDeactivateAgentModal(false);

      // ✅ refetch and unwrap again
      const refreshed = await dispatch(
        getCreditAgentDetails(agent._id)
      ).unwrap();
      if (refreshed?.success) setAgent(refreshed.data);
    } catch (err: any) {
      showErrorToast(
        err?.message ||
          err?.response?.data?.message ||
          "Failed to update agent status. Try again."
      );
    } finally {
      setIsToggling(false);
    }
  };

  // 🧭 Handle tab switching
  useEffect(() => {
    if (tabFromUrl) {
      const index = tabs.findIndex((t) => t.id === tabFromUrl);
      if (index !== -1) setValue(index);
    }
  }, [tabFromUrl]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const newTabId = tabs[newValue].id;
    navigate(`?tab=${newTabId}`, { replace: true });
  };

  // 🕓 Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate("/credit-agents")}>
          Back to Credit Agents
        </Button>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Agent not found</p>
        <Button onClick={() => navigate("/credit-agents")}>
          Back to Credit Agents
        </Button>
      </div>
    );
  }

  const isActive = agent.status === "active";

  return (
    <div className="space-y-6">
      {/* 🔹 Header */}
      <div className="p-6 bg-white space-y-4 rounded-xl">
        <div
          className="flex items-center gap-2 cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          <img src={arrowLeft} alt="arrowLeft" />
          <p className="text-[14px] leading-[145%] text-primary">
            back to Agents
          </p>
        </div>

        <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 w-full">
          <div className="flex items-center gap-6 w-full">
            <img
              src={agent.passport || profileImage}
              alt={`${agent.firstName} ${agent.lastName}`}
              className="w-20 h-20 object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.src = profileImage;
              }}
            />
            <div className="space-y-2">
              <h4 className="text-[20px] font-semibold text-gray-700">
                {agent.firstName} {agent.lastName}
              </h4>
              <p className="text-[14px] text-gray-500">
                Agent ID: {agent.creditAgentID}
              </p>
              <div
                className={`py-1 px-3 text-[12px] rounded-xl w-fit ${
                  isActive
                    ? "text-[#0F973D] bg-[#0F973D1A]"
                    : "text-[#F3A218] bg-[#F3A2181A]"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {(role === "manager" || role === "director") && (
            <div className="flex md:flex-row flex-col gap-4 md:ml-auto">
              <Button
                variant="outline"
                icon={<img src={editIcon} alt="" />}
                onClick={() => navigate(`/credit-agents/edit/${id}`)}
                width="md:w-[155px] w-full"
                height="h-14"
              >
                Edit Agent
              </Button>

              <Button
                variant={isActive ? "danger" : "success"}
                icon={<img src={deactivateIcon} alt="" />}
                onClick={() => setOpenDeactivateAgentModal(true)}
                width="md:w-[198px] w-full"
                height="h-14"
              >
                {isActive ? "Deactivate Agent" : "Activate Agent"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="p-6 bg-white space-y-4 rounded-xl">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: "25px",
            "& .MuiTab-root": { textTransform: "none", height: 41, px: 2 },
            "& .MuiTabs-flexContainer": { gap: "16px" },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={
                <div className="flex items-center gap-2 text-[14px] font-medium">
                  <span className="tab-text">{tab.label}</span>
                </div>
              }
              sx={{
                "& .tab-text": { color: "#344054" },
                "&.Mui-selected .tab-text": { color: "#002D62" },
                "&.Mui-selected": {
                  borderBottom: "1px solid #002D62",
                  bgcolor: "#E6EAEF",
                },
              }}
            />
          ))}
        </Tabs>

        {value === 0 && <CreditAgentOverView agent={agent} />}
        {value === 1 && <CreditAgentsClients clients={agent?.clients} />}
        {value === 2 && (
          <CreditAgentsLoans loanRequests={agent?.loanRequests} />
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
                  {agent.financeRecord?.currentSalary?.toLocaleString() ||
                    "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Unpaid Amount
                </h4>
                <p className="text-2xl font-bold text-red-600">
                  ₦
                  {agent.financeRecord?.totalUnpaidAmount?.toLocaleString() ||
                    "0"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔒 Modal */}
      <Modal
        isOpen={openDeactivateAgentModal}
        onClose={() => {
          if (!isToggling) setOpenDeactivateAgentModal(false);
        }}
        closeOnOutsideClick={!isToggling}
        title="Confirm Action"
        maxWidth="max-w-[455px]"
      >
        <div className="space-y-8 pt-4 border-t border-gray-200">
          <p className="text-[16px] text-gray-700">
            Are you sure you want to{" "}
            <span className="font-semibold">
              {isActive ? "deactivate" : "activate"}
            </span>{" "}
            {agent.firstName} {agent.lastName}? This will{" "}
            {isActive
              ? "restrict their access but not delete data."
              : "restore their access to the system."}
          </p>

          <div className="flex items-center justify-end gap-4 ">
            <Button
              variant="outline"
              type="button"
              disabled={isToggling}
              onClick={() => setOpenDeactivateAgentModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={isActive ? "danger" : "success"}
              onClick={handleToggleStatus}
              disabled={isToggling}
            >
              {isToggling
                ? "Processing..."
                : isActive
                ? "Deactivate"
                : "Activate"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

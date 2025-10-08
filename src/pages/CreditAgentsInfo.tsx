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
import { getCreditAgentDetails } from "@/services/features/agent/agentService";
import type { CreditAgent } from "@/services/features/agent/agent.types";
import { useProfileHook } from "@/hooks";

export default function CreditAgentsInfo() {
  const [openDeactivateAgentModal, setOpenDeactivateAgentModal] =
    useState(false);
  const [agent, setAgent] = useState<CreditAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { role } = useProfileHook();

  const tabs = [
    { label: "Overview", id: "overview" },
    { label: "Clients", id: "clients" },
    { label: "Loans", id: "loans" },
    { label: "Finance", id: "finance" },
  ];

  // get tab from URL (default to first tab)
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");

  const initialTabIndex = tabs.findIndex((t) => t.id === tabFromUrl);
  const [value, setValue] = useState(
    initialTabIndex !== -1 ? initialTabIndex : 0
  );

  // Fetch agent details
  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getCreditAgentDetails(id);

        if (response.success) {
          setAgent(response.data);
        } else {
          setError(response.message || "Failed to fetch agent details");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentDetails();
  }, [id]);

  // update tab state when URL changes (back/forward nav)
  useEffect(() => {
    if (tabFromUrl) {
      const index = tabs.findIndex((t) => t.id === tabFromUrl);
      if (index !== -1) setValue(index);
    }
  }, [tabFromUrl]);

  // handle tab change
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const newTabId = tabs[newValue].id;
    navigate(`?tab=${newTabId}`, { replace: true }); // ✅ updates URL without reload
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
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

  // No agent data
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

  return (
    <div className="space-y-6">
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

        <div className="flex md:items-center items-start justify-between flex-col md:flex-row gap-4 w-full">
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
              <h4 className="text-[20px] leading-[120%] tracking-[-2%] text-gray-700 font-semibold">
                {agent.firstName} {agent.lastName}
              </h4>
              <p className="text-[14px] leading-[145%] text-gray-500">
                Agent ID: {agent.creditAgentID}
              </p>
              <div
                className={`py-1 px-3 text-[12px] leading-[145%] w-fit rounded-xl ${
                  agent.status === "active"
                    ? "text-[#0F973D] bg-[#0F973D1A]"
                    : agent.status === "inactive"
                    ? "text-[#F3A218] bg-[#F3A2181A]"
                    : "text-[#CB1A14] bg-[#CB1A141A]"
                }`}
              >
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </div>
            </div>
          </div>

          {(role === "manager" || role === "director") && (
            <div className="flex md:flex-row flex-col gap-4 md:ml-auto">
              <Button
                variant="outline"
                icon={<img src={editIcon} alt="" />}
                onClick={() => navigate(`/credit-agents/edit/${id}`)}
                width="md:w-[145px] w-full"
                height="h-14"
              >
                Edit Agent
              </Button>
              <Button
                variant="danger"
                icon={<img src={deactivateIcon} alt="" />}
                onClick={() => setOpenDeactivateAgentModal(true)}
                width="md:w-[198px] w-full"
                height="h-14"
              >
                Deactivate Agent
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white space-y-4 rounded-xl">
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
              paddingY: 0,
              "@media (min-width:600px)": {
                height: 52,
              },
            },
            "& .MuiTabs-flexContainer": { gap: "16px" },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={
                <div className="flex items-center gap-2 text-[14px] leading-[145%] font-medium">
                  <span className="tab-text">{tab.label}</span>
                </div>
              }
              sx={{
                textTransform: "none",
                minWidth: "fit-content",
                px: 2,
                py: 0,
                "& .tab-text": {
                  color: "#344054",
                  whiteSpace: "nowrap",
                },
                "&.Mui-selected .tab-text": {
                  color: "#002D62",
                },
                "&.Mui-selected": {
                  color: "#002D62",
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Unpaid Months
                </h4>
                <p className="text-lg">
                  {agent.financeRecord?.unpaidMonths?.length || 0} months
                </p>
                {agent.financeRecord?.unpaidMonths?.length > 0 && (
                  <div className="mt-2">
                    {agent.financeRecord.unpaidMonths.map((month, index) => (
                      <span
                        key={index}
                        className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Payment Records
                </h4>
                {agent.financeRecord?.paymentRecords?.length > 0 ? (
                  <div>
                    <p className="text-lg font-semibold">
                      {agent.financeRecord.paymentRecords.length} payments
                    </p>
                    <p className="text-sm text-gray-600">
                      Last updated:{" "}
                      {new Date(
                        agent.financeRecord.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No payment records</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={openDeactivateAgentModal}
        onClose={() => setOpenDeactivateAgentModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Confirm Action"
        maxWidth="max-w-[455px]"
      >
        <div className="space-y-8 pt-4 border-t border-gray-200">
          <p className="text-[16px] leading-[145%] text-gray-700">
            Are you sure you want to deactivate {agent.firstName}{" "}
            {agent.lastName}? This will restrict access but not delete data.
          </p>

          <div className="flex items-center justify-end gap-4 ">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpenDeactivateAgentModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger">Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

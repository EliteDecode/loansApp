import React, { useEffect, useState } from "react";
import arrowLeft from "@/assets/icons/arrow-left.svg";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/Button/Button";
import { Tab, Tabs } from "@mui/material";
import CreditAgentOverView from "@/components/ui/CreditAgentOverView";
import CreditAgentsClients from "@/components/ui/CreditAgentsClients";
import CreditAgentsLoans from "@/components/ui/CreditAgentsLoans";
import Modal from "@/components/Modal/Modal";
import { useProfileHook } from "@/hooks";
import { getDirectorDetails } from "@/services/features/director/directorSlice";
import type { Director } from "@/services/features/director/director.types";
import type { RootState, AppDispatch } from "@/store";

export default function DirectionsInfo() {
  const [openDeactivateAgentModal, setOpenDeactivateAgentModal] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const {} = useProfileHook();

  // Get director data from Redux store
  const { currentDirector, isFetching, isError, message } = useSelector(
    (state: RootState) => state.director
  );

  const director = currentDirector as Director | null;
  const error = isError ? message : null;

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

  // Fetch director details using Redux
  useEffect(() => {
    if (id) {
      dispatch(getDirectorDetails(id));
    }
  }, [id, dispatch]);

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
  if (isFetching) {
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
        <Button onClick={() => navigate(-1)}>Back to Directors</Button>
      </div>
    );
  }

  // No director data
  if (!director) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Director not found</p>
        <Button onClick={() => navigate("/credit-agents")}>
          Back to Directors
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
            back to User Management
          </p>
        </div>

        <div className="flex md:items-center items-start justify-between flex-col md:flex-row gap-4 w-full">
          <div className="flex items-center gap-6 w-full">
            <img
              src={director.passport || profileImage}
              alt={`${director.firstName} ${director.lastName}`}
              className="w-20 h-20 object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.src = profileImage;
              }}
            />

            <div className="space-y-2">
              <h4 className="text-[20px] leading-[120%] tracking-[-2%] text-gray-700 font-semibold">
                {director.firstName} {director.lastName}
              </h4>
              <p className="text-[14px] leading-[145%] text-gray-500">
                Director ID: {director.directorID}
              </p>
              <div
                className={`py-1 px-3 text-[12px] leading-[145%] w-fit rounded-xl ${
                  director.status === "active"
                    ? "text-[#0F973D] bg-[#0F973D1A]"
                    : director.status === "inactive"
                    ? "text-[#F3A218] bg-[#F3A2181A]"
                    : "text-[#CB1A14] bg-[#CB1A141A]"
                }`}
              >
                {director.status.charAt(0).toUpperCase() +
                  director.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Remove later */}
          {/* {(role === "manager" || role === "director") && (
            <div className="flex md:flex-row flex-col gap-4 md:ml-auto">
              <Button
                variant="outline"
                icon={<img src={editIcon} alt="" />}
                onClick={() => navigate(`/credit-agents/edit/${id}`)}
                width="md:w-[155px] w-full"
                height="h-14"
              >
                Edit Director
              </Button>
              <Button
                variant="danger"
                icon={<img src={deactivateIcon} alt="" />}
                onClick={() => setOpenDeactivateAgentModal(true)}
                width="md:w-[198px] w-full"
                height="h-14"
              >
                Deactivate Director
              </Button>
            </div>
          )} */}
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

        {value === 0 && <CreditAgentOverView agent={director as any} />}
        {value === 1 && <CreditAgentsClients clients={director?.clients} />}
        {value === 2 && (
          <CreditAgentsLoans loanRequests={director?.loanRequests} />
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
                  {director.financeRecord?.currentSalary?.toLocaleString() ||
                    "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Unpaid Amount
                </h4>
                <p className="text-2xl font-bold text-red-600">
                  ₦
                  {director.financeRecord?.totalUnpaidAmount?.toLocaleString() ||
                    "0"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Unpaid Months
                </h4>
                <p className="text-lg">
                  {director.financeRecord?.unpaidMonths?.length || 0} months
                </p>
                {director.financeRecord?.unpaidMonths &&
                  director.financeRecord.unpaidMonths.length > 0 && (
                    <div className="mt-2">
                      {director.financeRecord.unpaidMonths.map(
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
                {director.financeRecord?.paymentRecords &&
                director.financeRecord.paymentRecords.length > 0 ? (
                  <div>
                    <p className="text-lg font-semibold">
                      {director.financeRecord.paymentRecords.length} payments
                    </p>
                    <p className="text-sm text-gray-600">
                      Last updated:{" "}
                      {director.financeRecord.updatedAt
                        ? new Date(
                            director.financeRecord.updatedAt
                          ).toLocaleDateString()
                        : "N/A"}
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
            Are you sure you want to deactivate {director.firstName}{" "}
            {director.lastName}? This will restrict access but not delete data.
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

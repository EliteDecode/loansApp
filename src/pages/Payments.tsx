import PageHeader from "@/components/PageHeader/PageHeader";
import PaymentRecords from "@/components/ui/PaymentRecords";
import PenaltyManagement from "@/components/ui/PenaltyManagement";
import RepaymentTracker from "@/components/ui/RepaymentTracker";
import { Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payments() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Repayment Tracker", id: "repayment-tracker" },
    { label: "Payment Records", id: "payment-records" },
    { label: "Penalty Management", id: "penalty-management" },
  ];

  // get tab from URL (default to first tab)
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");

  const initialTabIndex = tabs.findIndex((t) => t.id === tabFromUrl);
  const [value, setValue] = useState(
    initialTabIndex !== -1 ? initialTabIndex : 0
  );

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

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Manage and track all loan applications"
      />

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

      {value === 0 && <RepaymentTracker />}
      {value === 1 && <PaymentRecords />}
      {value === 2 && <PenaltyManagement />}
    </div>
  );
}

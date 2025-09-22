import PageHeader from "@/components/PageHeader/PageHeader";
import RepaymentsMetricsCard from "@/components/RepaymentsMetricsCard/RepaymentsMetricsCard";
import ClientsRepaymentSchedule from "@/components/ui/ClientsRepaymentSchedule";
import RepaymentCalendar from "@/components/ui/RepaymentCalendar";
import ManualPaymentEntries from "@/components/ui/ManualPaymentEntries";
import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import Reminders from "@/components/ui/Reminders";

export default function Repayments() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    "Repayment Calendar",
    "Client’s Repayment Schedule",
    "Manual Payment Entries",
    "Reminders",
  ];

  return (
    <div>
      <PageHeader
        title="Repayments"
        subtitle="Welcome back! Here's your loan portfolio overview"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RepaymentsMetricsCard name="Total Due Today" amount="₦180,000" />
          <RepaymentsMetricsCard name="Total Overdue" amount="₦45,000" />
          <RepaymentsMetricsCard name="Active Clients" amount="34" />
        </div>

        <div className="bg-white p-6 rounded-[12px] mb-5">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable" // ✅ allow horizontal scrolling
            scrollButtons="auto"
            sx={{
              mb: "25px",
              "& .MuiTab-root": {
                textTransform: "none",
                height: 41,
                minWidth: "fit-content", // ✅ shrink to fit content
                px: 2, // ✅ 16px left/right padding (MUI spacing: 2 = 16px)
                paddingY: 0, // keep height tight

                "@media (min-width:600px)": {
                  height: 52,
                },
              },

              "& .MuiTabs-flexContainer": {
                gap: "16px", // ✅ spacing between each Tab
              },

              "& .MuiTabs-indicator": { display: "none" }, // hide underline if you want bg active
            }}
            className="space-y-10"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <div className="flex items-center gap-2 text-[14px] leading-[145%] font-medium">
                    <span className="tab-text">{tab}</span>
                  </div>
                }
                sx={{
                  textTransform: "none",
                  minWidth: "fit-content", // ✅ don’t force extra width
                  px: 2, // ✅ 16px left/right padding
                  py: 0,

                  "& .tab-text": {
                    color: "#344054", // default
                    whiteSpace: "nowrap", // ✅ prevents breaking text
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

          {value === 0 && <RepaymentCalendar />}
          {value === 1 && <ClientsRepaymentSchedule />}
          {value === 2 && <ManualPaymentEntries />}
          {value === 3 && <Reminders />}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import users from "@/assets/icons/users.svg";
import suitcase from "@/assets/icons/suitcase.svg";
import checkCircle from "@/assets/icons/checkCircle.svg";
import userPlus from "@/assets/icons/userPlus.svg";
import creditCard from "@/assets/icons/creditCard.svg";
import bell from "@/assets/icons/bell.svg";

import MetricsCard from "@/components/MetricsCard/MetricsCard";
import PaymentAlertCard from "@/components/PaymentAlertCard/PaymentAlertCard";
import { Tab, Tabs } from "@mui/material";
import PageHeader from "@/components/PageHeader/PageHeader";

export default function CreditAgentDashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="w-full h-full">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your loan portfolio overview"
      />

      <div className="md:space-y-8 space-y-4">
        <div className="grid   lg:grid-cols-3 md:grid-cols-1 gap-6">
          <MetricsCard
            title="Clients Registered"
            value="247"
            change="+12 this month"
            changeColor="#34C759"
            icon={users}
            iconBg="#C120C91A"
          />
          <MetricsCard
            title="Loans in Progress"
            value="32"
            change="5 pending approval"
            changeColor="#FF8D28"
            icon={suitcase}
            iconBg="#1E90FF1A"
          />
          <MetricsCard
            title="Loans Approved"
            value="189"
            change="+8 this week"
            changeColor="#34C759"
            icon={checkCircle}
            iconBg="#20C9971A"
          />
        </div>

        <div className="w-full md:text-[16px] text-[14px] leading-[145%] font-semibold flex flex-col md:flex-row items-center md:gap-8 gap-4">
          <button className="bg-primary  text-white flex items-center justify-center gap-2 md:h-[56px] h-[40px] w-full rounded-[8px]">
            <img
              src={userPlus}
              alt="userPlus"
              className="w-5 h-5 md:w-6 md:h-6"
            />
            <p>Register New Client</p>
          </button>

          <button className="bg-secondary  text-white flex items-center justify-center gap-2 md:h-[56px] h-[40px]  w-full rounded-[8px]">
            <img
              src={creditCard}
              alt="userPlus"
              className="w-5 h-5 md:w-6 md:h-6"
            />
            <p>Create Loan Request</p>
          </button>
        </div>

        <div className="p-2 md:p-4 md:space-y-4 space-y-2">
          <div className="w-full md:h-[77px] h-[58px] border-b-[0.6px] border-gray-200 flex items-center flex-row gap-2">
            <img src={bell} alt="bell" className="md:w-6 md:h-6" />
            <h1 className="md:text-[24px] text-[18px] md:leading-[120%] leading-[145%] md:tracking-[-2%] font-medium text-gray-700">
              Payment Alerts
            </h1>
          </div>

          <div className="w-full">
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                mb: "20px",

                "& .MuiTab-root": {
                  textTransform: "none",
                  padding: 0, // tighter height (optional)
                  height: 41,
                  width: 120,

                  "@media (min-width:600px)": {
                    height: 52,
                    width: 136,
                  },
                },

                "& .MuiTabs-indicator": { display: "none" }, // hide underline if you want bg active
              }}
              className="space-y-5"
            >
              <Tab
                label={
                  <div className="flex items-center gap-2 text-[14px] leading-[145%] font-medium">
                    <span className="tab-text">Due Today</span>
                    <span className="tab-badge w-[24px] h-[17px] flex items-center justify-center rounded-[12px] text-[12px] leading-[145%] tracking-[-0.5%] font-medium">
                      3
                    </span>
                  </div>
                }
                sx={{
                  textTransform: "none",

                  "& .tab-text": {
                    color: "#344054", // default text color
                  },
                  "& .tab-badge": {
                    backgroundColor: "#F0F2F5", // gray by default
                    color: "#344054",
                  },
                  "&.Mui-selected .tab-text": {
                    color: "#002D62", // active text color
                  },

                  "&.Mui-selected": {
                    color: "#002D62", // active text color
                    backgroundColor: "#E6EAEF",
                    borderBottom: "1px solid #002D62",
                  },

                  "&.Mui-selected .tab-badge": {
                    backgroundColor: "#002D62", // active badge bg
                    color: "#fff", // active badge text
                  },
                }}
              />

              <Tab
                label={
                  <div className="flex items-center gap-2 text-[14px] leading-[145%] font-medium">
                    <span className="tab-text">Overdue</span>
                    <span className="tab-badge w-[24px] h-[17px] flex items-center justify-center rounded-[12px] text-[12px] leading-[145%] tracking-[-0.5%] font-medium">
                      3
                    </span>
                  </div>
                }
                sx={{
                  textTransform: "none",
                  "& .tab-text": {
                    color: "#344054", // default text color
                  },
                  "& .tab-badge": {
                    backgroundColor: "#F0F2F5", // gray by default
                    color: "#344054",
                  },
                  "&.Mui-selected .tab-text": {
                    color: "#CB1A14",
                  },
                  "&.Mui-selected": {
                    color: "#CB1A14",
                    backgroundColor: "#CB1A141A",
                    borderBottom: "1px solid #CB1A14",
                  },
                  "&.Mui-selected .tab-badge": {
                    backgroundColor: "#CB1A14", // active badge bg
                    color: "#fff", // active badge text
                  },
                }}
              />
            </Tabs>

            {value === 0 && (
              <div className="space-y-4">
                <PaymentAlertCard
                  name="Funmi Adebayo"
                  alertType="Due today"
                  alertColor="#F3A218"
                  alertBg="#F3A2181A"
                  amount="45,000"
                  phone="08031234567"
                />

                <PaymentAlertCard
                  name="Funmi Adebayo"
                  alertType="Due today"
                  alertColor="#F3A218"
                  alertBg="#F3A2181A"
                  amount="45,000"
                  phone="08031234567"
                />

                <PaymentAlertCard
                  name="Funmi Adebayo"
                  alertType="Due today"
                  alertColor="#F3A218"
                  alertBg="#F3A2181A"
                  amount="45,000"
                  phone="08031234567"
                />

                <PaymentAlertCard
                  name="Funmi Adebayo"
                  alertType="Due today"
                  alertColor="#F3A218"
                  alertBg="#F3A2181A"
                  amount="45,000"
                  phone="08031234567"
                />
              </div>
            )}
            {value === 1 && (
              <div className="space-y-4">
                <PaymentAlertCard
                  name="John Doe"
                  alertType="Overdue"
                  alertColor="#CB1A14"
                  alertBg="#CB1A141A"
                  amount="80,000"
                  phone="08012345678"
                />

                <PaymentAlertCard
                  name="John Doe"
                  alertType="Overdue"
                  alertColor="#CB1A14"
                  alertBg="#CB1A141A"
                  amount="80,000"
                  phone="08012345678"
                />

                <PaymentAlertCard
                  name="John Doe"
                  alertType="Overdue"
                  alertColor="#CB1A14"
                  alertBg="#CB1A141A"
                  amount="80,000"
                  phone="08012345678"
                />

                <PaymentAlertCard
                  name="John Doe"
                  alertType="Overdue"
                  alertColor="#CB1A14"
                  alertBg="#CB1A141A"
                  amount="80,000"
                  phone="08012345678"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

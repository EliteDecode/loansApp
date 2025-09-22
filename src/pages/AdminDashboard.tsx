import { useState } from "react";
import card from "@/assets/icons/card.svg";
import money from "@/assets/icons/money-coloured.svg";
import userGroup from "@/assets/icons/user-group.svg";
import infoHexagon from "@/assets/icons/info-hexagon.svg";
import check from "@/assets/icons/check.svg";
import add from "@/assets/icons/add.svg";
import bell from "@/assets/icons/bell.svg";

import MetricsCard from "@/components/MetricsCard/MetricsCard";
import PaymentAlertCard from "@/components/PaymentAlertCard/PaymentAlertCard";
import { Tab, Tabs } from "@mui/material";
import PageHeader from "@/components/PageHeader/PageHeader";
import LoanStatusChart from "@/components/ui/LoanStatusChart";
import RepaymentPerformanceChart from "@/components/ui/RepaymentPerformanceChart";
import type { Column } from "@/components/Table/Table.types";
import Table from "@/components/Table/Table";

export default function AdminDashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const columns: Column[] = [
    { header: "AGENTS", accessor: "name" },
    { header: "CLIENTS", accessor: "numberOfPeople" },
    {
      header: "RECOVERY",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-3 py-2 text-[12px] leading-[145%] rounded-[12px] ${
            parseFloat(value) >= 90
              ? "bg-[#0F973D1A] text-[#0F973D]" // Green (Good)
              : parseFloat(value) >= 70
              ? "bg-[#F3A2181A] text-[#F3A218]" // Orange (Warning)
              : "bg-[#CB1A141A] text-[#CB1A14]" // Red (Bad)
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: "John Yinka",
      numberOfPeople: 143,
      status: "98.5%",
    },
    {
      id: 2,
      name: "Mary Johnson",
      numberOfPeople: 87,
      status: "92.3%",
    },
    {
      id: 3,
      name: "Chinedu Okafor",
      numberOfPeople: 210,
      status: "85.7%",
    },
    {
      id: 4,
      name: "Aisha Bello",
      numberOfPeople: 65,
      status: "99.1%",
    },
    {
      id: 5,
      name: "Michael Smith",
      numberOfPeople: 178,
      status: "76.4%",
    },
    {
      id: 6,
      name: "Grace Adeyemi",
      numberOfPeople: 94,
      status: "88.6%",
    },
    {
      id: 7,
      name: "David Brown",
      numberOfPeople: 132,
      status: "91.8%",
    },
    {
      id: 8,
      name: "Ngozi Uche",
      numberOfPeople: 154,
      status: "97.2%",
    },
    {
      id: 9,
      name: "Peter Obi",
      numberOfPeople: 200,
      status: "82.9%",
    },
    {
      id: 10,
      name: "Fatima Sule",
      numberOfPeople: 73,
      status: "95.5%",
    },
  ];

  return (
    <div className="w-full h-full">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your loan portfolio overview"
      />

      <div className="md:space-y-8 space-y-4">
        <div className="grid   lg:grid-cols-3 md:grid-cols-1 gap-6">
          <MetricsCard
            title="Total Active Loans"
            value="1,248"
            change="+12% this month"
            changeColor="#34C759"
            icon={card}
            iconBg="#C120C91A"
          />
          <MetricsCard
            title="Repayments Due Today"
            value="189"
            change="Amount: ₦85.2M"
            changeColor="#34C759"
            icon={money}
            iconBg="#20C9971A"
          />
          <MetricsCard
            title="Pending Approvals"
            value="32"
            change="5 pending approval"
            changeColor="#FF8D28"
            icon={infoHexagon}
            iconBg="#FF8D281A"
          />
        </div>

        <div className="w-full md:text-[16px] text-[14px] leading-[145%] font-semibold flex flex-col md:flex-row items-center md:gap-8 gap-4">
          <button className="bg-primary  text-white flex items-center justify-center gap-2 md:h-[56px] h-[40px] w-full rounded-[8px]">
            <img src={check} alt="check" className="w-5 h-5 md:w-6 md:h-6" />
            <p>Approve Loans</p>
          </button>

          <button className="bg-secondary  text-white flex items-center justify-center gap-2 md:h-[56px] h-[40px]  w-full rounded-[8px]">
            <img src={add} alt="add" className="w-5 h-5 md:w-6 md:h-6" />
            <p>Add New Loan</p>
          </button>
        </div>

        <div className="flex items-center gap-4 lg:flex-row flex-col min-h-[624px] h-full">
          <LoanStatusChart />
          <RepaymentPerformanceChart />
        </div>

        <div className="p-6 bg-white space-y-[22px]">
          <div className="flex items-center gap-4 h-16 border-b border-gray-200 w-full">
            <img src={userGroup} alt="Loan Status" className="h-8 w-8" />
            <h1 className="text-[20px] leading-[120%] tracking-[-2%] font-medium text-gray-600">
              Top Performing Credit Agents
            </h1>
          </div>

          <Table columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

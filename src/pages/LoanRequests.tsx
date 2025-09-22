import Button from "@/components/Button/Button";
import PageHeader from "@/components/PageHeader/PageHeader";

import SearchSelect from "@/components/ui/SearchSelect";
import { Tab, Tabs } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import moneyIcon from "@/assets/icons/money-1.svg";
import TextInput from "@/components/TextInput/TextInput";
import FormSelect from "@/components/FormSelect/FormSelect";
import dropDown from "@/assets/icons/dropDown.svg";
import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/Table.types";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateNewLoan from "@/components/ui/CreateNewLoan";

export default function LoanRequests() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Example: API fetcher (replace with real API call)
  const fetchClients = async (query: string) => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        const all = [
          { id: 1, name: "John Yinka", phone: "08123456789" },
          { id: 2, name: "Jane Smith", phone: "08111112222" },
          { id: 3, name: "David Johnson", phone: "08199998888" },
        ];
        resolve(
          all.filter(
            (c) =>
              c.name.toLowerCase().includes(query.toLowerCase()) ||
              c.phone.includes(query)
          )
        );
      }, 1000); // simulate network delay
    });
  };

  const validationSchema = Yup.object({
    client: Yup.object().nullable().required("Please select a client"), // still an object
    loanAmount: Yup.number()
      .typeError("Loan amount must be a number")
      .positive("Loan amount must be greater than 0")
      .required("Please enter loan amount"),
    loanType: Yup.number()
      .typeError("Please select a valid loan yype")
      .required("Please select loan type"),
  });

  const options = [
    { value: 10, label: "Ten" },
    { value: 20, label: "Twenty" },
    { value: 30, label: "Thirty" },
  ];

  const columns: Column[] = [
    { header: "CLIENT NAME", accessor: "name" },
    { header: "AMOUNT REQUESTED", accessor: "amout" },
    {
      header: "STATUS",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 text-[12px] leading-[145%] rounded-[12px] ${
            {
              Approved: "bg-[#0F973D1A] text-[#0F973D]",
              Pending: "bg-[#F3A2181A] text-[#F3A218]",
              Overdue: "bg-[#CB1A141A] text-[#CB1A14]",
            }[value] || "bg-gray-100 text-gray-600" // fallback for unknown values
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "DATE SUBMITTED", accessor: "date" },
    { header: "MANAGER FEEDBACK", accessor: "feedback" },
    {
      header: "",
      fixed: "right", // ✅ stick this column to the right
      accessor: "id",
      render: (_: any) => (
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/loan-requests/loan-summary`)}
        >
          <EllipsisVertical className="hidden md:block" />

          <p className="block md:hidden text-[14px] leading-[145%] font-semibold text-primary">
            Details
          </p>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: "John Yinka",
      amout: "₦500,000",
      status: "Approved",
      date: "03 Aug 2025",
      feedback: "Approved with standard terms",
    },
    {
      id: 2,
      name: "Jane Smith",
      amout: "₦250,000",
      status: "Pending",
      date: "10 Aug 2025",
      feedback: "Awaiting manager review",
    },
    {
      id: 3,
      name: "Emeka Okafor",
      amout: "₦1,200,000",
      status: "Rejected",
      date: "15 Aug 2025",
      feedback: "Rejected due to insufficient documents",
    },
    {
      id: 4,
      name: "Mary Johnson",
      amout: "₦750,000",
      status: "Approved",
      date: "20 Aug 2025",
      feedback: "Approved with minor conditions",
    },
    {
      id: 5,
      name: "Ibrahim Musa",
      amout: "₦300,000",
      status: "Pending",
      date: "25 Aug 2025",
      feedback: "Pending verification of guarantor",
    },
    {
      id: 6,
      name: "Ngozi Chukwu",
      amout: "₦900,000",
      status: "Approved",
      date: "28 Aug 2025",
      feedback: "Approved after income confirmation",
    },
    {
      id: 7,
      name: "Peter Adams",
      amout: "₦1,500,000",
      status: "Rejected",
      date: "01 Sep 2025",
      feedback: "Rejected due to poor credit score",
    },
    {
      id: 8,
      name: "Amaka Uche",
      amout: "₦650,000",
      status: "Approved",
      date: "05 Sep 2025",
      feedback: "Approved quickly due to high credit rating",
    },
    {
      id: 9,
      name: "David Brown",
      amout: "₦400,000",
      status: "Pending",
      date: "08 Sep 2025",
      feedback: "Awaiting compliance check",
    },
    {
      id: 10,
      name: "Fatima Bello",
      amout: "₦2,000,000",
      status: "Approved",
      date: "12 Sep 2025",
      feedback: "Approved for full requested amount",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Loan Requests"
        subtitle="Welcome back! Here's your loan portfolio overview"
      />

      <div className="p-4 md:p-6 md:space-y-4 space-y-2 bg-white rounded-[12px]">
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
                  Create New Loan
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
                  View Submitted Loans
                </div>
              }
              sx={{
                minWidth: "182px",
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
          </Tabs>

          {value === 0 && <CreateNewLoan />}
          {value === 1 && (
            <div className="space-y-4 pb-4 lg:min-h-[559px] h-full">
              <Table columns={columns} data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

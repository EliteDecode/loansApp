import { Form, Formik } from "formik";
import SelectInput from "../SelectInput/SelectInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Column } from "../Table/Table.types";
import Table from "../Table/Table";
import addPrimary from "@/assets/icons/addPrimary.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";
import leftArrow from "@/assets/icons/leftArrow.svg";

export default function LoanProducts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Hydrate initial values from URL
  const initialValues = {
    status: searchParams.get("status") || "",
    agents: searchParams.get("agents") || "",
    tenure: searchParams.get("tenure") || "",
  };

  // Helper to update URL when filters change
  const updateUrl = (values: typeof initialValues) => {
    const query = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });

    navigate(`/Reports?${query.toString()}`);
  };

  const columns: Column[] = [
    {
      header: "LOAN NAME",
      accessor: "date",
      render: (_: any, row: any) => (
        <div className="text-[16px] leading-[145%] font-medium text-gray-500">
          <h1 className="font-medium">{row.principal}</h1>
          <p className="text-[14px]">{row.principal}</p>
        </div>
      ),
    },
    { header: "INTEREST RATE%", accessor: "date" },
    { header: "TENURE RANGE", accessor: "date" },
    {
      header: "COLLATERAL",
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

    {
      header: "AMOUNT PAID",
      accessor: "date",
      render: () => (
        <div className="text-[14px] leading-[145%] font-semibold flex items-center gap-3">
          <h1 className="text-primary cursor-pointer">Edit</h1>
          <p className="text-gray-500 cursor-pointer">Deactivate</p>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      principal: "₦41,667",
      interest: "₦6,250",
      totalAmount: "₦850,000",
      balance: "₦850,000",
      date: "Dec 20, 2024",
      status: "Active",
    },
    {
      id: 2,
      principal: "₦30,000",
      interest: "₦4,500",
      totalAmount: "₦450,000",
      balance: "₦320,000",
      date: "Nov 12, 2024",
      status: "Pending",
    },
    {
      id: 3,
      principal: "₦55,000",
      interest: "₦8,250",
      totalAmount: "₦660,000",
      balance: "₦100,000",
      date: "Oct 5, 2024",
      status: "Completed",
    },
    {
      id: 4,
      principal: "₦25,000",
      interest: "₦3,750",
      totalAmount: "₦300,000",
      balance: "₦150,000",
      date: "Sep 18, 2024",
      status: "Overdue",
    },
    {
      id: 5,
      principal: "₦70,000",
      interest: "₦10,500",
      totalAmount: "₦980,000",
      balance: "₦980,000",
      date: "Jan 15, 2025",
      status: "Active",
    },
    {
      id: 6,
      principal: "₦60,000",
      interest: "₦9,000",
      totalAmount: "₦720,000",
      balance: "₦500,000",
      date: "Feb 2, 2025",
      status: "Pending",
    },
    {
      id: 7,
      principal: "₦45,000",
      interest: "₦6,750",
      totalAmount: "₦540,000",
      balance: "₦0",
      date: "Aug 1, 2024",
      status: "Completed",
    },
    {
      id: 8,
      principal: "₦80,000",
      interest: "₦12,000",
      totalAmount: "₦960,000",
      balance: "₦960,000",
      date: "Mar 10, 2025",
      status: "Active",
    },
    {
      id: 9,
      principal: "₦35,000",
      interest: "₦5,250",
      totalAmount: "₦420,000",
      balance: "₦200,000",
      date: "Jul 22, 2024",
      status: "Overdue",
    },
    {
      id: 10,
      principal: "₦50,000",
      interest: "₦7,500",
      totalAmount: "₦600,000",
      balance: "₦600,000",
      date: "Apr 9, 2025",
      status: "Active",
    },
  ];

  return (
    <div>
      <div className="space-y-4 bg-white rounded-xl p-6">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={() => {}} // no normal submit
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SelectInput
                  name="status"
                  label="Status"
                  onChange={(e: any) => {
                    setFieldValue("status", e.target.value);
                    updateUrl({ ...values, status: e.target.value });
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="defaulted">Defaulted</option>
                </SelectInput>

                <SelectInput
                  name="tenure"
                  label="Loan Tenure"
                  onChange={(e: any) => {
                    setFieldValue("tenure", e.target.value);
                    updateUrl({ ...values, tenure: e.target.value });
                  }}
                >
                  <option value="">All Tenures</option>
                  <option value="3m">3 Months</option>
                  <option value="6m">6 Months</option>
                  <option value="12m">12 Months</option>
                </SelectInput>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="space-y-6 bg-white rounded-xl p-6">
        <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-700">
          Loan Details
        </h1>

        <Table columns={columns} data={data} />

        <div className="flex items-center justify-between text-[14px] leadng-[145%] text-gray-700 font-semibold">
          <button className="sm:px-4 px-2 py-2 flex items-center gap-2 border border-gray-300 rounded-[8px] cursor-pointer">
            <img src={addPrimary} className="hidden sm:block" />
            <p className="hidden sm:block">Previous</p>
            <img src={leftArrow} className="block sm:hidden" />
          </button>

          <p>Showing 1–20 of 250 clients</p>

          <button className="sm:px-4 px-2 py-2 flex items-center gap-2 border border-gray-300 rounded-[8px] cursor-pointer">
            <p className="hidden sm:block">Next</p>
            <img src={addPrimary} className="hidden sm:block" />
            <img src={rightArrow} className="block sm:hidden" />
          </button>
        </div>
      </div>
    </div>
  );
}

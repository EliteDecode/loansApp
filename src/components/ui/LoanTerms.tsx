import receipt from "@/assets/icons/receipt.svg";
import type { Column } from "../Table/Table.types";
import Table from "../Table/Table";

export default function LoanTerms() {
  const columns: Column[] = [
    { header: "DUE DATES", accessor: "date" },
    {
      header: "PRINCIPAL",
      accessor: "principal",
      render: (value) => <p className="text-green-500">{value}</p>,
    },
    {
      header: "INTEREST ",
      accessor: "interest",
      render: (value) => <p className="text-green-500">{value}</p>,
    },
    {
      header: "TOTAL AMOUNT ",
      accessor: "totalAmount",
      render: (value) => <p className="text-green-500">{value}</p>,
    },
    {
      header: "BALANCE",
      accessor: "balance",
      render: (value) => <p className="text-green-500">{value}</p>,
    },
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
    <div className="space-y-6 ">
      <div className="flex items-start gap-4 flex-col lg:flex-row">
        <div className="space-y-6 border-[0.6px]  border-gray-200 rounded-[12px] w-full">
          <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
            <img src={receipt} alt="receipt-icon" className="w-8 h-8" />
            <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
              Loan Details
            </p>
          </div>

          <div className="space-y-4 pb-4 lg:min-h-fit h-full">
            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Amount Requested:
              </p>
              <p className="text-green-500">₦250,000</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Amount Approved:
              </p>
              <p className="text-green-500">₦250,000</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Tenure:
              </p>
              <p>6 Months</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Interest Rate:
              </p>
              <p>2.5% Monthly</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Total Repayment:
              </p>
              <p>₦287,500</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Monthly Repayment:
              </p>
              <p>₦47,917</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
          <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
            <img src={receipt} alt="receipt-icon" className="w-8 h-8" />
            <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
              Application Details
            </p>
          </div>

          <div className="space-y-4 pb-4 lg:min-h-fit h-full">
            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Application Date:
              </p>
              <p>24th August 2025</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Credit Agent:
              </p>
              <p>Adaeze Promise</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Purpose:
              </p>
              <p>Business Expansion</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Collateral:
              </p>
              <p>Landed Property</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Processing Fee:
              </p>
              <p>₦2,000</p>
            </div>

            <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
              <p className="w-full max-w-[160px] text-wrap font-medium">
                Application Status:
              </p>
              <p>Under Review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-700">
          Repayment Schedule
        </h1>

        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}

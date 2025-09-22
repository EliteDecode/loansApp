import arrowLeft from "@/assets/icons/arrow-left.svg";
import receipt from "@/assets/icons/receipt.svg";
import money from "@/assets/icons/money-1.svg";
import extraMoney from "@/assets/icons/money.svg";
import pdf from "@/assets/icons/pdf.svg";
import verified from "@/assets/icons/verifiedGreen.svg";

import Button from "@/components/Button/Button";
import AgentNotesForm from "@/components/ui/AgentNotesForm";
import Table from "@/components/Table/Table";
import type { Column } from "@/components/Table/Table.types";
import { useNavigate } from "react-router-dom";
import { ROLE } from "@/lib/utils";
import PageHeader from "@/components/PageHeader/PageHeader";

const payments = [
  {
    id: 1,
    amount: 78200,
    currency: "NGN",
    status: "paid_on_time",
    dueDate: "2025-07-25",
    paidDate: "2025-07-25",
  },
  {
    id: 2,
    amount: 78200,
    currency: "NGN",
    status: "late_paid",
    dueDate: "2025-06-25",
    paidDate: "2025-06-28",
  },
  {
    id: 3,
    amount: 78200,
    currency: "NGN",
    status: "unpaid",
    dueDate: "2025-05-25",
    paidDate: null,
  },
];

const columns: Column[] = [
  { header: "LOAN ID", accessor: "loanId" },
  { header: "TYPE", accessor: "type" },
  {
    header: "AMOUNT",
    accessor: "amount",
  },
  { header: "START DATE", accessor: "date" },
  {
    header: "RECOVERY",
    accessor: "status",

    render: (value: string) => (
      <span
        className={`px-2 text-[12px] leading-[145%] rounded-[12px] ${
          {
            Active: "bg-[#0088FF1A] text-[#0088FF]",
            Completed: "bg-[#0F973D1A] text-[#0F973D]",
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
    loanId: "LN01234",
    type: "SME Business",
    amount: "₦850,000",
    date: "Dec 20, 2024",
    status: "Active",
  },
  {
    id: 2,
    loanId: "LN01235",
    type: "Personal Loan",
    amount: "₦250,000",
    date: "Nov 15, 2024",
    status: "Completed",
  },
  {
    id: 3,
    loanId: "LN01236",
    type: "Auto Loan",
    amount: "₦1,200,000",
    date: "Jan 05, 2025",
    status: "Pending",
  },
  {
    id: 4,
    loanId: "LN01237",
    type: "Education Loan",
    amount: "₦600,000",
    date: "Oct 30, 2024",
    status: "Overdue",
  },
  {
    id: 5,
    loanId: "LN01238",
    type: "SME Business",
    amount: "₦2,000,000",
    date: "Feb 18, 2025",
    status: "Active",
  },
  {
    id: 6,
    loanId: "LN01239",
    type: "Home Loan",
    amount: "₦5,500,000",
    date: "Mar 10, 2025",
    status: "Completed",
  },
  {
    id: 7,
    loanId: "LN01240",
    type: "Personal Loan",
    amount: "₦450,000",
    date: "Apr 01, 2025",
    status: "Pending",
  },
  {
    id: 8,
    loanId: "LN01241",
    type: "Auto Loan",
    amount: "₦1,800,000",
    date: "May 12, 2025",
    status: "Active",
  },
  {
    id: 9,
    loanId: "LN01242",
    type: "Education Loan",
    amount: "₦300,000",
    date: "Jun 25, 2025",
    status: "Completed",
  },
  {
    id: 10,
    loanId: "LN01243",
    type: "SME Business",
    amount: "₦750,000",
    date: "Jul 20, 2025",
    status: "Overdue",
  },
];

export default function () {
  const naviagte = useNavigate();

  function getStatusColor(status: string) {
    switch (status) {
      case "paid_on_time":
        return "bg-green-600";
      case "late_paid":
        return "bg-yellow-500";
      case "unpaid":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  }

  return (
    <div className="bg-white p-6 space-y-8">
      <PageHeader
        title="Loans"
        subtitle="Manage and track all loan applications"
      />

      <div
        className="flex items-center gap-2 cursor-pointer w-fit"
        onClick={() => naviagte(-1)}
      >
        <img src={arrowLeft} alt="arrowLeft" />
        <p className="text-[14px] leading-[145%] text-primary">
          back to All Loans
        </p>
      </div>

      <div className="space-y-[25px]">
        <div className="flex lg:items-center justify-between gap-5 lg:flex-row flex-col">
          <div className="space-y-2 md:text-[20px] text-[16px] leading-[120%] tracking-[-2%] text-gray-400 font-medium">
            <div className="flex items-center gap-12 justify-between lg:justify-start">
              <h1 className="md:text-[28px] text-[20px] font-semibold text-gray-700">
                John Yinka
              </h1>
              <div className="px-3 py-1 bg-[#0F973D1A] text-[#0F973D] text-[12px] leading-[145%] w-fit rounded-[12px]">
                Active
              </div>
            </div>

            <p>Client ID: CLT-2024-0156</p>
            <p>Joined: March 2024</p>
          </div>

          <div className="flex lg:flex-row flex-col items-center md:gap-4 gap-2 flex-wrap ">
            <Button
              height="h-[55px]"
              variant="success"
              width="lg:w-[205px] w-full"
            >
              Approve Loan
            </Button>

            {ROLE == "manager" ? (
              <Button
                height="h-[55px]"
                width="lg:w-[205px] w-full"
                variant="danger"
              >
                Approve Loan
              </Button>
            ) : (
              <Button
                height="h-[55px]"
                width="lg:w-[205px] w-full"
                variant="success"
              >
                Add Loan
              </Button>
            )}

            <Button height="h-[55px]" width="lg:w-[205px] w-full">
              Send Reminder
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-col lg:flex-row">
          <div className="space-y-6 border-[0.6px]  border-gray-200 rounded-[12px] w-full">
            <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
              <img src={receipt} alt="receipt-icon" />
              <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                Bio-data Information
              </p>
            </div>

            <div className="space-y-4 pb-4 lg:min-h-[559px] h-full">
              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Full Name:
                </p>
                <p>John Yinka</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Date of Birth:
                </p>
                <p>March 15, 1988 (36 years)</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Phone Number:
                </p>
                <p>08123456789</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Email Address:
                </p>
                <p>John.yinka@gmail.com</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Address:
                </p>
                <p>15 Ogundimu Street, Ikeja, Lagos State, Nigeria</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Occupation
                </p>
                <p>Small Business Owner (Fashion)</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Monthly Income
                </p>
                <p>₦280,000 - ₦350,000</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 border-[0.6px]  border-gray-200 rounded-[12px] w-full">
            <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
              <img src={money} alt="money-icon" />
              <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                Active Loan Details
              </p>
            </div>

            <div className="space-y-4 pb-4 lg:min-h-[559px] h-full">
              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Loan Type:
                </p>
                <p>SME Business Loan</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Loan Amount:
                </p>
                <p>₦850,000</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Interest Rate:
                </p>
                <p>2.5% monthly</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Duration:
                </p>
                <p>12 Months</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Repayment Plan:
                </p>
                <p>Monthly (₦78,200)</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Balance:
                </p>
                <p>₦546,400</p>
              </div>

              <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                <p className="w-full max-w-[130px] text-wrap font-medium">
                  Next Due Date:
                </p>
                <p>Aug 25, 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="space-y-6 border-[0.6px]  border-gray-200 rounded-[12px] w-full">
            <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
              <img src={receipt} alt="receipt-icon" />
              <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                KYC Documents
              </p>
            </div>

            <div className="space-y-4 lg:min-h-[559px] pb-4 h-full">
              <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                <div className="flex items-center gap-2">
                  <img src={pdf} />
                  <p className="text-[16px] leading-[145%] text-gray-400">
                    National ID Card.pdf
                  </p>
                </div>

                <img src={verified} />
              </div>
            </div>
          </div>

          <div className="space-y-6 border-[0.6px]  border-gray-200 rounded-[12px] w-full">
            <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
              <img src={extraMoney} alt="money-icon" />
              <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                Recent Repayment History
              </p>
            </div>

            <div className="space-y-4 lg:min-h-[559px] pb-4 h-full px-[10.5px]">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="h-[66px] flex gap-0.5 flex-row rounded border border-gray-200"
                >
                  <div
                    className={`w-1.5 rounded-tl rounded-bl ${getStatusColor(
                      payment.status
                    )}`}
                  ></div>
                  <div className="flex justify-center gap-0.5 flex-col px-4 text-[14px]">
                    <p className="leading-[145%] font-semibold text-gray-900">
                      {payment.status === "late_paid"
                        ? `${new Date(
                            payment.dueDate
                          ).toLocaleDateString()} (Paid: ${new Date(
                            payment.paidDate!
                          ).toLocaleDateString()})`
                        : `₦${payment.amount.toLocaleString()} - ${payment.status.replace(
                            "_",
                            " "
                          )}`}
                    </p>
                    <p className="leading-5 text-gray-600">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {ROLE === "manager" ? (
          <div className="border-[0.6px]  border-gray-200 rounded-[12px] w-full">
            <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
              <img src={receipt} alt="money-icon" />
              <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                Credit Agents Feedback
              </p>
            </div>

            <div className="py-6 px-4 text-[16px] leading-[145%] text-gray-700">
              Client is very cooperative and has excellent payment history.
              Recommended for higher loan amounts in future applications.
            </div>
          </div>
        ) : (
          <AgentNotesForm />
        )}

        <div className="space-y-6 border-[0.6px]  border-gray-200 rounded-[12px] w-full">
          <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
            <img src={money} alt="money-icon" />
            <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
              Loan History
            </p>
          </div>

          <div className="space-y-4 pb-4 lg:min-h-[559px] h-full">
            <Table columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

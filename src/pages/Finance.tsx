import Button from "@/components/Button/Button";
import PageHeader from "@/components/PageHeader/PageHeader";
import money from "@/assets/icons/wave-money.svg";
import user from "@/assets/icons/users-blue.svg";
import money1 from "@/assets/icons/money-1-coloured.svg";
import infoCircle from "@/assets/icons/info-circle.svg";
import LoanMetricsCard from "@/components/LoanMetricsCard/LoanMetricsCard";
import { Search } from "lucide-react";
import { useState } from "react";

import rightArrow from "@/assets/icons/rightArrow.svg";
import leftArrow from "@/assets/icons/leftArrow.svg";
import addPrimary from "@/assets/icons/addPrimary.svg";
import editGray from "@/assets/icons/edit-gray.svg";
import checkGreenBg from "@/assets/icons/check-greenbg.svg";

import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import type { Column } from "@/components/Table/Table.types";
import Table from "@/components/Table/Table";
import Modal from "@/components/Modal/Modal";
import ProcessSalaryPaymentsModal from "@/components/ui/ProcessSalaryPaymentsModal";
import EditSalaryModal from "@/components/ui/EditSalaryModal";
import MarkAsPaidModal from "./MarkAsPaidModal";
export default function Finance() {
  const [age, setAge] = useState("");
  const [processSalaryPaymentsModal, setProcessSalaryPaymentsModal] =
    useState(false);
  const [editSalaryModal, seteEditSalaryModal] = useState(false);
  const [markAsPaidModal, setMarkAsPaidModal] = useState(false);

  const columns: Column[] = [
    { header: "USER ID", accessor: "name" },
    {
      header: "NAME",
      accessor: "phoneNumber",
      render: (_: any, row: any) => (
        <div className="flex items-center flex-row gap-3">
          <img
            src={profileImage}
            alt=""
            className="w-10 h-10 object-cover rounded-full "
          />
          <p className="max-w-[100px] break-words">{row.name}</p>
        </div>
      ),
    },
    {
      header: "ROLE",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-3 py-1 text-[12px] leading-[145%] rounded-[12px] ${
            {
              Manager: "bg-[#8B15C21A] text-[#8B15C2]",
              Agent: "bg-[#0088FF1A] text-[#0088FF]",
            }[value] || "bg-gray-100 text-gray-600" // fallback for unknown values
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "MONTHLY SALARY", accessor: "phoneNumber" },

    {
      header: "STATUS",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 text-[12px] leading-[145%] rounded-[12px] ${
            {
              Paid: "bg-[#0F973D1A] text-[#0F973D]",
              Pending: "bg-[#CB1A141A] text-[#CB1A14]",
            }[value] || "bg-gray-100 text-gray-600" // fallback for unknown values
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "LAST PAYMENT", accessor: "phoneNumber" },
    {
      header: "ACTION",
      accessor: "phoneNumber",
      render: (_: any, row: any) => (
        <div className="flex gap-4">
          <img
            src={editGray}
            onClick={() => seteEditSalaryModal(true)}
            className="cursor-pointer"
          />
          {row.status === "Pending" && (
            <img
              src={checkGreenBg}
              onClick={() => setMarkAsPaidModal(true)}
              className="cursor-pointer"
            />
          )}
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: "John Yinka",
      phoneNumber: "08123456789",
      status: "Approved",
      date: "2025-09-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNumber: "08098765432",
      status: "Pending",
      date: "2025-09-02",
    },
    {
      id: 3,
      name: "Michael Brown",
      phoneNumber: "07011223344",
      status: "Overdue",
      date: "2025-09-03",
    },
    {
      id: 4,
      name: "Sophia Johnson",
      phoneNumber: "09033445566",
      status: "Active",
      date: "2025-09-04",
    },
    {
      id: 5,
      name: "David Williams",
      phoneNumber: "08155667788",
      status: "Declined",
      date: "2025-09-05",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Salary Management"
          subtitle="Manage employee salaries and payment records"
        />
        <Button
          icon={<img src={money} alt="file" />}
          onClick={() => setProcessSalaryPaymentsModal(true)}
        >
          Process Salaries
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-xl">
        <LoanMetricsCard
          title="Total Employees"
          value="32"
          icon={user}
          iconBg="#0088FF1A"
        />
        <LoanMetricsCard
          title="Monthly Salary bill"
          value="₦2,015,000"
          icon={money1}
          iconBg="#34C7591A"
        />
        <LoanMetricsCard
          title="Pending Payments"
          value="3"
          icon={infoCircle}
          iconBg="#FF383C1A"
        />
      </div>

      <div className="bg-white p-6 rounded-xl space-y-[27.5px]">
        <div className="flex items-center justify-between">
          <div className="lg:max-w-[517px] w-full relative">
            <input
              placeholder="Search by name, phone number, or client ID"
              className="h-10 w-full pl-10 pr-3 outline-0 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] rounded-[6px] text-[14px] leading-[145%] placeholder:text-[#667185]"
            />

            <Search className="absolute top-2 left-3 w-5 h-5" color="#475367" />
          </div>

          <div className="space-x-4 hidden md:block">
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="py-3 px-4 bg-gray-50 border border-gray-100 rounded-[8px] text-gray-700 text-[16px] leading-[145%] outline-none"
            >
              <option value="">Date Added</option>
              <option value={10}>Ten</option>xw
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </select>
          </div>
        </div>
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

      <Modal
        isOpen={processSalaryPaymentsModal}
        onClose={() => setProcessSalaryPaymentsModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Process Salary Payments"
        maxWidth="max-w-[593px]"
      >
        <ProcessSalaryPaymentsModal
          onClose={() => setProcessSalaryPaymentsModal(false)}
        />
      </Modal>

      <Modal
        isOpen={editSalaryModal}
        onClose={() => seteEditSalaryModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Edit Salary"
        maxWidth="max-w-[745px]"
      >
        <EditSalaryModal onClose={() => seteEditSalaryModal(false)} />
      </Modal>

      <Modal
        isOpen={markAsPaidModal}
        onClose={() => setMarkAsPaidModal(false)}
        closeOnOutsideClick={true} // toggle this
        maxWidth="max-w-[407px]"
      >
        <MarkAsPaidModal onClose={() => setMarkAsPaidModal(false)} />
      </Modal>
    </div>
  );
}

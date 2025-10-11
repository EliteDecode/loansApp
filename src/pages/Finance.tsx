import Button from "@/components/Button/Button";
import PageHeader from "@/components/PageHeader/PageHeader";
import money from "@/assets/icons/wave-money.svg";
import user from "@/assets/icons/users-blue.svg";
import money1 from "@/assets/icons/money-1-coloured.svg";
import infoCircle from "@/assets/icons/info-circle.svg";
import LoanMetricsCard from "@/components/LoanMetricsCard/LoanMetricsCard";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

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
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getAllFinancesRecord, getFinancesReports } from "@/services/features";
import CustomTable from "@/components/CustomTable/CustomTable";
import type { CustomTableColumn } from "@/components/CustomTable/CustomTable.types";
import type { FinanceRecord } from "@/services/features/finances/finances.types";
import { useNavigate } from "react-router-dom";

export default function Finance() {
  const [processSalaryPaymentsModal, setProcessSalaryPaymentsModal] =
    useState(false);
  const [editSalaryModal, seteEditSalaryModal] = useState(false);
  const [markAsPaidModal, setMarkAsPaidModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<FinanceRecord | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();

  const { records, isLoading, error, reports, isLoadingReport } = useSelector(
    (state: RootState) => state.finances
  );

  const summary = reports?.summary || {};

  useEffect(() => {
    dispatch(getAllFinancesRecord({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFinancesReports());
  }, [dispatch]);

  console.log(records, isLoading, error);

  const navigate = useNavigate();

  const columns: CustomTableColumn<FinanceRecord>[] = [
    {
      header: "STAFF NAME",
      accessor: "staffName",
      render: (_: string, row: FinanceRecord) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium text-gray-900">{row.staffName}</p>
            <p className="text-sm text-gray-500">{row.staffEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "STAFF TYPE",
      accessor: "staffType",
      render: (value: string) => (
        <span className="capitalize text-gray-700">
          {value?.replace(/([A-Z])/g, " $1")}
        </span>
      ),
    },
    {
      header: "CURRENT SALARY",
      accessor: "currentSalary",
      render: (value: number) => (
        <span className="font-medium text-gray-800">
          ₦{value?.toLocaleString() ?? "N/A"}
        </span>
      ),
    },
    {
      header: "UNPAID MONTHS",
      accessor: "unpaidMonths",
      render: (value: string[]) => (
        <span className="text-gray-700">
          {value?.length > 0 ? value.join(", ") : "None"}
        </span>
      ),
    },
    {
      header: "DATE CREATED",
      accessor: "createdAt",
      render: (value: string) => (
        <span className="text-gray-700">
          {new Date(value).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "LAST UPDATED",
      accessor: "updatedAt",
      render: (value: string) => (
        <span className="text-gray-700">
          {new Date(value).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "ACTIONS",
      accessor: "_id",
      sortable: false,
      width: "280px",
      render: (_: string, row: FinanceRecord) => {
        const { staffType, staffId } = row;

        let path = "";
        if (staffType === "creditAgent") {
          path = `/credit-agents/credit-agents-info/${staffId}?tab=finance`;
        } else if (staffType === "manager") {
          path = `/user-management/managers-info/${staffId}?tab=finance`;
        } else if (staffType === "director") {
          path = `/user-management/director-info/${staffId}?tab=finance`;
        } else {
          path = `/finance/records/${row._id}`;
        }

        return (
          <div className="flex items-center gap-2">
            {/* View Details */}
            <Button
              variant="outline"
              height="h-8"
              width="w-20"
              onClick={() => navigate(path)}
            >
              View
            </Button>

            {/* Edit Salary */}
            <Button
              variant="muted"
              height="h-8"
              width="w-24"
              onClick={() => {
                setSelectedStaff(row);
                seteEditSalaryModal(true);
              }}
            >
              Edit Salary
            </Button>

            {/* Pay Salary */}
            <Button
              height="h-8"
              width="w-24"
              onClick={() => {
                setSelectedStaff(row);
                setMarkAsPaidModal(true);
              }}
            >
              Pay Salary
            </Button>
          </div>
        );
      },
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
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 bg-white p-6 rounded-xl">
        <LoanMetricsCard
          title="Total Employees"
          value={summary?.totalStaff ?? 0}
          icon={user}
          iconBg="#0088FF1A"
          isLoading={isLoadingReport}
        />

        <LoanMetricsCard
          title="Monthly Salary Bill"
          value={`₦${summary?.averageMonthlySpending?.toLocaleString() ?? 0}`}
          icon={money1}
          iconBg="#34C7591A"
          isLoading={isLoadingReport}
        />

        <LoanMetricsCard
          title="Pending Payments"
          value={summary?.totalPendingAmount?.toLocaleString() ?? 0}
          icon={infoCircle}
          iconBg="#FF383C1A"
          isLoading={isLoadingReport}
        />
      </div>

      <div className="bg-white rounded-xl space-y-[27.5px]">
        <CustomTable
          data={records}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by agent ID, name, email, or status"
          searchFields={
            ["creditAgentID", "firstName", "lastName", "email", "status"]
            // as (keyof CreditAgent)[]
          }
          pagination={true}
          pageSize={10}
          showPageSizeSelector={true}
          pageSizeOptions={[5, 10, 20, 50]}
          emptyMessage="No credit agents found"
          loading={isLoading}
          // onRowClick={(row) => {
          //   navigate(`/credit-agents/credit-agents-info/${row._id}`);
          // }}
        />
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
        closeOnOutsideClick={true}
        title="Edit Salary"
        maxWidth="max-w-[745px]"
      >
        {selectedStaff && (
          <EditSalaryModal
            onClose={() => seteEditSalaryModal(false)}
            staff={selectedStaff}
          />
        )}
      </Modal>

      <Modal
        isOpen={markAsPaidModal}
        onClose={() => setMarkAsPaidModal(false)}
        closeOnOutsideClick={true}
        maxWidth="max-w-[407px]"
      >
        {selectedStaff && (
          <MarkAsPaidModal
            onClose={() => setMarkAsPaidModal(false)}
            staff={selectedStaff}
          />
        )}
      </Modal>
    </div>
  );
}

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
import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import ClientsInfo from "@/components/ui/ClientsInfo";
import GuarantorsDetails from "@/components/ui/GuarantorsDetails";
import LoanTerms from "@/components/ui/LoanTerms";
import AttachmentsAdmin from "@/components/ui/DocumentsAdmin";
import DocumentsAdmin from "@/components/ui/DocumentsAdmin";
import ActivityLogs from "@/components/ui/ActivityLogs";
import Modal from "@/components/Modal/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import ApproveLoanModal from "@/components/modals/ApproveLoanModal/ApproveLoanModal";
import ApproveLoanConfrimModal from "@/components/modals/ApproveLoanConfrimModal/ApproveLoanConfrimModal";
import RejectLoanModal from "@/components/modals/RejectLoanModal/RejectLoanModal";
import RejectLoanConfrimModal from "@/components/modals/RejectLoanConfrimModal/RejectLoanConfrimModal";
import RequestEditLoanModal from "@/components/modals/RequestEditLoanModal/RequestEditLoanModal";

// ✅ you already have this from backend
const backendData = { name: "John Doe", id: "12345" };

export default function () {
  const naviagte = useNavigate();
  const [value, setValue] = useState(0);

  const [loanData, setLoanData] = useState<{
    comment: string;
    name: string;
    id: string;
  } | null>(null);
  // Modals state
  const [openApproveloanModal, setOpenApproveloanModal] = useState(false);
  const [openApproveloanConfrimModal, setOpenApproveloanConfrimModal] =
    useState(false);

  const [openRejectloanModal, setOpenRejectloanModal] = useState(false);
  const [openRejectloanConfrimModal, setOpenRejectloanConfrimModal] =
    useState(false);

  const [openRequestEditloanModal, setOpenRequestEditloanModal] =
    useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const valueStatus = "Approved";

  const tabs = [
    "Clients Info",
    "Guarantor’s Details",
    "Loan Terms",
    "Documents",
    "Activity Log",
  ];

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
          <div className="space-y-2 md:text-[16px] text-[14px] font-medium text-gray-700">
            <p className="text-gray-400">Loan Details</p>
            <p>Client ID: CLT-2024-0156</p>
            <p>Joined: March 2024</p>

            <div className="px-3 py-1 bg-[#0F973D1A] text-[#0F973D] text-[12px] leading-[145%] w-fit rounded-[12px]">
              Active
            </div>
          </div>

          <div className="flex lg:flex-row flex-col items-center md:gap-4 gap-2 flex-wrap ">
            <Button
              height="h-[55px]"
              variant="success"
              width="lg:w-[205px] w-full"
              onClick={() => setOpenApproveloanModal(true)}
            >
              Approve Loan
            </Button>

            <Button
              height="h-[55px]"
              width="lg:w-[205px] w-full"
              variant="danger"
              onClick={() => setOpenRejectloanModal(true)}
            >
              Reject Loan
            </Button>

            <Button
              height="h-[55px]"
              width="lg:w-[205px] w-full"
              onClick={() => setOpenRequestEditloanModal(true)}
            >
              Request Edit
            </Button>
          </div>
        </div>

        <div className="w-full">
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
                  },
                }}
              />
            ))}
          </Tabs>

          {value === 0 && <ClientsInfo />}
          {value === 1 && <GuarantorsDetails />}
          {value === 2 && <LoanTerms />}
          {value === 3 && <DocumentsAdmin />}
          {value === 4 && <ActivityLogs />}
        </div>
      </div>

      {/* Approve */}
      <Modal
        isOpen={openApproveloanModal}
        onClose={() => setOpenApproveloanModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Approve Loan"
        maxWidth="max-w-[855px]"
      >
        <ApproveLoanModal
          onClose={() => setOpenApproveloanModal(false)}
          onConfirm={(comment) => {
            // ✅ combine backend data + comment
            setLoanData({
              ...backendData,
              comment,
            });
            setOpenApproveloanModal(false);
            setOpenApproveloanConfrimModal(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={openApproveloanConfrimModal}
        onClose={() => setOpenApproveloanConfrimModal(false)}
        closeOnOutsideClick={false} // toggle this
        maxWidth="max-w-[381px]"
      >
        <ApproveLoanConfrimModal
          data={loanData}
          onClose={() => setOpenApproveloanConfrimModal(false)}
          // onClose={() => setOpenApproveloanConfrimModal(false)}
        />
      </Modal>

      {/* Reject */}
      <Modal
        isOpen={openRejectloanModal}
        onClose={() => setOpenRejectloanModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Reject Loan"
        maxWidth="max-w-[855px]"
      >
        <RejectLoanModal
          onClose={() => setOpenRejectloanModal(false)}
          onConfirm={(comment) => {
            // ✅ combine backend data + comment
            setLoanData({
              ...backendData,
              comment,
            });
            setOpenRejectloanModal(false);
            setOpenRejectloanConfrimModal(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={openRejectloanConfrimModal}
        onClose={() => setOpenRejectloanModal(false)}
        closeOnOutsideClick={false} // toggle this
        maxWidth="max-w-[381px]"
      >
        <RejectLoanConfrimModal
          data={loanData}
          onClose={() => setOpenRejectloanConfrimModal(false)}
          // onClose={() => setOpenApproveloanConfrimModal(false)}
        />
      </Modal>

      {/* Request Edit */}
      <Modal
        isOpen={openRequestEditloanModal}
        onClose={() => setOpenRequestEditloanModal(false)}
        closeOnOutsideClick={true} // toggle this
        title="Request Edit for Loan LN-2025-001"
        maxWidth="max-w-[855px]"
      >
        <RequestEditLoanModal
          onClose={() => setOpenRequestEditloanModal(false)}
        />
      </Modal>
    </div>
  );
}

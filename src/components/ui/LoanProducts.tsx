import { Form, Formik } from "formik";
import SelectInput from "../SelectInput/SelectInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import CustomTable from "../CustomTable/CustomTable";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";
import {
  getAllLoanProducts,
  toggleLoanProductStatus,
} from "@/services/features";
import type { AppDispatch, RootState } from "@/store";
import Modal from "../Modal/Modal";
import EditLoanProduct from "./EditLoanProduct";
import Button from "../Button/Button";

export default function LoanProducts() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const [editLoanModal, setEditLoanModal] = useState(false);
  const [deactivateLoanModal, setDeactivateLoanModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const openEditModal = (loan: any) => {
    setSelectedLoan(loan);
    setEditLoanModal(true);
  };

  const { loanProducts, isLoading, isError } = useSelector(
    (state: RootState) => state.loanProduct
  );

  console.log(loanProducts);

  const initialValues = {
    status: searchParams.get("status") || "",
    tenure: searchParams.get("tenure") || "",
  };

  const updateUrl = (values: typeof initialValues) => {
    const query = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    navigate(`/Settings?${query.toString()}`);
  };

  const handleDeactivateLoan = async () => {
    if (!selectedLoan?._id) return;

    try {
      const res = await dispatch(
        toggleLoanProductStatus(selectedLoan._id)
      ).unwrap();

      showSuccessToast(res?.message || "Loan product deactivated successfully");
      setDeactivateLoanModal(false);

      // ✅ Refetch to validate and refresh instantly
      dispatch(getAllLoanProducts());
    } catch (err: any) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to deactivate loan product. Try again.";
      showErrorToast(message);
    }
  };

  // ✅ Fetch on mount or when filters change
  useEffect(() => {
    const filters = Object.fromEntries(searchParams.entries());
    dispatch(getAllLoanProducts(filters))
      .unwrap()
      .catch(() => showErrorToast("Failed to load loan products"));
  }, [dispatch, searchParams]);

  // ✅ Define table columns
  const loanColumns = [
    { header: "LOAN NAME", accessor: "productName" },
    { header: "INTEREST RATE%", accessor: "interestRate" },
    {
      header: "TENURE RANGE",
      accessor: "tenure",
      render: (_: string, row: any) => (
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <p>{row?.maxTenure}</p>-<p>{row?.minTenure}</p>
          <p>{row?.tenureUnit}</p>
        </div>
      ),
    },
    {
      header: "COLLATERAL",
      accessor: "requiresCollateral",
      render: (_: string, row: any) => (
        <span
          className={`px-2 text-[12px] leading-[145%] rounded-[12px] ${
            row.requiresCollateral
              ? "bg-[#0F973D1A] text-[#0F973D]" // Yes
              : "bg-[#CB1A141A] text-[#CB1A14]" // No
          }`}
        >
          {row.requiresCollateral ? "Required" : "Not Required"}
        </span>
      ),
    },
    {
      header: "STATUS",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 text-[12px] leading-[145%] rounded-[12px] ${
            {
              active: "bg-[#0F973D1A] text-[#0F973D]",
              Pending: "bg-[#F3A2181A] text-[#F3A218]",
              inactive: "bg-[#CB1A141A] text-[#CB1A14]",
            }[value] || "bg-gray-100 text-gray-600" // fallback for unknown values
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "ACTION",
      accessor: "amountPaid",
      render: (_: string, row: any) => (
        <div className="text-[14px] leading-[145%] font-semibold flex items-center gap-3">
          <h1
            className="text-primary cursor-pointer"
            onClick={() => openEditModal(row)}
          >
            Edit
          </h1>
          <p
            className={`cursor-pointer font-medium transition-colors duration-200 ${
              row.status === "active"
                ? "text-[#CB1A14] hover:text-red-700"
                : "text-[#0F973D] hover:text-green-700"
            }`}
            onClick={() => {
              setSelectedLoan(row);
              setDeactivateLoanModal(true);
            }}
          >
            {row.status === "active" ? "Deactivate" : "Activate"}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* ---------------- FILTERS ---------------- */}
      <div className="space-y-4 bg-white rounded-xl p-6">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={() => {}}
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

      {/* ---------------- TABLE ---------------- */}
      <div className="space-y-6 bg-white rounded-xl p-6">
        <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-700">
          Loan Details
        </h1>

        <CustomTable
          data={loanProducts || []}
          columns={loanColumns}
          searchable={true}
          searchPlaceholder="Search loans by ID, product, or status"
          searchFields={["_id", "productName", "status"]}
          pagination={true}
          pageSize={5}
          showPageSizeSelector={true}
          pageSizeOptions={[5, 10, 20]}
          emptyMessage={
            isError
              ? "Failed to load loan data"
              : "No loans found for this client"
          }
          loading={isLoading}
        />
      </div>

      <Modal
        isOpen={editLoanModal}
        onClose={() => setEditLoanModal(false)}
        closeOnOutsideClick={true}
        title="Edit Loan Product"
        maxWidth="max-w-[877px]"
      >
        <EditLoanProduct
          loanData={selectedLoan}
          onClose={() => setEditLoanModal(false)}
        />
      </Modal>

      <Modal
        isOpen={deactivateLoanModal}
        onClose={() => setDeactivateLoanModal(false)}
        closeOnOutsideClick={true}
        title={
          selectedLoan?.status === "active"
            ? "Deactivate Loan"
            : "Activate Loan"
        }
        maxWidth="max-w-[455px]"
      >
        <div className="space-y-8 pt-4 border-t border-gray-200">
          <p className="text-[16px] leading-[145%] text-gray-700">
            Are you sure you want to{" "}
            <span
              className={
                selectedLoan?.status === "active"
                  ? "text-[#CB1A14] font-semibold uppercase"
                  : "text-[#0F973D] font-semibold uppercase"
              }
            >
              {selectedLoan?.status === "active" ? "Deactivate" : "Activate"}
            </span>{" "}
            the loan product{" "}
            <span className="font-medium text-gray-900">
              {selectedLoan?.productName}
            </span>
            ?
          </p>

          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDeactivateLoanModal(false)}
            >
              Cancel
            </Button>

            <Button
              variant={selectedLoan?.status === "active" ? "danger" : "success"}
              onClick={handleDeactivateLoan}
              disabled={isLoading}
            >
              {isLoading
                ? selectedLoan?.status === "active"
                  ? "Deactivating..."
                  : "Activating..."
                : "Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

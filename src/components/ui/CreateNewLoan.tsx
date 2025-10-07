import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../TextInput/TextInput";
import FormSelect from "../FormSelect/FormSelect";
import SearchableSelect from "../SearchableSelect/SearchableSelect";
import Button from "../Button/Button";
import dropDown from "@/assets/icons/dropDown.svg";
import * as Yup from "yup";
import moneyIcon from "@/assets/icons/money-1.svg";
import add from "@/assets/icons/add.svg";
import { DatePicker } from "@mui/x-date-pickers";
import FileUploadWithProgress from "../FileUploadWithProgress/FileUploadWithProgress";
import type { Client } from "@/services/features/client/client.types";
import type { LoanProduct } from "@/services/features/loanProduct/loanProduct.types";
import { createLoanRequest } from "@/services/features/loanRequest/loanRequestService";
import SuccessModal from "../modals/SuccessModal/SuccessModal";
import ErrorModal from "../modals/ErrorModal/ErrorModal";

// Component props interface
interface CreateNewLoanProps {
  clients: Client[];
  loanProducts: LoanProduct[];
  preselectedClientId?: string | null;
}

// Form values interface
interface LoanRequestFormValues {
  clientId: string;
  loanProductId: string;
  loanAmount: string | number;
  loanTenure: string | number;
  tenureUnit: string;
  repaymentStartDate: Date | null;
  loanPurpose: string;
  clientAccountNumber: string;
  clientBankName: string;
  collateralDescription: string;
  supportingDocuments: string[];
}

export default function CreateNewLoan({
  clients,
  loanProducts,
  preselectedClientId,
}: CreateNewLoanProps) {
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState<string>("");
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get preselected client
  const preselectedClient = preselectedClientId
    ? clients.find((client) => client._id === preselectedClientId)
    : null;

  // Validation schema
  const validationSchema = Yup.object({
    clientId: Yup.string().required("Please select a client"),
    loanProductId: Yup.string().required("Please select loan product"),
    loanAmount: Yup.number()
      .typeError("Loan amount must be a number")
      .positive("Loan amount must be greater than 0")
      .required("Please enter loan amount"),
    loanTenure: Yup.number()
      .typeError("Loan tenure must be a number")
      .positive("Loan tenure must be greater than 0")
      .required("Please enter loan tenure"),
    tenureUnit: Yup.string()
      .oneOf(["days", "weeks", "months", "years"], "Invalid tenure unit")
      .required("Please select tenure unit"),
    clientAccountNumber: Yup.string()
      .matches(/^\d{10}$/, "Account number must be 10 digits")
      .required("Please enter client's account number"),
    clientBankName: Yup.string().required("Please select bank"),
    repaymentStartDate: Yup.date()
      .nullable()
      .required("Please select repayment start date")
      .min(new Date(), "Repayment start date must be in the future"),
    loanPurpose: Yup.string()
      .min(10, "Loan purpose must be at least 10 characters")
      .required("Please provide loan purpose"),
    collateralDescription: Yup.string().when("loanProductId", {
      is: (val: string) => {
        const product = loanProducts.find((p) => p._id === val);
        return product?.requiresCollateral === true;
      },
      then: (schema) =>
        schema
          .min(10, "Collateral description must be at least 10 characters")
          .required("Collateral description cannot be empty"),
      otherwise: (schema) => schema.notRequired(),
    }),
    supportingDocuments: Yup.array().optional(),
  });

  const bankOptions = [
    { label: "Test Bank", value: "001", name: "Test Bank", code: "001" }, // ✅ safe for test mode
    { label: "Access Bank", value: "044", name: "Access Bank", code: "044" }, /// change value and code to 044 later, this is just for test
    { label: "Citibank", value: "023", name: "Citibank", code: "023" },
    { label: "Diamond Bank", value: "063", name: "Diamond Bank", code: "063" },
    {
      label: "Ecobank Nigeria",
      value: "050",
      name: "Ecobank Nigeria",
      code: "050",
    },
    {
      label: "Fidelity Bank Nigeria",
      value: "070",
      name: "Fidelity Bank Nigeria",
      code: "070",
    },
    {
      label: "First Bank of Nigeria",
      value: "011",
      name: "First Bank of Nigeria",
      code: "011",
    },
    {
      label: "First City Monument Bank",
      value: "214",
      name: "First City Monument Bank",
      code: "214",
    },
    {
      label: "Guaranty Trust Bank",
      value: "058",
      name: "Guaranty Trust Bank",
      code: "058",
    },
    {
      label: "Heritage Bank Plc",
      value: "030",
      name: "Heritage Bank Plc",
      code: "030",
    },
    {
      label: "Keystone Bank Limited",
      value: "082",
      name: "Keystone Bank Limited",
      code: "082",
    },
    { label: "Kuda Bank", value: "50211", name: "Kuda Bank", code: "50211" },
    {
      label: "Moniepoint MFB",
      value: "50515",
      name: "Moniepoint MFB",
      code: "50515",
    },
    { label: "Opay", value: "999991", name: "Opay", code: "999991" },
    { label: "Palmpay", value: "999992", name: "Palmpay", code: "999992" },
    { label: "Polaris Bank", value: "076", name: "Polaris Bank", code: "076" },
    {
      label: "Providus Bank",
      value: "101",
      name: "Providus Bank",
      code: "101",
    },
    {
      label: "Stanbic IBTC Bank",
      value: "221",
      name: "Stanbic IBTC Bank",
      code: "221",
    },
    {
      label: "Standard Chartered Bank",
      value: "068",
      name: "Standard Chartered Bank",
      code: "068",
    },
    {
      label: "Sterling Bank",
      value: "232",
      name: "Sterling Bank",
      code: "232",
    },
    {
      label: "Suntrust Bank Nigeria",
      value: "100",
      name: "Suntrust Bank Nigeria",
      code: "100",
    },
    {
      label: "Union Bank of Nigeria",
      value: "032",
      name: "Union Bank of Nigeria",
      code: "032",
    },
    {
      label: "United Bank for Africa",
      value: "033",
      name: "United Bank for Africa",
      code: "033",
    },
    {
      label: "Unity Bank Plc",
      value: "215",
      name: "Unity Bank Plc",
      code: "215",
    },
    { label: "Wema Bank", value: "035", name: "Wema Bank", code: "035" },
    { label: "Zenith Bank", value: "057", name: "Zenith Bank", code: "057" },
  ];

  // Handle form submission
  const handleSubmit = async (values: LoanRequestFormValues) => {
    setIsSubmitting(true);
    try {
      const loanData = {
        clientId: values.clientId,
        loanProductId: values.loanProductId,
        loanAmount: Number(values.loanAmount),
        loanTenure: Number(values.loanTenure),
        tenureUnit: values.tenureUnit,
        repaymentStartDate: values.repaymentStartDate?.toISOString() || "",
        loanPurpose: values.loanPurpose,
        clientAccountNumber: values.clientAccountNumber,
        clientBankName: values.clientBankName,
        collateralDescription: values.collateralDescription,
        supportingDocuments: values.supportingDocuments,
      };

      const response = await createLoanRequest(loanData);

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(response.message || "Failed to create loan request");
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/loans");
  };

  // Handle error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-[20px] font-medium text-gray-700">
        Create New Loan Request
      </h1>

      <Formik
        initialValues={{
          clientId: preselectedClient?._id || "",
          loanProductId: "",
          loanAmount: "",
          loanTenure: "",
          tenureUnit: "",
          clientAccountNumber: "",
          clientBankName: "",
          repaymentStartDate: null,
          loanPurpose: "",
          collateralDescription: "",
          supportingDocuments: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          const selectedLoanProduct = loanProducts.find(
            (p) => p._id === formik.values.loanProductId
          );

          // Auto-fill tenure unit when loan product changes
          useEffect(() => {
            if (selectedLoanProduct) {
              formik.setFieldValue(
                "tenureUnit",
                selectedLoanProduct.tenureUnit
              );
            }
          }, [selectedLoanProduct]);

          // Resolve account name when account number + bank selected
          useEffect(() => {
            const fetchAccountName = async () => {
              const { clientAccountNumber, clientBankName } = formik.values;
              const bank = bankOptions.find((b) => b.value === clientBankName);

              if (clientAccountNumber?.length === 10 && bank) {
                try {
                  setLoadingAccount(true);
                  const res = await fetch(
                    `https://api.paystack.co/bank/resolve?account_number=${clientAccountNumber}&bank_code=${bank.code}`,
                    {
                      headers: {
                        Authorization: `Bearer ${
                          import.meta.env.VITE_PAYSTACK_SECRET
                        }`,
                      },
                    }
                  );

                  const data = await res.json();
                  if (data.status) {
                    setAccountName(data.data.account_name);
                  } else {
                    setAccountName("❌ Invalid account details");
                  }
                } catch (err) {
                  setAccountName("⚠️ Error validating account");
                } finally {
                  setLoadingAccount(false);
                }
              } else {
                setAccountName("");
              }
            };

            fetchAccountName();
          }, [formik.values.clientAccountNumber, formik.values.clientBankName]);

          return (
            <Form className="space-y-6 w-full">
              {/* Client Selection */}
              <SearchableSelect
                name="clientId"
                label="Select Client"
                options={clients.map((client) => ({
                  value: client._id,
                  label: `${client.firstName} ${client.lastName} (${client.phoneNumber})`,
                }))}
                placeholder="Search and select a client"
                icon={<img src={dropDown} alt="icon" />}
                disabled={!!preselectedClient}
              />

              {/* Loan Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <img src={moneyIcon} alt="money icon" />
                  <h1 className="text-[18px] font-medium text-gray-700">
                    Loan Details
                  </h1>
                </div>

                <SearchableSelect
                  name="loanProductId"
                  label="Loan Product"
                  options={loanProducts.map((product) => ({
                    value: product._id,
                    label: `${product.productName} (${product.interestRate}% interest)`,
                  }))}
                  placeholder="Search and select loan product"
                  icon={<img src={dropDown} alt="icon" />}
                />

                <div className="flex flex-col gap-1 w-full">
                  <TextInput
                    name="loanAmount"
                    type="tel"
                    label="Loan Amount"
                    placeholder="Enter loan amount"
                    amount={true}
                  />
                  {selectedLoanProduct && (
                    <p className="text-xs text-gray-500">
                      Minimum: ₦
                      {selectedLoanProduct.minLoanAmount.toLocaleString()} •
                      Maximum: ₦
                      {selectedLoanProduct.maxLoanAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Interest Rate Display (Read-only) */}
                {selectedLoanProduct && (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-[14px] font-medium text-gray-900">
                      Interest Rate
                    </label>
                    <div className="h-12 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                      <span className="text-sm text-gray-700">
                        {selectedLoanProduct.interestRate}% per annum
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Interest rate is determined by the selected loan product
                    </p>
                  </div>
                )}

                {/* Repayment Frequency Display (Read-only) */}
                {selectedLoanProduct && (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-[14px] font-medium text-gray-900">
                      Repayment Frequency
                    </label>
                    <div className="h-12 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                      <span className="text-sm text-gray-700 capitalize">
                        {selectedLoanProduct.repaymentFrequency}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Repayment frequency is determined by the selected loan
                      product
                    </p>
                  </div>
                )}

                {/* Loan Tenure */}
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                    <div className="md:w-[80%] w-full">
                      <TextInput
                        name="loanTenure"
                        type="tel"
                        label="Loan Tenure"
                        placeholder="Enter loan tenure"
                      />
                    </div>
                    <div className="md:w-[20%] w-full">
                      <FormSelect
                        name="tenureUnit"
                        label="."
                        options={[
                          { value: "days", label: "Days" },
                          { value: "weeks", label: "Weeks" },
                          { value: "months", label: "Months" },
                          { value: "years", label: "Years" },
                        ]}
                        placeholder="Unit"
                        icon={<img src={dropDown} alt="icon" />}
                        disabled={!!selectedLoanProduct}
                      />
                    </div>
                  </div>
                  {selectedLoanProduct && (
                    <p className="text-xs text-gray-500">
                      Minimum: {selectedLoanProduct.minTenure}{" "}
                      {selectedLoanProduct.tenureUnit} • Maximum:{" "}
                      {selectedLoanProduct.maxTenure}{" "}
                      {selectedLoanProduct.tenureUnit}
                    </p>
                  )}
                </div>

                {/* Account Details */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="md:w-1/2 w-full">
                      <TextInput
                        name="clientAccountNumber"
                        type="tel"
                        label="Client's Account Number"
                        placeholder="Enter 10-digit account number"
                      />
                    </div>
                    <div className="md:w-1/2 w-full">
                      <SearchableSelect
                        name="clientBankName"
                        label="Bank Name"
                        options={bankOptions}
                        placeholder="Search and select bank"
                        icon={<img src={dropDown} alt="icon" />}
                      />
                    </div>
                  </div>

                  <p className="text-[14px] leading-[145%] text-gray-500">
                    {loadingAccount
                      ? "⏳ Validating account..."
                      : accountName
                      ? `✅ Account Name: ${accountName}`
                      : "Customer's name will display here after validation"}
                  </p>
                </div>

                {/* Repayment Start Date */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-medium text-gray-900">
                    Repayment Start Date
                  </label>
                  <Field name="repaymentStartDate">
                    {({ field, form }: FieldProps) => (
                      <DatePicker
                        value={field.value || null}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        disablePast
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(
                              form.touched.repaymentStartDate &&
                                form.errors.repaymentStartDate
                            ),
                          },
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="repaymentStartDate"
                    component="span"
                    className="text-red-500 text-xs"
                  />
                </div>

                {/* Loan Purpose */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="loanPurpose"
                    className="text-[16px] font-medium text-gray-900"
                  >
                    Loan Purpose
                  </label>
                  <textarea
                    id="loanPurpose"
                    name="loanPurpose"
                    className={`resize-none h-[98px] p-4 rounded-[6px] border outline-primary ${
                      formik.touched.loanPurpose && formik.errors.loanPurpose
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Brief description of loan’s purpose"
                    value={formik.values.loanPurpose}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.loanPurpose && formik.errors.loanPurpose && (
                    <span className="text-sm text-red-500">
                      {formik.errors.loanPurpose}
                    </span>
                  )}
                </div>
              </div>

              {/* Collateral Section (Always visible, required only if loan product needs it) */}
              <div className="space-y-6">
                <div className="flex flex-row gap-2 items-center">
                  <img src={moneyIcon} alt="money icon" />
                  <h1 className="text-[18px] font-medium text-gray-700">
                    Collateral & Attachments
                  </h1>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="collateralDescription"
                    className="text-[16px] font-medium text-gray-900"
                  >
                    Collateral Description
                    {selectedLoanProduct?.requiresCollateral && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <textarea
                    id="collateralDescription"
                    name="collateralDescription"
                    className={`resize-none h-[98px] p-4 rounded-[6px] border outline-primary ${
                      formik.touched.collateralDescription &&
                      formik.errors.collateralDescription
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={
                      selectedLoanProduct?.requiresCollateral
                        ? "Describe the collateral being provided for this loan (required)"
                        : "Describe any collateral being provided for this loan (optional)"
                    }
                    value={formik.values.collateralDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.collateralDescription &&
                    formik.errors.collateralDescription && (
                      <span className="text-sm text-red-500">
                        {formik.errors.collateralDescription}
                      </span>
                    )}
                  {selectedLoanProduct && (
                    <p className="text-xs text-gray-500">
                      {selectedLoanProduct.requiresCollateral
                        ? "This loan product requires collateral"
                        : "This loan product does not require collateral"}
                    </p>
                  )}
                </div>
              </div>

              {/* Supporting Documents Section (Always Available) */}
              <div className="space-y-6">
                <div className="flex flex-row gap-2 items-center">
                  <img src={moneyIcon} alt="money icon" />
                  <h1 className="text-[18px] font-medium text-gray-700">
                    Supporting Documents
                  </h1>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Upload supporting documents (optional but recommended)
                  </p>
                  <FileUploadWithProgress
                    label="Upload Document"
                    onFileUploaded={(url) => {
                      const currentDocs = formik.values.supportingDocuments;
                      formik.setFieldValue("supportingDocuments", [
                        ...currentDocs,
                        url,
                      ]);
                    }}
                    onUploadError={(error) => {
                      console.error("Upload error:", error);
                    }}
                    accept="image/*,application/pdf"
                    maxSizeMB={5}
                  />
                  {formik.values.supportingDocuments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Uploaded Documents (
                        {formik.values.supportingDocuments.length}):
                      </p>
                      {formik.values.supportingDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <a
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              Document {index + 1}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedDocs =
                                formik.values.supportingDocuments.filter(
                                  (_, i) => i !== index
                                );
                              formik.setFieldValue(
                                "supportingDocuments",
                                updatedDocs
                              );
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-row flex-col-reverse gap-4 justify-end">
                <Button
                  variant="outline"
                  width="md:w-[102px] w-full"
                  height="h-14"
                  onClick={() => navigate("/loan-requests")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  icon={<img src={add} />}
                  iconPosition="left"
                  width="md:w-[187px] w-full"
                  height="h-14"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Loan Request Submitted Successfully!"
        message="Your loan request has been submitted and is now under review."
        confirmText="OK"
        onConfirm={handleSuccessModalClose}
      />

      {/* Error Modal */}
      <ErrorModal
        open={showErrorModal}
        onClose={handleErrorModalClose}
        message={errorMessage}
        showRetry={true}
        retryText="Try Again"
        onRetry={handleErrorModalClose}
      />
    </div>
  );
}

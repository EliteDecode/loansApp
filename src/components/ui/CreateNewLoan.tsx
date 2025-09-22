import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import React, { useEffect, useState } from "react";
import SearchSelect from "./SearchSelect";
import TextInput from "../TextInput/TextInput";
import FormSelect from "../FormSelect/FormSelect";
import Button from "../Button/Button";
import dropDown from "@/assets/icons/dropDown.svg";
import * as Yup from "yup";
import moneyIcon from "@/assets/icons/money-1.svg";
import add from "@/assets/icons/add.svg";
import draft from "@/assets/icons/draft.svg";
import { DatePicker } from "@mui/x-date-pickers";
import FileDropzone from "../FileDropzone/FileDropzone";

const loanTypes = [
  {
    value: "sme",
    label: "SME Business Growth Loan",
    collateral: true,
    interest: 10,
  }, // 10%
  { value: "personal", label: "Personal Loan", collateral: false, interest: 8 }, // 8%
  { value: "car", label: "Car Loan", collateral: true, interest: 12 }, // 12%
  {
    value: "education",
    label: "Education Loan (0% Interest)",
    collateral: false,
    interest: 0,
  }, // 0%
];

const loanTenureOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const replaymentOptions = [
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function CreateNewLoan() {
  const [accountName, setAccountName] = useState<string>("");
  const [loadingAccount, setLoadingAccount] = useState(false);

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
      }, 1000);
    });
  };

  // ✅ Validation schema with conditional collateral
  const validationSchema = Yup.object({
    client: Yup.object().nullable().required("Please select a client"),
    loanAmount: Yup.number()
      .typeError("Loan amount must be a number")
      .positive("Loan amount must be greater than 0")
      .required("Please enter loan amount"),
    loanType: Yup.string().required("Please select loan type"),
    loanTenure: Yup.number()
      .typeError("Loan tenure must be a number")
      .positive("Loan tenure must be greater than 0")
      .required("Please enter loan tenure"),
    loanTenureUnit: Yup.string()
      .oneOf(["monthly", "yearly"], "Invalid loan tenure unit")
      .required("Please select tenure unit"),
    ClientsAccountNumber: Yup.string()
      .matches(/^\d{10}$/, "Account number must be 10 digits")
      .required("Please enter client’s account number"),
    bankName: Yup.string().required("Please select bank"),
    accountName: Yup.string().required("Account name is required"), // ✅ added
    repaymentFrequency: Yup.string()
      .oneOf(["daily", "monthly", "yearly"], "Invalid repayment frequency")
      .required("Please select repayment frequency"),
    interestRate: Yup.number()
      .typeError("Interest rate must be a number")
      .min(0, "Interest rate cannot be negative")
      .max(100, "Interest rate cannot exceed 100%")
      .required("Interest rate is required"),
    rsd: Yup.date().nullable().required("Please select repayment start date"),
    loanPurpose: Yup.string()
      .min(10, "Loan purpose must be at least 10 characters")
      .required("Please provide loan purpose"),
    collateralDescription: Yup.string().when("loanType", {
      is: (val: string) =>
        loanTypes.find((lt) => lt.value === val)?.collateral === true,
      then: (schema) =>
        schema
          .min(10, "Collateral description must be at least 10 characters")
          .required("Please provide collateral description"),
      otherwise: (schema) => schema.notRequired(),
    }),
    Document: Yup.mixed().when("loanType", {
      is: (val: string) =>
        loanTypes.find((lt) => lt.value === val)?.collateral === true,
      then: (schema) =>
        schema
          .required("Please upload a supporting document")
          .test("fileType", "Invalid file", (value) => !!value),
      otherwise: (schema) => schema.notRequired(),
    }),
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

  return (
    <div className="space-y-6">
      <h1 className="text-[20px] font-medium text-gray-700">Loan Requests</h1>

      <Formik
        initialValues={{
          client: null,
          loanAmount: "",
          loanType: "",
          loanTenure: "",
          loanTenureUnit: "",
          ClientsAccountNumber: "",
          bankName: "",
          accountName: "", // ✅ added
          repaymentFrequency: "",
          interestRate: "",
          rsd: null,
          loanPurpose: "",
          collateralDescription: "",
          Document: [],
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form submitted:", values);
        }}
      >
        {(formik) => {
          const selectedLoanType = formik.values.loanType;
          const loanTypeConfig = loanTypes.find(
            (l) => l.value === selectedLoanType
          );

          // Auto-fill interest rate when loanType changes
          // Auto-fill interest when loan type changes
          useEffect(() => {
            if (loanTypeConfig) {
              formik.setFieldValue("interestRate", loanTypeConfig.interest);
            }
          }, [selectedLoanType]);

          // Resolve account name when account number + bank selected
          useEffect(() => {
            const fetchAccountName = async () => {
              const { ClientsAccountNumber, bankName } = formik.values;
              const bank = bankOptions.find((b) => b.value === bankName);

              if (ClientsAccountNumber?.length === 10 && bank) {
                try {
                  setLoadingAccount(true); // start loading
                  const res = await fetch(
                    `https://api.paystack.co/bank/resolve?account_number=${ClientsAccountNumber}&bank_code=${bank.code}`,
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
                    formik.setFieldValue("accountName", data.data.account_name); // ✅ store in Formik
                  } else {
                    setAccountName("❌ Invalid account details");
                    formik.setFieldValue("accountName", "");
                  }
                } catch (err) {
                  setAccountName("⚠️ Error validating account");
                  formik.setFieldValue("accountName", "");
                } finally {
                  setLoadingAccount(false); // stop loading
                }
              } else {
                setAccountName("");
                formik.setFieldValue("accountName", "");
              }
            };

            fetchAccountName();
          }, [formik.values.ClientsAccountNumber, formik.values.bankName]);

          return (
            <Form className="space-y-6 w-full">
              <SearchSelect
                name="client"
                label="Select Client"
                placeholder="Search by name or phone number"
                fetchClients={fetchClients}
              />

              {/* Loan Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <img src={moneyIcon} alt="money icon" />
                  <h1 className="text-[18px] font-medium text-gray-700">
                    Loan Details
                  </h1>
                </div>

                <TextInput
                  name="loanAmount"
                  type="tel"
                  label="Loan Amount"
                  placeholder="Enter loan amount"
                  amount={true}
                />

                <FormSelect
                  name="loanType"
                  label="Loan Type"
                  options={loanTypes}
                  placeholder="Select Loan Type"
                  icon={<img src={dropDown} alt="icon" />}
                />

                {/* Loan Tenure */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                  <div className="md:w-[80%] w-full">
                    <TextInput
                      name="loanTenure"
                      type="tel"
                      label={
                        formik.values.loanTenureUnit === "monthly"
                          ? "Loan Tenure (Months)"
                          : "Loan Tenure (Years)"
                      }
                      placeholder={
                        formik.values.loanTenureUnit === "monthly"
                          ? "e.g. 12 months"
                          : "e.g. 2 years"
                      }
                    />
                  </div>
                  <div className="md:w-[20%] w-full">
                    <FormSelect
                      name="loanTenureUnit"
                      label="."
                      options={loanTenureOptions}
                      placeholder="Monthly / Yearly"
                      icon={<img src={dropDown} alt="icon" />}
                    />
                  </div>
                </div>

                {/* Account Details */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="md:w-1/2 w-full">
                      <TextInput
                        name="ClientsAccountNumber"
                        type="tel"
                        label="Client’s Account Number"
                        placeholder="Enter 10-digit account number"
                      />
                    </div>
                    <div className="md:w-1/2 w-full">
                      <FormSelect
                        name="bankName"
                        label="Bank Name"
                        options={bankOptions}
                        placeholder="Select bank"
                        icon={<img src={dropDown} alt="icon" />}
                      />
                    </div>
                  </div>

                  <p className="text-[14px] leading-[145%] text-gray-500">
                    {loadingAccount
                      ? "⏳ Validating account..."
                      : accountName
                      ? `✅ Account Name: ${accountName}`
                      : "Customer’s name will display here after validation"}
                  </p>
                  <ErrorMessage
                    name="accountName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <FormSelect
                  name="repaymentFrequency"
                  label="Repayment Frequency"
                  options={replaymentOptions}
                  placeholder="Monthly"
                  icon={<img src={dropDown} alt="icon" />}
                />

                {/* Interest Rate (Auto-filled & Disabled) */}
                <TextInput
                  name="interestRate"
                  type="number"
                  label="Interest Rate (%)"
                  disabled
                  value={formik.values.interestRate}
                />

                {/* Repayment Start Date */}
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-medium text-gray-900">
                    Repayment Start Date
                  </label>
                  <Field name="rsd">
                    {({ field, form }: FieldProps) => (
                      <DatePicker
                        value={field.value || null}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        disableFuture
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(form.touched.rsd && form.errors.rsd),
                          },
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="rsd"
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

              {/* Collateral Section (only if loanType requires it) */}
              {loanTypeConfig?.collateral && (
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
                      placeholder="Describe collateral"
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
                  </div>

                  <FileDropzone
                    name="Document"
                    label="Upload Supporting Documents"
                    accept={{
                      "image/*": [".jpg", ".jpeg", ".png"],
                      "application/pdf": [".pdf"],
                    }}
                    maxSizeMB={5}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex md:flex-row flex-col-reverse gap-4 justify-end">
                <Button
                  variant="outline"
                  width="md:w-[102px] w-full"
                  height="h-14"
                >
                  Cancel
                </Button>
                <Button
                  icon={<img src={draft} />}
                  iconPosition="left"
                  variant="muted"
                  width="md:w-[167px] w-full"
                  height="h-14"
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  icon={<img src={add} />}
                  iconPosition="left"
                  width="md:w-[187px] w-full"
                  height="h-14"
                >
                  Submit Request
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

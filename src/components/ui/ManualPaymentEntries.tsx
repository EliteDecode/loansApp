import React from "react";
import SearchSelect from "./SearchSelect";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Button from "../Button/Button";
import TextInput from "../TextInput/TextInput";
import FormDatePicker from "../FormDatePicker/FormDatePicker";
import FormSelect from "../FormSelect/FormSelect";
import dropDown from "@/assets/icons/dropDown.svg";
import check from "@/assets/icons/check.svg";

export default function ManualPaymentEntries() {
  const paymentModes = [
    { value: "cash", label: "Cash" },
    { value: "transfer", label: "Bank Transfer" },
    { value: "pos", label: "POS" },
    { value: "cheque", label: "Cheque" },
  ];

  const loanTypes = [
    { value: "personal", label: "Personal Loan" },
    { value: "business", label: "Business Loan" },
    { value: "salary", label: "Salary Advance" },
    { value: "micro", label: "Micro Loan" },
  ];

  const validationSchema = Yup.object({
    client: Yup.object().nullable().required("Please select a client"),

    loanAmount: Yup.number()
      .typeError("Loan amount must be a number")
      .positive("Loan amount must be greater than 0")
      .min(1000, "Minimum loan amount is ₦1,000")
      .max(10000000, "Maximum loan amount is ₦10,000,000")
      .required("Please enter loan amount"),

    repaymentDate: Yup.date()
      .nullable()
      .required("Please select a repayment date")
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)), // normalized today
        "Repayment date cannot be in the past"
      ),

    loanType: Yup.string()
      .oneOf(
        loanTypes.map((o) => o.value),
        "Invalid loan type"
      )
      .required("Please select a loan type"),

    paymentMode: Yup.string()
      .oneOf(
        paymentModes.map((o) => o.value),
        "Invalid payment mode"
      )
      .required("Please select a payment mode"),

    notes: Yup.string()
      .max(500, "Notes cannot exceed 500 characters")
      .nullable(),
  });

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

  return (
    <div className="bg-white">
      <Formik
        initialValues={{
          client: null,
          loanAmount: "",
          loanType: "",
          repaymentDate: null,
          paymentMode: "",
          notes: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form submitted:", values);
        }}
      >
        {(formik) => (
          <Form className="space-y-10 w-full">
            <div className="space-y-4">
              <SearchSelect
                name="client"
                label="Select Client"
                placeholder="Search by name or phone number"
                fetchClients={fetchClients}
              />

              <TextInput
                name="loanAmount"
                label="Loan Amount"
                placeholder="Enter amount"
                type="tel"
                amount
              />

              <FormDatePicker
                name="repaymentDate"
                label="Repayment Date"
                // disableFuture
              />

              <FormSelect
                name="loanType"
                label="Loan Type"
                options={loanTypes}
                placeholder="Select loan type"
                icon={<img src={dropDown} alt="icon" />}
              />

              <FormSelect
                name="paymentMode"
                label="Payment Mode"
                options={paymentModes}
                placeholder="Select payment mode"
                icon={<img src={dropDown} alt="icon" />}
              />

              {/* Notes field */}
              <div className="w-full flex-col flex gap-1">
                <label
                  htmlFor="notes"
                  className="text-[16px] leading-[145%] font-medium text-gray-900"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className={`resize-none h-[98px] p-4 rounded-[6px] border outline-primary ${
                    formik.touched.notes && formik.errors.notes
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter additional notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.notes && formik.errors.notes && (
                  <span className="text-sm text-red-500">
                    {formik.errors.notes}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button
                iconPosition="left"
                icon={<img src={check} />}
                type="submit"
                width="w-full sm:w-auto h-14 px-4"
              >
                Mark as Paid
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

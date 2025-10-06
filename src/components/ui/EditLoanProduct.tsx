import receipt from "@/assets/icons/receipt.svg";
import shield from "@/assets/icons/shield-primary.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import SelectInput from "../SelectInput/SelectInput";
import { useDispatch } from "react-redux";
import { updateLoanProduct } from "@/services/features"; // 👈 import your update thunk
import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";
import type { AppDispatch } from "@/store";

interface EditLoanValues {
  _id: string;
  productName: string;
  description: string;
  interestRate: number | string;
  minLoanAmount: number | string;
  maxLoanAmount: number | string;
  penaltyRate: number | string;
  minTenure: number | string;
  maxTenure: number | string;
  tenureUnit: string;
  repaymentFrequency: string;
  gracePeriod: number | string;
  requiresCollateral: boolean;
  collateralDescription: string;
}

interface EditLoanProps {
  loanData: EditLoanValues; // 👈 prefill data
  onClose: () => void;
}

const TENURE_LIMITS = {
  days: 30,
  months: 12,
  years: 10,
};

const validationSchema = Yup.object().shape({
  productName: Yup.string().min(3).required("Product name is required"),
  description: Yup.string().required("Description is required"),
  interestRate: Yup.number()
    .typeError("Interest rate must be a number")
    .min(1)
    .max(100)
    .required(),
  minLoanAmount: Yup.number()
    .typeError("Min loan amount must be a number")
    .min(1000)
    .required(),
  maxLoanAmount: Yup.number()
    .typeError("Max loan amount must be a number")
    .moreThan(Yup.ref("minLoanAmount"))
    .required(),
  penaltyRate: Yup.number().typeError("Penalty rate must be a number").min(0),
  tenureUnit: Yup.string().required(),
  minTenure: Yup.number()
    .typeError("Min tenure must be a number")
    .min(1)
    .required(),
  maxTenure: Yup.number()
    .typeError("Max tenure must be a number")
    .moreThan(Yup.ref("minTenure"))
    .required(),
  repaymentFrequency: Yup.string().required(),
  gracePeriod: Yup.number()
    .typeError("Grace period must be a number")
    .min(0)
    .required(),
  requiresCollateral: Yup.boolean(),
  collateralDescription: Yup.string().when("requiresCollateral", {
    is: true,
    then: (schema) =>
      schema.min(5, "Collateral description must be at least 5 characters"),
  }),
});

export default function EditLoanProduct({ loanData, onClose }: EditLoanProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Formik
      enableReinitialize
      initialValues={loanData}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const payload = {
            productId: loanData._id, // ✅ keep the original ID
            data: {
              productName: values.productName,
              description: values.description,
              interestRate: values.interestRate,
              minLoanAmount: values.minLoanAmount,
              maxLoanAmount: values.maxLoanAmount,
              penaltyRate: values.penaltyRate,
              minTenure: values.minTenure,
              maxTenure: values.maxTenure,
              tenureUnit: values.tenureUnit,
              repaymentFrequency: values.repaymentFrequency,
              gracePeriod: values.gracePeriod,
              requiresCollateral: values.requiresCollateral,
              collateralDescription: values.collateralDescription,
            },
          };

          const res = await dispatch(updateLoanProduct(payload)).unwrap();
          showSuccessToast(res?.message || "Loan product updated successfully");
          onClose();
        } catch (err: any) {
          const message =
            err?.message ||
            err?.response?.data?.message ||
            "Failed to update loan product. Try again.";
          showErrorToast(message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, dirty }) => (
        <Form className="space-y-6 max-h-[80vh] overflow-auto">
          <div className="flex items-center gap-2">
            <img src={receipt} alt="receipt icon" />
            <h1 className="text-[18px] leading-[145%] font-medium text-primary">
              Edit Loan Product
            </h1>
          </div>

          <Field name="productName" label="Product Name *" as={TextInput} />
          <Field name="description" label="Description *" as={TextInput} />

          <TextInput
            label="Interest Rate (%)"
            name="interestRate"
            type="tel"
            placeholder="Enter rate"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Field
              name="minLoanAmount"
              label="Min Loan Amount (₦) *"
              as={TextInput}
              type="tel"
              amount
            />
            <Field
              name="maxLoanAmount"
              label="Max Loan Amount (₦) *"
              as={TextInput}
              type="tel"
              amount
            />
          </div>

          <Field
            name="penaltyRate"
            label="Penalty Rate (%) *"
            as={TextInput}
            type="tel"
          />

          <Field name="tenureUnit" as={SelectInput} label="Tenure Unit *">
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <TextInput
              name="minTenure"
              label={`Min Tenure (${values.tenureUnit}) *`}
              type="tel"
              max={
                TENURE_LIMITS[values.tenureUnit as keyof typeof TENURE_LIMITS]
              }
            />
            <TextInput
              name="maxTenure"
              label={`Max Tenure (${values.tenureUnit}) *`}
              type="tel"
              max={
                TENURE_LIMITS[values.tenureUnit as keyof typeof TENURE_LIMITS]
              }
            />
          </div>

          <Field
            name="repaymentFrequency"
            as={SelectInput}
            label="Repayment Frequency *"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Field>

          <TextInput
            name="gracePeriod"
            label="Grace Period (days) *"
            type="tel"
          />

          {/* Collateral Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src={shield} alt="shield icon" />
              <h1 className="text-[18px] leading-[145%] font-medium text-primary">
                Collateral Requirement
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="requiresCollateral"
                className="border-[1.5px] border-gray-300 w-6 h-6 rounded accent-primary"
              />
              <label className="text-[14px] leading-[145%] text-gray-600">
                Require Collateral for this loan
              </label>
            </div>

            {values.requiresCollateral && (
              <div className="flex flex-col gap-1 text-[14px] leading-[145%] w-full">
                <label
                  htmlFor="collateralDescription"
                  className="font-medium text-gray-900"
                >
                  Collateral Description *
                </label>

                <Field name="collateralDescription">
                  {({ field }: { field: any }) => (
                    <textarea
                      {...field}
                      id="collateralDescription"
                      placeholder="Describe the collateral..."
                      rows={4}
                      className="resize-none h-auto max-h-40 overflow-y-auto border border-gray-300 rounded-[6px] p-4 outline-primary placeholder:text-gray-400 focus:border-primary"
                    />
                  )}
                </Field>

                <ErrorMessage
                  name="collateralDescription"
                  component="span"
                  className="text-red-500 text-xs"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !dirty} // ✅ Disable if form untouched or submitting
            >
              {isSubmitting
                ? "Updating..."
                : dirty
                ? "Update Loan"
                : "No Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

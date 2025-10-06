import receipt from "@/assets/icons/receipt.svg";
import shield from "@/assets/icons/shield-primary.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import SelectInput from "../SelectInput/SelectInput";
import { useDispatch } from "react-redux";
import { createLoanProduct } from "@/services/features";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";
import type { AppDispatch } from "@/store";

interface AddNewLoanValues {
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

interface AddNewLoanProps {
  onClose: () => void;
}

// ✅ Tenure limits
const TENURE_LIMITS = {
  days: 30,
  months: 12,
  years: 10,
};

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  productName: Yup.string()
    .min(3, "Product name must be at least 3 characters")
    .required("Product name is required"),

  description: Yup.string().required("Description is required"),

  interestRate: Yup.number()
    .typeError("Interest rate must be a number")
    .min(1, "Interest rate must be at least 1%")
    .max(100, "Interest rate cannot exceed 100%")
    .required("Interest rate is required"),

  minLoanAmount: Yup.number()
    .typeError("Min loan amount must be a number")
    .min(1000, "Minimum loan amount must be at least ₦1,000")
    .required("Minimum loan amount is required"),

  maxLoanAmount: Yup.number()
    .typeError("Max loan amount must be a number")
    .moreThan(
      Yup.ref("minLoanAmount"),
      "Max amount must be greater than min amount"
    )
    .required("Maximum loan amount is required"),

  penaltyRate: Yup.number()
    .typeError("Penalty rate must be a number")
    .min(0, "Penalty rate cannot be negative")
    .required("Penalty rate is required"),

  tenureUnit: Yup.string()
    .oneOf(["days", "months", "years"], "Invalid tenure unit")
    .required("Tenure unit is required"),

  // ✅ Validate minTenure based on tenureUnit
  minTenure: Yup.number()
    .typeError("Min tenure must be a number")
    .min(1, "Min tenure must be at least 1")
    .when("tenureUnit", (tenureUnit, schema) => {
      const tenureKey = Array.isArray(tenureUnit) ? tenureUnit[0] : tenureUnit;
      const limit = TENURE_LIMITS[tenureKey as keyof typeof TENURE_LIMITS];
      return schema.max(
        limit,
        `For ${tenureUnit}, min tenure cannot exceed ${limit} ${tenureUnit}`
      );
    })
    .required("Minimum tenure is required"),

  // ✅ Validate maxTenure based on tenureUnit and minTenure
  maxTenure: Yup.number()
    .typeError("Max tenure must be a number")
    .moreThan(
      Yup.ref("minTenure"),
      "Max tenure must be greater than min tenure"
    )
    .when("tenureUnit", (tenureUnit, schema) => {
      const tenureKey = Array.isArray(tenureUnit) ? tenureUnit[0] : tenureUnit;
      const limit = TENURE_LIMITS[tenureKey as keyof typeof TENURE_LIMITS];
      return schema.max(
        limit,
        `For ${tenureUnit}, max tenure cannot exceed ${limit} ${tenureUnit}`
      );
    })
    .required("Maximum tenure is required"),

  repaymentFrequency: Yup.string()
    .oneOf(["daily", "weekly", "monthly"], "Invalid repayment frequency")
    .required("Repayment frequency is required"),

  gracePeriod: Yup.number()
    .typeError("Grace period must be a number")
    .min(0, "Grace period cannot be negative")
    .required("Grace period is required"),

  requiresCollateral: Yup.boolean(),

  collateralDescription: Yup.string().when("requiresCollateral", {
    is: true,
    then: (schema) =>
      schema
        .min(5, "Collateral description must be at least 5 characters")
        .required("Collateral description is required"),
  }),
});

export default function AddNewLoan({ onClose }: AddNewLoanProps) {
  const dispatch = useDispatch<AppDispatch>();
  const initialValues: AddNewLoanValues = {
    productName: "",
    description: "",
    interestRate: "",
    minLoanAmount: "",
    maxLoanAmount: "",
    penaltyRate: "",
    minTenure: "",
    maxTenure: "",
    tenureUnit: "days",
    repaymentFrequency: "daily",
    gracePeriod: "",
    requiresCollateral: false,
    collateralDescription: "",
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        console.log(values);
        try {
          const res = await dispatch(createLoanProduct(values)).unwrap();
          showSuccessToast(res?.message); // friendly message
          resetForm();
          onClose();
        } catch (err: any) {
          const message =
            err?.message ||
            err?.response?.data?.message ||
            "Failed to create loan product. Try again.";
          showErrorToast(message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className="space-y-6 max-h-[80vh] overflow-auto">
          <div className="flex items-center gap-2">
            <img src={receipt} alt="receipt icon" />
            <h1 className="text-[18px] leading-[145%] font-medium text-primary">
              Loan Product Details
            </h1>
          </div>

          <Field name="productName" label="Product Name *" as={TextInput} />
          <Field name="description" label="Description *" as={TextInput} />

          <TextInput
            label="Interest Rate (%)"
            name="interestRate"
            type="tel"
            min={0}
            max={100}
            placeholder="Enter rate"
          />

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <Field
              name="minLoanAmount"
              label="Min Loan Amount (₦) *"
              as={TextInput}
              type="tel"
              amount={true}
            />
            <Field
              name="maxLoanAmount"
              label="Max Loan Amount (₦) *"
              as={TextInput}
              type="tel"
              amount={true}
            />
          </div>

          <Field
            name="penaltyRate"
            label="Penalty Rate (%) *"
            as={TextInput}
            type="tel"
            min={0}
            max={100}
          />

          <Field name="tenureUnit" as={SelectInput} label="Tenure Unit *">
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </Field>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
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
            max={365}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Loan"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

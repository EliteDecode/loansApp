import receipt from "@/assets/icons/receipt.svg";
import shield from "@/assets/icons/shield-primary.svg";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import SelectInput from "../SelectInput/SelectInput";

// ✅ Define form values type
interface AddNewLoanValues {
  roleName: string;
  description: string;
  interest: string;
  minTenure: string;
  repaymentFrequency: string;
  status: string;
  penaltyRate: string;
  requireCollateral: boolean;
  collateralTypes: {
    idCard: boolean;
    landDocument: boolean;
    bankGuarantee: boolean;
    carDocument: boolean;
    houseDocument: boolean;
    salaryCertificate: boolean;
  };
}

// ✅ Props type
interface AddNewLoanProps {
  onClose: () => void;
}

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  roleName: Yup.string()
    .min(3, "Role name must be at least 3 characters")
    .required("Role name is required"),
  description: Yup.string().required("Description is required"),
  interest: Yup.number()
    .typeError("Interest must be a number")
    .min(1, "Must be at least 1%")
    .required("Interest rate is required"),
  minTenure: Yup.number()
    .typeError("Tenure must be a number")
    .min(1, "Must be at least 1 month")
    .required("Minimum tenure is required"),
  repaymentFrequency: Yup.string().required("Repayment frequency is required"),
  status: Yup.string().required("Status is required"),
  penaltyRate: Yup.number()
    .typeError("Penalty must be a number")
    .min(0, "Penalty cannot be negative")
    .optional(),

  requireCollateral: Yup.boolean(),
  collateralTypes: Yup.object().when("requireCollateral", {
    is: true,
    then: (schema) =>
      schema.test(
        "at-least-one-selected",
        "At least one collateral type must be selected",
        (value) => Object.values(value || {}).some((val) => val === true)
      ),
  }),
});

const collateralTypes = [
  { name: "idCard", label: "ID Card" },
  { name: "landDocument", label: "Land Document" },
  { name: "bankGuarantee", label: "Bank Guarantee" },
  { name: "carDocument", label: "Car Document" },
  { name: "houseDocument", label: "House Document" },
  { name: "salaryCertificate", label: "Salary Certificate" },
];

export default function AddNewLoan({ onClose }: AddNewLoanProps) {
  const initialValues: AddNewLoanValues = {
    roleName: "",
    description: "",
    interest: "",
    minTenure: "",
    repaymentFrequency: "",
    status: "",
    penaltyRate: "",
    requireCollateral: false,
    collateralTypes: {
      idCard: false,
      landDocument: false,
      bankGuarantee: false,
      carDocument: false,
      houseDocument: false,
      salaryCertificate: false,
    },
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        console.log("✅ Form Submitted:", values);
        resetForm({ values });
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className="space-y-6 max-h-[80vh] overflow-auto">
          {/* Financial Settings */}
          <div className="flex items-center gap-2">
            <img src={receipt} />
            <h1 className="text-[18px] leading-[145%] font-medium text-primary">
              Financial Settings
            </h1>
          </div>

          <Field name="interest" label="Interest Rate (%) *" as={TextInput} />
          <Field
            name="minTenure"
            label="Min Tenure (months) *"
            as={TextInput}
          />
          <Field
            name="repaymentFrequency"
            label="Repayment Frequency *"
            as={TextInput}
          />

          <Field name="status" as={SelectInput} label="Status">
            <option value="" disabled className="text-gray-400">
              Select repayment type
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Field>

          <Field name="penaltyRate" label="Penalty Rate (%)" as={TextInput} />

          {/* Collateral Requirements */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src={shield} />
              <h1 className="text-[18px] leading-[145%] font-medium text-primary">
                Collateral Requirements
              </h1>
            </div>

            {/* Require Collateral Checkbox */}
            <div className="flex items-center gap-2">
              <Field
                type="checkbox"
                name="requireCollateral"
                className="border-[1.5px] border-gray-300 w-6 h-6 rounded accent-primary"
              />
              <label className="text-[14px] leading-[145%] text-gray-600">
                Require Collateral for this loan product
              </label>
            </div>

            {/* ✅ Show collateralTypes only if checkbox is checked */}
            {values.requireCollateral && (
              <div>
                <p className="font-medium text-gray-800">
                  Accepted Collateral Types
                </p>
                <div className="space-y-4 mt-2 grid md:grid-cols-2 grid-cols-1">
                  {collateralTypes.map((perm) => (
                    <label
                      key={perm.name}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Field
                        type="checkbox"
                        name={`collateralTypes.${perm.name}`}
                        className="border-[1.5px] border-gray-300 w-6 h-6 rounded accent-primary"
                      />
                      <span className="text-[14px] leading-[145%] text-gray-600">
                        {perm.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
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

import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import { Field, Form, Formik } from "formik";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import * as Yup from "yup";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";
import { useDispatch } from "react-redux";
import { updateStaffSalary } from "@/services/features";
import type { AppDispatch } from "@/store";

// ✅ Define form values type
interface EditSalaryValues {
  newMonthlySalary: string;
  reason: string;
}

interface StaffData {
  staffId: string;
  staffName: string;
  staffType: "creditAgent" | "manager" | "director";
  currentSalary: number;
  staffEmail: string;
  _id: string;
}

interface EditSalaryProps {
  onClose: () => void;
  staff: StaffData;
}

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  newMonthlySalary: Yup.string().required("New salary is required"),
  reason: Yup.string()
    .min(10, "Reason must be at least 10 characters")
    .max(200, "Reason cannot exceed 200 characters")
    .required("Reason is required"),
});

export default function EditSalaryModal({ onClose, staff }: EditSalaryProps) {
  const initialValues: EditSalaryValues = {
    newMonthlySalary: "",
    reason: "",
  };

  const dispatch = useDispatch<AppDispatch>();

  const { staffType, staffId } = staff;

  // Color and label mapping by staff type
  const typeStyles: Record<string, string> = {
    manager: "bg-[#8B15C21A] text-[#8B15C2]",
    creditAgent: "bg-[#0088FF1A] text-[#0088FF]",
    director: "bg-[#FF7A001A] text-[#FF7A00]",
  };

  return (
    <div className="space-y-6 leading-[145%]">
      {/* Header Info */}
      <div className="flex gap-6 items-center  pb-4">
        <img
          src={profileImage}
          alt={staff.staffName}
          className="h-20 w-20 object-cover rounded-full shadow-sm"
        />

        <div className="space-y-1">
          <h6 className="text-[20px] leading-[120%] tracking-[-2%] font-semibold text-gray-800">
            {staff.staffName}
          </h6>
          <p className="text-[14px] text-gray-500">
            {staff.staffType.charAt(0).toUpperCase() + staff.staffType.slice(1)}{" "}
            ID: #{staff.staffId.slice(-4).toUpperCase()}
          </p>
          <p
            className={`px-3 py-1 text-[12px] font-medium leading-[145%] rounded-[12px] w-fit capitalize ${
              typeStyles[staff.staffType] || "bg-gray-100 text-gray-600"
            }`}
          >
            {staff.staffType.replace(/([A-Z])/g, " $1")}
          </p>
        </div>
      </div>

      {/* Current Salary */}
      <div className="space-y-1 text-gray-700">
        <p className="text-[15px]">Current Salary</p>
        <h6 className="text-[20px] font-semibold">
          ₦{staff.currentSalary?.toLocaleString() || "0"}
        </h6>
      </div>

      {/* Form */}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const payload = {
              staffId,
              staffType,
              currentSalary: Number(values.newMonthlySalary),
              updateReason: values.reason,
            };

            const res = await dispatch(updateStaffSalary(payload)).unwrap();
            showSuccessToast(res?.message || "Salary updated successfully!");
            resetForm();
            onClose();
          } catch (err: any) {
            const message =
              err?.message || "Failed to update salary. Please try again.";
            showErrorToast(message);
          }
        }}
      >
        {({
          isSubmitting,
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
        }) => (
          <Form className="space-y-6 max-h-[70vh] overflow-auto pr-1">
            {/* New Salary */}
            <Field
              name="newMonthlySalary"
              label="New Monthly Salary"
              placeholder="Enter new salary"
              as={TextInput}
              amount={true}
              type="tel"
            />

            {/* Reason textarea */}
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="reason"
                className="text-[15px] font-medium text-gray-700"
              >
                Reason for Change
              </label>
              <textarea
                id="reason"
                name="reason"
                className={`resize-none h-[100px] p-3 rounded-[6px] border focus:outline-primary transition ${
                  touched.reason && errors.reason
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter reason for salary change"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.reason && errors.reason && (
                <span className="text-xs text-red-500">{errors.reason}</span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 ">
              <Button variant="outline" type="button" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

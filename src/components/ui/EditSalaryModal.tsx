import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import { Field, Form, Formik } from "formik";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import * as Yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// ✅ Define form values type
interface EditSalaryValues {
  newMonthlySalary: string;
  date: any | null; // or Dayjs | null if you want strict typing
  reason: string;
}
interface EditSalaryProps {
  onClose: () => void;
}

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  newMonthlySalary: Yup.string().required("New salary is required"),
  date: Yup.date().nullable().required("Effective date is required"),
  reason: Yup.string()
    .max(200, "Reason cannot exceed 200 characters")
    .optional(),
});

export default function EditSalaryModal({ onClose }: EditSalaryProps) {
  const value = "Manager";

  const initialValues: EditSalaryValues = {
    newMonthlySalary: "",
    date: null,
    reason: "",
  };

  return (
    <div className="leading-[145%] space-y-6">
      <div className="flex gap-6">
        <img
          src={profileImage}
          alt=""
          className="h-20 w-20 object-cover rounded-[40px]"
        />

        <div className="space-y-2">
          <h6 className="text-[20px] leading-[120%] tracking-[-2%] font-semibold text-gray-700">
            Adebayo Olumide
          </h6>
          <p className="text-[14px] text-gray-500">Manager ID: #MG001</p>
          <p
            className={`px-3 py-1 text-[12px] leading-[145%] rounded-[12px] w-fit ${
              {
                Manager: "bg-[#8B15C21A] text-[#8B15C2]",
                Agent: "bg-[#0088FF1A] text-[#0088FF]",
              }[value] || "bg-gray-100 text-gray-600"
            }`}
          >
            {value}
          </p>
        </div>
      </div>

      <div className="space-y-2 leading-[145%] text-gray-600">
        <p className="text-[16px]">Current Salary</p>
        <h6 className="text-[18px] font-semibold">₦450,000</h6>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log("✅ Form Submitted:", values);
          resetForm({ values });
          onClose();
        }}
      >
        {({
          isSubmitting,
          values,
          setFieldValue,
          touched,
          errors,
          handleChange,
          handleBlur,
        }) => (
          <Form className="space-y-6 max-h-[80vh] overflow-auto">
            <Field
              name="newMonthlySalary"
              label="New Monthly Salary"
              placeholder="Enter new salary"
              as={TextInput}
              amount={true}
              type="tel"
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Effective Date
                </label>
                <DatePicker
                  value={values.date}
                  onChange={(newValue) => {
                    setFieldValue("date", newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: touched.date && Boolean(errors.date),
                      helperText:
                        touched.date && typeof errors.date === "string"
                          ? errors.date
                          : undefined,
                    },
                  }}
                />
              </div>
            </LocalizationProvider>

            {/* Reason textarea */}
            <div className="w-full flex-col flex gap-1">
              <label
                htmlFor="reason"
                className="text-[16px] leading-[145%] font-medium text-gray-900"
              >
                Reason for Change (Optional)
              </label>
              <textarea
                id="reason"
                name="reason"
                className={`resize-none h-[98px] p-4 rounded-[6px] border outline-primary ${
                  touched.reason && errors.reason
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter reason"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.reason && errors.reason && (
                <span className="text-sm text-red-500">{errors.reason}</span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Salary"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

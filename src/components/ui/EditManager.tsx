import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import SelectInput from "../SelectInput/SelectInput";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";

// ✅ Form values type
interface FormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  status: string;
}

// ✅ Props type
interface EditManagerProps {
  data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    status?: string;
  };
  onCancel?: () => void;
  onSave?: (values: FormValues) => void;
}

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be digits only")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  status: Yup.string().required("Status is required"),
});

export default function EditManager({
  data,
  onCancel,
  onSave,
}: EditManagerProps) {
  const initialValues: FormValues = {
    fullName: data?.name || "",
    email: data?.email || "",
    phoneNumber: data?.phoneNumber || "",
    status: data?.status || "",
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        console.log("✅ Form Submitted:", values);
        onSave?.(values);
        resetForm({ values });
      }}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className="space-y-6">
          {/* Full Name */}
          <Field name="fullName" label="Full Name" as={TextInput} />

          {/* Email */}
          <Field name="email" label="Email Address" as={TextInput} />

          {/* Phone Number */}
          <Field
            name="phoneNumber"
            label="Phone Number"
            as={TextInput}
            type="tel"
          />

          {/* Status Select */}
          <Field name="status" as={SelectInput} label="Status">
            <option value="" disabled className="text-gray-400">
              Select status type
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Field>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !dirty || !isValid}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

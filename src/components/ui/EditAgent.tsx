import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";
import SelectInput from "../SelectInput/SelectInput";

// ✅ Define form values type
interface EditAgentValues {
  fullName: string;
  agentID: string;
  email: string;
  phoneNumber: string;
  status: string;
}

// ✅ Props type
interface EditAgentProps {
  data: {
    name?: string;
    AgentID?: string;
    email?: string;
    phoneNumber?: string;
    status?: string;
  };
  onCancel?: () => void;
  onSave?: (values: EditAgentValues) => void;
}

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  agentID: Yup.string().required("Agent ID is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be digits only")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  status: Yup.string().required("Status is required"),
});

export default function EditAgent({ data, onCancel, onSave }: EditAgentProps) {
  const initialValues: EditAgentValues = {
    fullName: data?.name || "",
    agentID: data?.AgentID || "",
    email: data?.email || "",
    phoneNumber: data?.phoneNumber || "",
    status: data?.status || "", // 👈 ensures value is set on mount
  };

  return (
    <Formik
      enableReinitialize // 👈 important if "data" comes asynchronously
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        console.log("✅ Form Submitted:", values);
        onSave?.(values);
        resetForm({ values }); // 👈 reset to new saved values
      }}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className="space-y-6">
          {/* Full Name Field */}
          <Field name="fullName" label="Full Name" as={TextInput} />

          {/* Agent ID Field */}
          <Field name="agentID" label="Agent ID" as={TextInput} disabled />

          {/* Email Field */}
          <Field name="email" label="Email Address" as={TextInput} />

          {/* Phone Number Field */}
          <Field name="phoneNumber" label="Phone Number" as={TextInput} />

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
            <Button
              type="submit"
              disabled={isSubmitting || !dirty || !isValid} // 👈 only enabled when modified + valid
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

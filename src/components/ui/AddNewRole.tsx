import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import TextInput from "../TextInput/TextInput";
import Button from "../Button/Button";

// ✅ Define form values type
interface AddNewRoleValues {
  roleName: string;
  description: string;
  permissions: {
    viewLoans: boolean;
    approveLoans: boolean;
    editClients: boolean;
    manageAgents: boolean;
    viewReports: boolean;
    generateReports: boolean;
    settingAccess: boolean;
    userManagement: boolean;
    systemConfig: boolean;
    recordPayments: boolean;
  };
}

// ✅ Props type
interface AddNewRoleProps {
  onClose: () => void;
}

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  roleName: Yup.string()
    .min(3, "Role name must be at least 3 characters")
    .required("Role name is required"),
  description: Yup.string().required("Description is required"),
});

// ✅ Custom textarea field
function DescriptionField() {
  const formik = useFormikContext<AddNewRoleValues>();

  return (
    <div className="w-full flex-col flex gap-1">
      <label
        htmlFor="description"
        className="text-[16px] leading-[145%] font-medium text-gray-900"
      >
        Description
      </label>
      <textarea
        id="description"
        name="description"
        className={`resize-none h-[98px] p-4 rounded-[6px] border outline-primary ${
          formik.touched.description && formik.errors.description
            ? "border-red-500"
            : "border-gray-300"
        }`}
        placeholder="Enter role description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.description && formik.errors.description && (
        <span className="text-sm text-red-500">
          {formik.errors.description}
        </span>
      )}
    </div>
  );
}

// ✅ Permissions list
const permissionsList = [
  { name: "viewLoans", label: "View Loans" },
  { name: "approveLoans", label: "Approve Loans" },
  { name: "editClients", label: "Edit Clients" },
  { name: "manageAgents", label: "Manage Agents" },
  { name: "viewReports", label: "View Reports" },
  { name: "generateReports", label: "Generate Reports" },
  { name: "settingAccess", label: "Setting Access" },
  { name: "userManagement", label: "User Management" },
  { name: "systemConfig", label: "System Configuration" },
  { name: "recordPayments", label: "Record Payments" },
];

export default function AddNewRole({ onClose }: AddNewRoleProps) {
  const initialValues: AddNewRoleValues = {
    roleName: "",
    description: "",
    permissions: {
      viewLoans: false,
      approveLoans: false,
      editClients: false,
      manageAgents: false,
      viewReports: false,
      generateReports: false,
      settingAccess: false,
      userManagement: false,
      systemConfig: false,
      recordPayments: false,
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
      {({ isSubmitting }) => (
        <Form className="space-y-6 max-h-[80vh] overflow-y-auto h-full">
          <Field
            name="roleName"
            label="Role Name*"
            placeholder="e.g. Credit Agent"
            as={TextInput}
          />
          <DescriptionField />

          {/* Permissions */}
          <div className="space-y-6">
            <h1 className="text-[18px] leading-[145%] font-medium text-primary">
              Permissions Matrix
            </h1>

            <div className="space-y-4">
              {permissionsList.map((perm) => (
                <label
                  key={perm.name}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Field
                    type="checkbox"
                    name={`permissions.${perm.name}`}
                    className="border-[1.5px] border-gray-300 w-6 h-6 rounded accent-primary"
                  />
                  <span className="text-[14px] leading-[145%] text-gray-600">
                    {perm.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Role"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

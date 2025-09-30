// import userIcon from "@/assets/icons/user.svg";
// import lockIcon from "@/assets/icons/lock.svg";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/TextInput/TextInput";
import Button from "@/components/Button/Button";

// ✅ Form values type
interface LoginValues {
  email: string;
  password: string;
}

// ✅ Props type
interface LoginProps {
  onClose?: () => void; // optional if you want a cancel button
  onLogin?: (values: LoginValues) => void;
}

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage({ onClose, onLogin }: LoginProps) {
  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("✅ Login Submitted:", values);
        onLogin?.(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow">
          {/* Section Header */}
          <div className="flex items-center gap-2">
            {/* <img src={userIcon} alt="login" /> */}
            <h1 className="text-[18px] leading-[145%] font-medium text-primary">
              Login to Your Account
            </h1>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            {/* <img src={userIcon} alt="email" className="w-5 h-5" /> */}
            <Field
              name="email"
              type="email"
              label="Email Address *"
              as={TextInput}
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-2">
            {/* <img src={lockIcon} alt="password" className="w-5 h-5" /> */}
            <Field
              name="password"
              type="password"
              label="Password *"
              as={TextInput}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            {onClose && (
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

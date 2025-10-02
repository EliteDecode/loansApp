import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button/Button";
import logo from "@/assets/icons/logo.svg";
import mail from "@/assets/icons/mail.svg";
import eyeClosed from "@/assets/icons/eyeClosed.svg";

// ✅ Load background correctly
const bgImage = new URL(
  "../../assets/icons/gradient-lines.svg",
  import.meta.url
).href;

// ✅ Form values type
interface LoginValues {
  email: string;
  password: string;
}

interface LoginProps {
  onClose?: () => void;
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
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-no-repeat bg-[linear-gradient(180deg,#002D62_0%,#00295A_50%,rgba(0,100,0,0.5)_100%)] bg-cover bg-center leading-[145%]"
      style={{
        backgroundImage: `linear-gradient(180deg,#002D62_0%,#00295A_50%,rgba(0,100,0,0.5)_100%), url(${bgImage})`,
      }}
    >
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
          <Form className="w-full max-w-md mx-3 bg-white p-8 rounded-2xl shadow-lg space-y-6 text-[14px] leading-[145%]">
            {/* Logo + Text */}
            <div className="flex items-center gap-3 flex-col">
              <div className="h-[120px] w-full flex items-center justify-center">
                <img src={logo} className="w-[290px] h-[96px]" />
              </div>
              <h1 className="text-[16px] font-medium text-gray-500 text-center">
                Enter your credentials to access your account
              </h1>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <img src={mail} alt="mail" />
                </span>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  className="w-full pl-4 pr-10 py-[18px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <ErrorMessage
                name="email"
                component="p"
                className="text-[#CB1A14] text-sm mt-1"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-10 py-[18px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? eyeClosed : eyeClosed}
                    alt="toggle password"
                  />
                </span>
              </div>
              <ErrorMessage
                name="password"
                component="p"
                className="text-[#CB1A14] text-sm mt-1"
              />
            </div>

            {/* Forgot Password */}
            <p className="text-[14px] font-medium text-primary cursor-pointer hover:underline">
              Forgot Password?
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4">
              {onClose && (
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                width="w-full"
                height="h-[55px]"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

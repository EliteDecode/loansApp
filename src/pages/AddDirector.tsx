import {
  Step,
  StepLabel,
  Stepper,
  Box,
  type StepIconProps,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import verified from "@/assets/icons/verifiedBlue.svg";
import Button from "@/components/Button/Button";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  type FieldProps,
  type FormikHelpers,
} from "formik";
import * as Yup from "yup";
import TextInput from "@/components/TextInput/TextInput";
import SelectInput from "@/components/SelectInput/SelectInput";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FileUploadWithProgress from "@/components/FileUploadWithProgress/FileUploadWithProgress";
import ReviewAgentInfo from "@/components/ui/ReviewAgentInfo";
import SuccessModal from "@/components/modals/SuccessModal/SuccessModal";
import ErrorModal from "@/components/modals/ErrorModal/ErrorModal";
import { createDirector, resetDirector } from "@/services/features";
import type { AppDispatch, RootState } from "@/store";
import dayjs from "dayjs";

const steps = [
  "Personal Info",
  "Work & Role Details",
  "Document Uploads",
  "System Access",
  "Review",
];

export interface DirectorFormValues {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  dateOfBirth: Date | null;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  lgaOfResidence: string;
  bankName: string;
  bankAccount: string;
  employmentType: "full-time" | "part-time" | "contract" | "self-employed";
  dateOfEmployment: Date | null;
  validNIN: string;
  utilityBill: string;
  passport: string;
  employmentLetter: string;
  password: string;
  confirmPassword: string;
  salaryAmount: string | number;
}

const initialValues: DirectorFormValues = {
  firstName: "",
  lastName: "",
  gender: "male",
  dateOfBirth: null,
  email: "",
  phoneNumber: "",
  residentialAddress: "",
  stateOfResidence: "",
  lgaOfResidence: "",
  bankName: "",
  bankAccount: "",
  employmentType: "full-time",
  dateOfEmployment: null,
  validNIN: "",
  utilityBill: "",
  passport: "",
  employmentLetter: "",
  password: "",
  confirmPassword: "",
  salaryAmount: "",
};

// ✅ Reusable URL validation for Cloudinary uploads
const urlValidation = (label: string) =>
  Yup.string().url(`Invalid ${label} URL`).required(`${label} is required`);

// Password generator function - 8 characters with alphabet, numbers, and special chars (@#$&)
const generatePassword = (): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "@#$&";

  let password = "";

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill remaining 4 characters with any character from all categories
  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = 0; i < 4; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to randomize positions
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export default function AddDirector() {
  const [activeStep, setActiveStep] = useState(0);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get Redux state for agent creation
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.director
  );
  console.log(message);

  // Clear agent state when component mounts
  useEffect(() => {
    dispatch(resetDirector());
  }, [dispatch]);

  // Handle success state
  useEffect(() => {
    if (isSuccess && message === "Director created successfully") {
      setShowSuccessModal(true);
    }
  }, [isSuccess, message]);

  // Handle error state
  useEffect(() => {
    if (isError && message) {
      setErrorMessage(message);
      setShowErrorModal(true);
    }
  }, [isError, message]);

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    dispatch(resetDirector()); // Clear the success state
    navigate("/director");
  };

  // Handle error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    dispatch(resetDirector()); // Clear the error state
  };

  const handleFinish = async (
    values: DirectorFormValues,
    _helpers?: FormikHelpers<DirectorFormValues>
  ) => {
    // Prepare data for API call
    const directorData = {
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth?.toISOString(),
      email: values.email,
      phoneNumber: values.phoneNumber,
      residentialAddress: values.residentialAddress,
      stateOfResidence: values.stateOfResidence,
      lgaOfResidence: values.lgaOfResidence,
      bankName: values.bankName,
      bankAccount: values.bankAccount,
      employmentType: values.employmentType,
      dateOfEmployment: values.dateOfEmployment?.toISOString(),
      validNIN: values.validNIN,
      utilityBill: values.utilityBill,
      passport: values.passport,
      employmentLetter: values.employmentLetter,
      password: values.password,
      confirmPassword: values.confirmPassword,
      salaryAmount: values.salaryAmount,
    };

    await dispatch(createDirector(directorData));
  };

  const handleNext = async (
    validateForm: () => Promise<Record<string, string>>,
    setTouched: (
      touched: { [field: string]: boolean },
      shouldValidate?: boolean
    ) => void,
    activeStep: number
  ) => {
    const errors = await validateForm();

    // filter errors to only current step
    const stepFields = Object.keys(validationSchemas[activeStep].fields);
    const stepErrors = Object.keys(errors).filter((key) =>
      stepFields.includes(key)
    );

    if (stepErrors.length === 0) {
      setActiveStep((prev) => prev + 1);
    } else {
      setTouched(
        stepErrors.reduce<Record<string, boolean>>((acc, key) => {
          acc[key] = true;
          return acc;
        }, {}),
        true
      );
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // // 🔹 Custom Step Icon props
  // interface CustomStepIconProps {
  //   active: boolean;
  //   completed: boolean;
  //   className?: string;
  // }

  console.log(isLoading);

  function CustomStepIcon({ active, completed }: StepIconProps) {
    if (completed) return <img src={verified} alt="verified" />;
    if (active) return <img src={verified} alt="verified" />;
    return null;
  }

  // 🔹 Validation schemas array
  const validationSchemas = [
    // Step 1: Personal Info
    Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      gender: Yup.string()
        .oneOf(["male", "female"])
        .required("Gender is required"),
      dateOfBirth: Yup.date()
        .nullable()
        .required("Date of birth is required")
        .max(new Date(), "Date of birth cannot be in the future"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: Yup.string()
        .trim()
        .matches(
          /^\+234\d{10}$/,
          "Phone number must be in format +234XXXXXXXXXX"
        )
        .min(14, "Phone number must be at least 14 characters")
        .max(14, "Phone number must not exceed 14 characters")
        .required("Phone number is required"),

      residentialAddress: Yup.string()
        .min(10, "Residential address must be at least 10 characters long.")
        .required("Residential address is required"),
      stateOfResidence: Yup.string()
        .min(2, "State of residence must be at least 2 characters long.")
        .required("State of residence is required"),
      lgaOfResidence: Yup.string()
        .min(2, "LGA of residence must be at least 2 characters long.")
        .required("LGA of residence is required"),
    }),

    // Step 2: Work & Role Details
    Yup.object({
      bankName: Yup.string().required("Bank name is required"),
      bankAccount: Yup.string()
        .matches(/^\d{10}$/, "Bank account must be exactly 10 digits.")
        .required("Bank account is required"),
      employmentType: Yup.string()
        .oneOf(["full-time", "part-time", "contract", "self-employed"])
        .required("Employment type is required"),
      dateOfEmployment: Yup.date()
        .nullable()
        .required("Date of employment is required")
        .max(new Date(), "Date of employment cannot be in the future"),
      salaryAmount: Yup.number()
        .positive("Salary must be positive")
        .required("Salary amount is required"),
    }),

    // Step 3: Document Uploads
    Yup.object({
      validNIN: urlValidation("Valid NIN"),
      utilityBill: urlValidation("Utility Bill"),
      passport: urlValidation("Passport photograph"),
      employmentLetter: urlValidation("Employment Letter"),
    }),

    // Step 4: System Access
    Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$&])[A-Za-z\d@#$&]{8,}$/,
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@#$&)"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
  ];

  return (
    <div className="md:p-8 p-4 pt-0">
      <div className="md:pb-8 mb-4">
        <h1 className="md:text-[28px] text-[18px] md:leading-[120%] leading-[145%] font-semibold tracking-[-2%] text-gray-700">
          Add New Director
        </h1>
      </div>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Stepper
            sx={{
              display: "flex",
              flexWrap: "nowrap", // prevent wrapping to next line
              minWidth: "max-content", // make Stepper width fit content
              "& .MuiStep-root": {
                marginRight: 2, // space between steps
                paddingLeft: 0,
                paddingRight: 0, // 🚀 removes default padding
                "&:last-child": {
                  marginRight: 0, // remove gap for last step
                },
              },
            }}
            activeStep={activeStep}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={CustomStepIcon}
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontWeight: index === activeStep ? "500" : "normal",
                      textWrap: "nowrap",
                      fontSize: {
                        xs: "14px", // mobile
                        sm: "16px", // tablets (optional)
                        md: "18px", // desktop and up
                      },
                      letterSpacing: "145%",
                      color:
                        index === activeStep
                          ? "#002D62" // active text color
                          : index < activeStep
                          ? "#002D62" // completed text color
                          : "#98A2B3", // upcoming text color
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Director Created Successfully!"
        message="The new director has been created successfully and can now access the system with the provided credentials."
        confirmText="View Director"
        onConfirm={handleSuccessModalClose}
      />

      {/* Error Modal */}
      <ErrorModal
        open={showErrorModal}
        onClose={handleErrorModalClose}
        message={errorMessage}
        showRetry={true}
        retryText="Try Again"
        onRetry={handleErrorModalClose}
      />

      {activeStep < steps.length && (
        <div className="mt-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={(values, formikHelpers) => {
              // Only trigger submit if the user clicked "Create Director"
              if (shouldSubmit && activeStep === steps.length - 1) {
                handleFinish(values, formikHelpers);
              } else {
                formikHelpers.setSubmitting(false);
              }
            }}
          >
            {({ validateForm, setTouched }) => (
              <Form className="flex flex-col gap-4">
                {/* step 1 */}
                {activeStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextInput
                        name="firstName"
                        type="text"
                        label="First Name"
                        placeholder="Enter director's first name"
                      />

                      <TextInput
                        name="lastName"
                        type="text"
                        label="Last Name"
                        placeholder="Enter director's last name"
                      />

                      <SelectInput name="gender" label="Gender">
                        <option value="">Select director's gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </SelectInput>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                          Date of Birth
                        </label>
                        <Field name="dateOfBirth">
                          {({ field, form }: FieldProps) => (
                            <DatePicker
                              value={field.value || null}
                              onChange={(val) =>
                                form.setFieldValue(field.name, val)
                              }
                              disableFuture
                              referenceDate={dayjs().startOf("day")}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: Boolean(
                                    form.touched.dateOfBirth &&
                                      form.errors.dateOfBirth
                                  ),
                                },
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="dateOfBirth"
                          component="span"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <TextInput
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="Enter director's email address"
                      />

                      <Field name="phoneNumber">
                        {({ field, form }: FieldProps) => {
                          const formatPhone = (val: string) => {
                            // Remove spaces
                            const cleaned = val.replace(/\s+/g, "");
                            // Ensure it always starts with +234
                            if (!cleaned.startsWith("+234")) return "+234";
                            // Limit total digits to 10 after +234
                            const digits = cleaned
                              .slice(4)
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            // Add spaces for readability
                            let formatted = "+234";
                            if (digits.length > 0)
                              formatted += " " + digits.slice(0, 3);
                            if (digits.length >= 4)
                              formatted += " " + digits.slice(3, 6);
                            if (digits.length >= 7)
                              formatted += " " + digits.slice(6, 10);
                            return formatted;
                          };

                          const handleChange = (
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const formatted = formatPhone(e.target.value);
                            // Remove spaces before storing
                            const rawValue = formatted.replace(/\s+/g, "");
                            form.setFieldValue(field.name, rawValue);
                            form.setFieldTouched(field.name, true);
                          };

                          const displayValue = field.value
                            ? formatPhone(field.value)
                            : "+234";

                          return (
                            <div className="flex flex-col gap-1">
                              <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name={field.name}
                                value={displayValue}
                                onChange={handleChange}
                                placeholder="Enter director's phone number (+234XXXXXXXXXX)"
                                className="w-full h-14 px-4 outline-primary border rounded-[6px] placeholder:text-gray-400 focus:outline-none"
                              />
                              <ErrorMessage
                                name="phoneNumber"
                                component="span"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                          );
                        }}
                      </Field>

                      <TextInput
                        name="residentialAddress"
                        type="text"
                        label="Residential Address"
                        placeholder="Enter director's residential address"
                      />

                      <TextInput
                        name="stateOfResidence"
                        type="text"
                        label="State of Residence"
                        placeholder="Enter director's state of residence"
                      />

                      <TextInput
                        name="lgaOfResidence"
                        type="text"
                        label="LGA of Residence"
                        placeholder="Enter director's LGA of residence"
                      />
                    </div>
                  </div>
                )}

                {/* step 2 */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextInput
                        name="bankName"
                        type="text"
                        label="Bank Name"
                        placeholder="Enter bank name"
                      />

                      <TextInput
                        name="bankAccount"
                        type="text"
                        label="Bank Account Number"
                        placeholder="Enter bank account number"
                      />

                      <SelectInput
                        name="employmentType"
                        label="Employment Type"
                      >
                        <option value="" className="text-gray-400">
                          Select employment type
                        </option>
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="self-employed">Self-Employed</option>
                      </SelectInput>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                          Date of Employment
                        </label>
                        <Field name="dateOfEmployment">
                          {({ field, form }: FieldProps) => (
                            <DatePicker
                              value={field.value || null}
                              onChange={(val) =>
                                form.setFieldValue(field.name, val)
                              }
                              disableFuture
                              referenceDate={dayjs().startOf("day")}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: Boolean(
                                    form.touched.dateOfEmployment &&
                                      form.errors.dateOfEmployment
                                  ),
                                },
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="dateOfEmployment"
                          component="span"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <TextInput
                        name="salaryAmount"
                        type="tel"
                        amount={true}
                        label="Salary Amount"
                        placeholder="Enter salary amount"
                      />
                    </div>
                  </div>
                )}

                {/* step 3 */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Valid NIN */}
                      <div>
                        <Field name="validNIN">
                          {({ field, form }: FieldProps) => (
                            <FileUploadWithProgress
                              label="Valid NIN"
                              accept="image/*,application/pdf"
                              maxSizeMB={5}
                              folder="loan-app/directors"
                              value={field.value}
                              onFileUploaded={(url) => {
                                form.setFieldValue(field.name, url);
                                form.setFieldTouched(field.name, true);
                                form.setFieldError(field.name, "");
                              }}
                              onUploadError={(error) => {
                                form.setFieldError(field.name, error);
                              }}
                              onClearError={() =>
                                form.setFieldError(field.name, "")
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="validNIN"
                          component="span"
                          className="text-red-500 text-xs block mt-1"
                        />
                      </div>

                      {/* Utility Bill */}
                      <div>
                        <Field name="utilityBill">
                          {({ field, form }: FieldProps) => (
                            <FileUploadWithProgress
                              label="Utility Bill"
                              accept="image/*,application/pdf"
                              maxSizeMB={5}
                              folder="loan-app/directors"
                              value={field.value}
                              onFileUploaded={(url) => {
                                form.setFieldValue(field.name, url);
                                form.setFieldTouched(field.name, true);
                                form.setFieldError(field.name, "");
                              }}
                              onUploadError={(error) => {
                                form.setFieldError(field.name, error);
                              }}
                              onClearError={() =>
                                form.setFieldError(field.name, "")
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="utilityBill"
                          component="span"
                          className="text-red-500 text-xs block mt-1"
                        />
                      </div>

                      {/* Passport */}
                      <div>
                        <Field name="passport">
                          {({ field, form }: FieldProps) => (
                            <FileUploadWithProgress
                              label="Passport photograph"
                              accept="image/*,application/pdf"
                              maxSizeMB={5}
                              folder="loan-app/directors"
                              value={field.value}
                              onFileUploaded={(url) => {
                                form.setFieldValue(field.name, url);
                                form.setFieldTouched(field.name, true);
                                form.setFieldError(field.name, "");
                              }}
                              onUploadError={(error) => {
                                form.setFieldError(field.name, error);
                              }}
                              onClearError={() =>
                                form.setFieldError(field.name, "")
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="passport"
                          component="span"
                          className="text-red-500 text-xs block mt-1"
                        />
                      </div>

                      {/* Employment Letter */}
                      <div>
                        <Field name="employmentLetter">
                          {({ field, form }: FieldProps) => (
                            <FileUploadWithProgress
                              label="Employment Letter"
                              accept="image/*,application/pdf"
                              maxSizeMB={5}
                              folder="loan-app/directors"
                              value={field.value}
                              onFileUploaded={(url) => {
                                form.setFieldValue(field.name, url);
                                form.setFieldTouched(field.name, true);
                                form.setFieldError(field.name, undefined);
                                form.validateField(field.name); // re-validate to ensure error is gone
                              }}
                              onUploadError={(error) => {
                                form.setFieldError(field.name, error);
                              }}
                              onClearError={() =>
                                form.setFieldError(field.name, "")
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="employmentLetter"
                          component="span"
                          className="text-red-500 text-xs block mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* step 4 - System Access */}
                {activeStep === 3 && (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-1">
                        System Access Credentials
                      </h3>
                      <p className="text-sm text-primary leading-relaxed">
                        Set up login credentials for the new director. Password
                        must be at least 8 characters long, including uppercase,
                        lowercase, numbers, and special characters (
                        <span className="font-mono">@#$&</span>).
                      </p>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email (read-only) */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-800">
                          Login Email (Read-only)
                        </label>
                        <Field name="email">
                          {({ field }: FieldProps) => (
                            <input
                              type="email"
                              value={field.value}
                              readOnly
                              className="w-full h-14 px-4 border rounded-[6px] bg-gray-100 text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                            />
                          )}
                        </Field>
                        <p className="text-xs text-gray-500">
                          This email was entered in the Personal Info step.
                        </p>
                      </div>

                      {/* Password */}
                      <Field name="password">
                        {({ field, form }: FieldProps) => (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-800">
                                Password
                              </label>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newPassword = generatePassword();
                                  form.setFieldValue("password", newPassword);
                                  form.setFieldValue(
                                    "confirmPassword",
                                    newPassword
                                  );
                                  form.setFieldTouched("password", true);
                                  form.setFieldTouched("confirmPassword", true);

                                  // ✅ clear errors immediately after setting
                                  form.setFieldError("password", undefined);
                                  form.setFieldError(
                                    "confirmPassword",
                                    undefined
                                  );
                                }}
                                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-blue-800 transition-colors cursor-pointer"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Generate
                              </button>
                            </div>

                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                placeholder="Enter password"
                                className={`w-full h-14 px-4 outline-primary border rounded-[6px] placeholder:text-gray-400 ${
                                  form.touched.password && form.errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.value
                                  );
                                  // ✅ clear error live when typing a valid password
                                  if (form.errors.password)
                                    form.setFieldError(field.name, undefined);
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>

                            <ErrorMessage
                              name="password"
                              component="span"
                              className="text-xs text-red-500"
                            />
                          </div>
                        )}
                      </Field>

                      {/* Confirm Password */}
                      <Field name="confirmPassword">
                        {({ field, form }: FieldProps) => (
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-800">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                                placeholder="Confirm password"
                                className={`w-full h-14 px-4 outline-primary border rounded-[6px] placeholder:text-gray-400 ${
                                  form.touched.confirmPassword &&
                                  form.errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    field.name,
                                    e.target.value
                                  );
                                  // ✅ clear error when retyping correctly
                                  if (form.errors.confirmPassword)
                                    form.setFieldError(field.name, undefined);
                                }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>

                            <ErrorMessage
                              name="confirmPassword"
                              component="span"
                              className="text-xs text-red-500"
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <ReviewAgentInfo setActiveStep={setActiveStep} />
                )}

                <div className="mt-12 flex items-center justify-between">
                  <Button
                    variant={activeStep > 0 ? "primary" : "neutral"}
                    onClick={handleBack}
                    disabled={activeStep < 1 || isLoading}
                  >
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      onClick={() => setShouldSubmit(true)}
                    >
                      {isLoading ? "Creating director..." : "Create director"}
                    </Button>
                  ) : (
                    <Button
                      type="button" // prevent submit on click
                      onClick={() =>
                        handleNext(validateForm, setTouched, activeStep)
                      }
                      disabled={isLoading}
                    >
                      Next{" "}
                      <span className="hidden md:inline">
                        : {steps[activeStep + 1]}
                      </span>
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}

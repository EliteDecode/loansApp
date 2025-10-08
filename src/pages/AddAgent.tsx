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
import { createCreditAgent, resetAgent } from "@/services/features";
import type { AppDispatch, RootState } from "@/store";

const steps = [
  "Personal Info",
  "Work & Role Details",
  "Document Uploads",
  "System Access",
  "Review",
];

export interface AgentFormValues {
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

const initialValues: AgentFormValues = {
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

export default function AddAgent() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get Redux state for agent creation
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.agent
  );

  // Clear agent state when component mounts
  useEffect(() => {
    dispatch(resetAgent());
  }, [dispatch]);

  // Handle success state
  useEffect(() => {
    if (isSuccess && message === "agent created successfully") {
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
    dispatch(resetAgent()); // Clear the success state
    navigate("/credit-agents");
  };

  // Handle error modal close
  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    dispatch(resetAgent()); // Clear the error state
  };

  const handleFinish = async (
    values: AgentFormValues,
    _helpers?: FormikHelpers<AgentFormValues>
  ) => {
    // Prepare data for API call
    const agentData = {
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

    await dispatch(createCreditAgent(agentData));
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
        .matches(
          /^\+234[0-9]{10}$/,
          "Phone number must be in format +234XXXXXXXXXX"
        )
        .required("Phone number is required"),
      residentialAddress: Yup.string().required(
        "Residential address is required"
      ),
      stateOfResidence: Yup.string().required("State of residence is required"),
      lgaOfResidence: Yup.string().required("LGA of residence is required"),
    }),

    // Step 2: Work & Role Details
    Yup.object({
      bankName: Yup.string().required("Bank name is required"),
      bankAccount: Yup.string().required("Bank account is required"),
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
          Add New Agent
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
        title="Agent Created Successfully!"
        message="The new credit agent has been created successfully and can now access the system with the provided credentials."
        confirmText="View Agents"
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
            onSubmit={(values) => {
              // Only submit when explicitly on the final step
              if (activeStep === steps.length - 1) {
                handleFinish(values);
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
                        placeholder="Enter agent's first name"
                      />

                      <TextInput
                        name="lastName"
                        type="text"
                        label="Last Name"
                        placeholder="Enter agent's last name"
                      />

                      <SelectInput name="gender" label="Gender">
                        <option value="">Select agent's gender</option>
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
                        placeholder="Enter agent's email address"
                      />

                      <TextInput
                        name="phoneNumber"
                        type="tel"
                        label="Phone Number"
                        placeholder="Enter agent's phone number (+234XXXXXXXXXX)"
                      />

                      <TextInput
                        name="residentialAddress"
                        type="text"
                        label="Residential Address"
                        placeholder="Enter agent's residential address"
                      />

                      <TextInput
                        name="stateOfResidence"
                        type="text"
                        label="State of Residence"
                        placeholder="Enter agent's state of residence"
                      />

                      <TextInput
                        name="lgaOfResidence"
                        type="text"
                        label="LGA of Residence"
                        placeholder="Enter agent's LGA of residence"
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
                        type="number"
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
                      <Field name="validNIN">
                        {({ field, form }: FieldProps) => (
                          <FileUploadWithProgress
                            label="Valid NIN"
                            accept="image/*,application/pdf"
                            maxSizeMB={5}
                            folder="loan-app/agents"
                            value={field.value}
                            onFileUploaded={(url) => {
                              form.setFieldValue(field.name, url);
                              form.setFieldTouched(field.name, true);
                            }}
                            onUploadError={(error) => {
                              form.setFieldError(field.name, error);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="validNIN"
                        component="span"
                        className="text-red-500 text-xs"
                      />

                      <Field name="utilityBill">
                        {({ field, form }: FieldProps) => (
                          <FileUploadWithProgress
                            label="Utility Bill"
                            accept="image/*,application/pdf"
                            maxSizeMB={5}
                            folder="loan-app/agents"
                            value={field.value}
                            onFileUploaded={(url) => {
                              form.setFieldValue(field.name, url);
                              form.setFieldTouched(field.name, true);
                            }}
                            onUploadError={(error) => {
                              form.setFieldError(field.name, error);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="utilityBill"
                        component="span"
                        className="text-red-500 text-xs"
                      />

                      <Field name="passport">
                        {({ field, form }: FieldProps) => (
                          <FileUploadWithProgress
                            label="Passport photograph"
                            accept="image/*,application/pdf"
                            maxSizeMB={5}
                            folder="loan-app/agents"
                            value={field.value}
                            onFileUploaded={(url) => {
                              form.setFieldValue(field.name, url);
                              form.setFieldTouched(field.name, true);
                            }}
                            onUploadError={(error) => {
                              form.setFieldError(field.name, error);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="passport"
                        component="span"
                        className="text-red-500 text-xs"
                      />

                      <Field name="employmentLetter">
                        {({ field, form }: FieldProps) => (
                          <FileUploadWithProgress
                            label="Employment Letter"
                            accept="image/*,application/pdf"
                            maxSizeMB={5}
                            folder="loan-app/agents"
                            value={field.value}
                            onFileUploaded={(url) => {
                              form.setFieldValue(field.name, url);
                              form.setFieldTouched(field.name, true);
                            }}
                            onUploadError={(error) => {
                              form.setFieldError(field.name, error);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="employmentLetter"
                        component="span"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* step 4 - System Access */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        System Access Credentials
                      </h3>
                      <p className="text-blue-700 text-sm">
                        Set up login credentials for the new agent. Password
                        must be 8 characters with uppercase, lowercase, numbers,
                        and special characters (@#$&).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Read-only Email Field */}
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                          Login Email (Read-only)
                        </label>
                        <Field name="email">
                          {({ field }: FieldProps) => (
                            <input
                              type="email"
                              value={field.value}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                          )}
                        </Field>
                        <p className="text-xs text-gray-500">
                          This email was entered in the Personal Info step
                        </p>
                      </div>

                      {/* Password Field with Generator */}
                      <Field name="password">
                        {({ field, form }: FieldProps) => (
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center justify-between">
                              <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                                Password
                              </label>
                              <button
                                type="button"
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
                                }}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Generate 8-char
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                placeholder="Enter 8-character password"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <IconButton
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                                size="small"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </IconButton>
                            </div>
                            <ErrorMessage
                              name="password"
                              component="span"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        )}
                      </Field>

                      {/* Confirm Password Field */}
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                          Confirm Password
                        </label>
                        <Field name="confirmPassword">
                          {({ field }: FieldProps) => (
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                                placeholder="Confirm 8-character password"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <IconButton
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                                size="small"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </IconButton>
                            </div>
                          )}
                        </Field>
                        <ErrorMessage
                          name="confirmPassword"
                          component="span"
                          className="text-red-500 text-xs"
                        />
                      </div>
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
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Creating Agent..." : "Create Agent"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
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

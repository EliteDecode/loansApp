import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  type StepIconProps,
} from "@mui/material";
import { useState } from "react";
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

const steps = [
  "Personal Info",
  "Work & Role Details",
  "Document Uploads",
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

export default function AddAgent() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleFinish = (
    values: AgentFormValues,
    _helpers?: FormikHelpers<AgentFormValues>
  ) => {
    console.log(values);
    setOpen(true);
    alert("🎉 Agent added successfully!");
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
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),

    // Step 3: Document Uploads
    Yup.object({
      validNIN: urlValidation("Valid NIN"),
      utilityBill: urlValidation("Utility Bill"),
      passport: urlValidation("Passport photograph"),
      employmentLetter: urlValidation("Employment Letter"),
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

        {activeStep === steps.length ? (
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>🎉 Success</DialogTitle>
            <DialogContent>
              <Typography>
                All steps completed — you&apos;re finished!
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Close</Button>
              <Button>Go to Dashboard</Button>
            </DialogActions>
          </Dialog>
        ) : (
          <div className="mt-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchemas[activeStep]}
              onSubmit={(values) => {
                if (activeStep < steps.length - 1) {
                  // normal step, just move forward
                  setActiveStep(activeStep + 1);
                } else {
                  // handleFinish should ONLY run after Review is confirmed
                  handleFinish(values);
                }
              }}
            >
              {({ validateForm, setTouched }) => (
                <Form className="flex flex-col gap-4">
                  {/* step 1 */}
                  {activeStep === 0 && (
                    <div className="space-y-2">
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
                  )}

                  {/* step 2 */}
                  {activeStep === 1 && (
                    <div className="space-y-4">
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

                      <TextInput
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Enter password"
                      />

                      <TextInput
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm password"
                      />
                    </div>
                  )}

                  {/* step 3 */}
                  {activeStep === 2 && (
                    <div className="space-y-4">
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
                  )}

                  {activeStep === 3 && (
                    <ReviewAgentInfo setActiveStep={setActiveStep} />
                  )}

                  <div className="mt-12 flex items-center justify-between">
                    <Button
                      variant={activeStep > 0 ? "primary" : "neutral"}
                      onClick={handleBack}
                      disabled={activeStep < 1}
                    >
                      Back
                    </Button>

                    {activeStep === steps.length - 1 ? (
                      <Button type="submit">Create Agent</Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() =>
                          handleNext(validateForm, setTouched, activeStep)
                        }
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
      </Box>
    </div>
  );
}

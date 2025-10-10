import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import type { FieldProps } from "formik";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  type StepIconProps,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Button from "@/components/Button/Button";
import { useAgentEditHook } from "@/hooks";
import SuccessModal from "@/components/modals/SuccessModal/SuccessModal";
import ErrorModal from "@/components/modals/ErrorModal/ErrorModal";
import FileUploadWithProgress from "@/components/FileUploadWithProgress/FileUploadWithProgress";
import { ErrorMessage } from "formik";
import verified from "@/assets/icons/verifiedBlue.svg";
import TextInput from "@/components/TextInput/TextInput";
import SelectInput from "@/components/SelectInput/SelectInput";

const steps = ["Personal Info", "Work & Role Details", "Document Uploads"];

export default function EditAgent() {
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const {
    agent,
    isLoading,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,
    validationSchemas,
  } = useAgentEditHook();

  console.log(agent);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Agent not found</p>
          <Button
            variant="outline"
            onClick={() => navigate("/credit-agents")}
            className="mt-4"
          >
            Back to Agents
          </Button>
        </div>
      </div>
    );
  }

  const initialValues = {
    firstName: agent.firstName || "",
    lastName: agent.lastName || "",
    gender: agent.gender || "",
    dateOfBirth: agent.dateOfBirth ? dayjs(agent.dateOfBirth) : dayjs(),
    email: agent.email || "",
    phoneNumber: agent.phoneNumber || "",
    residentialAddress: agent.residentialAddress || "",
    stateOfResidence: agent.stateOfResidence || "",
    lgaOfResidence: agent.lgaOfResidence || "",
    bankName: agent.bankName || "",
    bankAccount: agent.bankAccount || "",
    employmentType: agent.employmentType || "",
    dateOfEmployment: agent.dateOfEmployment
      ? dayjs(agent.dateOfEmployment)
      : dayjs(),
    validNIN: agent.validNIN || "",
    utilityBill: agent.utilityBill || "",
    passport: agent.passport || "",
    employmentLetter: agent.employmentLetter || "",
  };

  function CustomStepIcon({ active, completed }: StepIconProps) {
    if (completed || active) return <img src={verified} alt="verified" />;
    return null;
  }

  const stepFields = [
    [
      "firstName",
      "lastName",
      "gender",
      "dateOfBirth",
      "email",
      "phoneNumber",
      "residentialAddress",
      "stateOfResidence",
      "lgaOfResidence",
    ],
    ["bankName", "bankAccount", "employmentType", "dateOfEmployment"],
    ["validNIN", "utilityBill", "passport", "employmentLetter"],
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="md:p-8 p-4 pt-0">
        <div className="md:pb-8 mb-4">
          <h1 className="md:text-[28px] text-[18px] font-semibold text-gray-700">
            Edit Agent
          </h1>
        </div>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Stepper
            activeStep={activeStep}
            sx={{
              display: "flex",
              flexWrap: "nowrap",
              minWidth: "max-content",
              "& .MuiStep-root": { marginRight: 2 },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={CustomStepIcon}
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontWeight: index === activeStep ? "500" : "normal",
                      color:
                        index === activeStep
                          ? "#002D62"
                          : index < activeStep
                          ? "#002D62"
                          : "#98A2B3",
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Success and Error Modals */}
        <SuccessModal
          open={showSuccessModal}
          onClose={handleSuccessModalClose}
          title="Agent Updated Successfully!"
          message="The agent information has been updated successfully."
          confirmText="View Agents"
          onConfirm={handleSuccessModalClose}
        />

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
                if (shouldSubmit && activeStep === steps.length - 1) {
                  handleFinish(values);
                } else {
                  formikHelpers.setSubmitting(false);
                }
              }}
            >
              {({ validateForm, setTouched, isSubmitting }) => (
                <Form className="flex flex-col gap-4">
                  {/* Step 1 */}
                  {activeStep === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextInput name="firstName" label="First Name" />
                      <TextInput name="lastName" label="Last Name" />
                      <SelectInput name="gender" label="Gender">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </SelectInput>

                      <div>
                        <label className="font-medium text-gray-900 text-sm">
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

                      <TextInput name="email" label="Email Address" />
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
                                placeholder="Enter agent's phone number (+234XXXXXXXXXX)"
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
                      <TextInput name="residentialAddress" label="Address" />
                      <TextInput name="stateOfResidence" label="State" />
                      <TextInput name="lgaOfResidence" label="LGA" />
                    </div>
                  )}

                  {/* Step 2 */}
                  {activeStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextInput name="bankName" label="Bank Name" />
                      <TextInput name="bankAccount" label="Account Number" />
                      <SelectInput
                        name="employmentType"
                        label="Employment Type"
                      >
                        <option value="">Select type</option>
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="self-employed">Self-Employed</option>
                      </SelectInput>

                      <div>
                        <label className="font-medium text-gray-900 text-sm">
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
                    </div>
                  )}

                  {/* Step 3 */}
                  {activeStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        "validNIN",
                        "utilityBill",
                        "passport",
                        "employmentLetter",
                      ].map((fieldName) => (
                        <div key={fieldName}>
                          <Field name={fieldName}>
                            {({ field, form }: FieldProps) => (
                              <FileUploadWithProgress
                                label={fieldName
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (s) => s.toUpperCase())}
                                accept="image/*,application/pdf"
                                folder="loan-app/agents"
                                value={field.value}
                                onFileUploaded={(url) =>
                                  form.setFieldValue(field.name, url)
                                }
                                onUploadError={(error) =>
                                  form.setFieldError(field.name, error)
                                }
                                onClearError={() =>
                                  form.setFieldError(field.name, "")
                                }
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name={fieldName}
                            component="span"
                            className="text-red-500 text-xs block mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Navigation Buttons */}
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
                        onClick={() => setShouldSubmit(true)}
                        type="submit"
                        disabled={isSubmitting || isLoading}
                      >
                        {isSubmitting ? "Saving..." : "Update Agent"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isSubmitting || isLoading}
                        onClick={async () => {
                          const errors = await validateForm();

                          // only mark fields from current step
                          const currentStepFields = stepFields[activeStep];
                          const touchedMap = currentStepFields.reduce(
                            (acc, key) => ({ ...acc, [key]: true }),
                            {}
                          );

                          setTouched(touchedMap);

                          // Check for errors only within this step
                          const hasErrors = Object.keys(errors).some((key) =>
                            currentStepFields.includes(key)
                          );

                          if (!hasErrors) handleNext();
                        }}
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
    </LocalizationProvider>
  );
}

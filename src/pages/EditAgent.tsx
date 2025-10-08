import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import type { FieldProps } from "formik";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
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

const steps = ["Personal Information", "Employment Details", "Documents"];

export default function EditAgent() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const {
    agent,
    isLoading,
    isUpdating,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,
    validationSchemas,
  } = useAgentEditHook();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="md:p-8 p-4 pt-0">
        <div className="md:pb-8 mb-4">
          <h1 className="md:text-[28px] text-[18px] md:leading-[120%] leading-[145%] font-semibold tracking-[-2%] text-gray-700">
            Edit Agent
          </h1>
        </div>

        <Box sx={{ width: "100%" }} className="mb-8">
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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          onSubmit={() => {
            // Form submission is handled by the Update Agent button click
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              {/* Step 1: Personal Information */}
              {activeStep === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field name="firstName">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="First Name"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="lastName">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Last Name"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="gender">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          fullWidth
                          error={meta.touched && !!meta.error}
                        >
                          <InputLabel>Gender</InputLabel>
                          <Select {...field} label="Gender">
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                          </Select>
                          {meta.touched && meta.error && (
                            <FormHelperText>{meta.error}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>

                    <Field name="dateOfBirth">
                      {({ field, meta }: FieldProps) => (
                        <DatePicker
                          label="Date of Birth"
                          value={field.value}
                          onChange={(date) =>
                            setFieldValue("dateOfBirth", date)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: meta.touched && !!meta.error,
                              helperText: meta.touched && meta.error,
                            },
                          }}
                        />
                      )}
                    </Field>

                    <Field name="email">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Email"
                          type="email"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="phoneNumber">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Phone Number"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="residentialAddress">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Residential Address"
                          multiline
                          rows={3}
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="stateOfResidence">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="State of Residence"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="lgaOfResidence">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="LGA of Residence"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="bankName">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Bank Name"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="bankAccount">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Bank Account Number"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 2: Employment Details */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field name="employmentType">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          fullWidth
                          error={meta.touched && !!meta.error}
                        >
                          <InputLabel>Employment Type</InputLabel>
                          <Select {...field} label="Employment Type">
                            <MenuItem value="full-time">Full-time</MenuItem>
                            <MenuItem value="part-time">Part-time</MenuItem>
                            <MenuItem value="contract">Contract</MenuItem>
                            <MenuItem value="self-employed">
                              Self-employed
                            </MenuItem>
                          </Select>
                          {meta.touched && meta.error && (
                            <FormHelperText>{meta.error}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>

                    <Field name="dateOfEmployment">
                      {({ field, meta }: FieldProps) => (
                        <DatePicker
                          label="Date of Employment"
                          value={field.value}
                          onChange={(date) =>
                            setFieldValue("dateOfEmployment", date)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: meta.touched && !!meta.error,
                              helperText: meta.touched && meta.error,
                            },
                          }}
                        />
                      )}
                    </Field>

                    <Field name="bankName">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Bank Name"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>

                    <Field name="bankAccount">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Bank Account Number"
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && meta.error}
                          fullWidth
                        />
                      )}
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
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
                          label="Passport Photo"
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

              <div className="mt-12 flex items-center justify-between">
                <Button
                  variant={activeStep > 0 ? "primary" : "neutral"}
                  onClick={handleBack}
                  disabled={activeStep < 1 || isUpdating}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => handleFinish(values)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Agent"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isUpdating}
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
      </div>
    </LocalizationProvider>
  );
}

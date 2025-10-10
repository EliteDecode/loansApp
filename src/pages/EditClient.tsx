import {
  Step,
  StepLabel,
  Stepper,
  Box,
  type StepIconProps,
} from "@mui/material";
import { useState } from "react";
import verified from "@/assets/icons/verifiedBlue.svg";
import Button from "@/components/Button/Button";
import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import TextInput from "@/components/TextInput/TextInput";
import SelectInput from "@/components/SelectInput/SelectInput";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FileUploadWithProgress from "@/components/FileUploadWithProgress/FileUploadWithProgress";
import SuccessModal from "@/components/modals/SuccessModal/SuccessModal";
import ErrorModal from "@/components/modals/ErrorModal/ErrorModal";
import { useClientEditHook, type ClientFormValues } from "@/hooks";

const steps = [
  "Personal Info",
  "Employment / Business Info",
  "Guarantor Info",
  "Document Uploads",
];

function StepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        completed
          ? "bg-primary text-white"
          : active
          ? "bg-primary text-white"
          : "bg-gray-200 text-gray-500"
      } ${className}`}
    >
      {completed ? (
        <img src={verified} alt="verified" className="w-5 h-5" />
      ) : (
        <span className="text-sm font-medium">
          {(props.icon as number) + 1}
        </span>
      )}
    </div>
  );
}

export default function EditClient() {
  const [activeStep, setActiveStep] = useState(0);

  // Use the client edit hook
  const {
    isSubmitting,
    isLoading,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    clientData,
    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,
    validationSchemas,
  } = useClientEditHook();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (!clientData && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Failed to load client data</p>
        <Button onClick={() => window.history.back()}>Back to Clients</Button>
      </div>
    );
  }

  // Convert client data to form values
  const formInitialValues: ClientFormValues = {
    firstName: clientData?.firstName || "",
    lastName: clientData?.lastName || "",
    gender: clientData?.gender || "",
    dateOfBirth: clientData?.dateOfBirth
      ? new Date(clientData?.dateOfBirth)
      : null,
    email: clientData?.email || "",
    phoneNumber: clientData?.phoneNumber || "",
    residentialAddress: clientData?.residentialAddress || "",
    stateOfResidence: clientData?.stateOfResidence || "",
    lgaOfResidence: clientData?.lgaOfResidence || "",
    employmentType: clientData?.employmentType || "",
    occupationOrBusinessType: clientData?.occupationOrBusinessType || "",
    monthlyIncome: clientData?.monthlyIncome?.toString() || "",
    employer: clientData?.employer || "",
    workAddress: clientData?.workAddress || "",
    yearsInBusiness: clientData?.yearsInBusiness?.toString() || "",
    guarantorFullName: clientData?.guarantorFullName || "",
    guarantorRelationship: clientData?.guarantorRelationship || "",
    guarantorPhoneNumber: clientData?.guarantorPhoneNumber || "",
    guarantorAddress: clientData?.guarantorAddress || "",
    secondaryGuarantorFullName: clientData?.secondaryGuarantorFullName || "",
    secondaryGuarantorRelationship:
      clientData?.secondaryGuarantorRelationship || "",
    secondaryGuarantorPhoneNumber:
      clientData?.secondaryGuarantorPhoneNumber || "",
    secondaryGuarantorAddress: clientData?.secondaryGuarantorAddress || "",
    validNIN: clientData?.validNIN || "",
    utilityBill: clientData?.utilityBill || "",
    passport: clientData?.passport || "",
  };

  return (
    <div className="bg-white p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Edit Client</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>

      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchemas[activeStep]}
        onSubmit={() => {}} // Empty function since we handle submission manually
      >
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col gap-4">
            {/* Step 1: Personal Info */}
            {activeStep === 0 && (
              <div className="space-y-2">
                <TextInput
                  name="firstName"
                  type="text"
                  label="First Name"
                  placeholder="Enter client's first name"
                />

                <TextInput
                  name="lastName"
                  type="text"
                  label="Last Name"
                  placeholder="Enter client's Last name"
                />

                <SelectInput name="gender" label="Gender">
                  <option value="">Select client's gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </SelectInput>

                <div className="flex flex-col gap-1 w-full">
                  <label className="font-medium text-gray-900">
                    Date of Birth
                  </label>
                  <Field name="dateOfBirth">
                    {({ field, form }: FieldProps) => (
                      <DatePicker
                        value={field.value || null}
                        onChange={(val) => form.setFieldValue(field.name, val)}
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
                  placeholder="Enter client's email address"
                />

                <TextInput
                  name="phoneNumber"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter client's phone number"
                />

                <TextInput
                  name="residentialAddress"
                  type="text"
                  label="Residential Address"
                  placeholder="Enter client's residential address"
                />

                <TextInput
                  name="stateOfResidence"
                  type="text"
                  label="State of Residence"
                  placeholder="Enter client's state of residence"
                />

                <TextInput
                  name="lgaOfResidence"
                  type="text"
                  label="LGA of Residence"
                  placeholder="Enter client's LGA of residence"
                />
              </div>
            )}

            {/* Step 2: Employment / Business Info */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <SelectInput name="employmentType" label="Employment Type">
                  <option value="" className="text-gray-400">
                    Select employment type
                  </option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="business-owner">Business Owner</option>
                  <option value="unemployed">Unemployed</option>
                </SelectInput>

                <TextInput
                  name="occupationOrBusinessType"
                  type="text"
                  label="Occupation / Business Type"
                  placeholder="Enter occupation / business type"
                />

                <TextInput
                  name="monthlyIncome"
                  type="number"
                  label="Monthly Income"
                  placeholder="Enter monthly income"
                />

                <TextInput
                  name="yearsInBusiness"
                  type="number"
                  label="Years in Business"
                  placeholder="Enter years in business"
                />

                {values.employmentType === "employed" && (
                  <TextInput
                    name="employer"
                    type="text"
                    label="Employer"
                    placeholder="Enter employer name"
                  />
                )}

                {["employed", "self-employed", "business-owner"].includes(
                  values.employmentType
                ) && (
                  <TextInput
                    name="workAddress"
                    type="text"
                    label="Work Address"
                    placeholder="Enter work address"
                  />
                )}
              </div>
            )}

            {/* Step 3: Guarantor Info */}
            {activeStep === 2 && (
              <div className="space-y-6">
                {/* Primary Guarantor */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Primary Guarantor
                  </h3>
                  <TextInput
                    name="guarantorFullName"
                    type="text"
                    label="Guarantor's Full Name"
                    placeholder="Enter guarantor's full name"
                  />

                  <SelectInput
                    name="guarantorRelationship"
                    label="Relationship to Client"
                  >
                    <option value="">Select relationship to client</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Colleague</option>
                    <option value="other">Other</option>
                  </SelectInput>

                  <TextInput
                    name="guarantorPhoneNumber"
                    type="text"
                    label="Phone Number"
                    placeholder="Enter guarantor's phone number"
                  />

                  <TextInput
                    name="guarantorAddress"
                    type="text"
                    label="Address"
                    placeholder="Enter guarantor's address"
                  />
                </div>

                {/* Secondary Guarantor */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Secondary Guarantor
                  </h3>
                  <TextInput
                    name="secondaryGuarantorFullName"
                    type="text"
                    label="Guarantor's Full Name"
                    placeholder="Enter guarantor's full name"
                  />

                  <SelectInput
                    name="secondaryGuarantorRelationship"
                    label="Relationship to Client"
                  >
                    <option value="">Select relationship to client</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Colleague</option>
                    <option value="other">Other</option>
                  </SelectInput>

                  <TextInput
                    name="secondaryGuarantorPhoneNumber"
                    type="text"
                    label="Phone Number"
                    placeholder="Enter guarantor's phone number"
                  />

                  <TextInput
                    name="secondaryGuarantorAddress"
                    type="text"
                    label="Address"
                    placeholder="Enter guarantor's address"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Document Uploads */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <Field name="validNIN">
                  {({ field }: FieldProps) => (
                    <FileUploadWithProgress
                      label="Valid NIN"
                      onFileUploaded={(url) => setFieldValue("validNIN", url)}
                      onUploadError={(error) => console.error(error)}
                      value={field.value}
                    />
                  )}
                </Field>

                <Field name="utilityBill">
                  {({ field }: FieldProps) => (
                    <FileUploadWithProgress
                      label="Utility Bill"
                      onFileUploaded={(url) =>
                        setFieldValue("utilityBill", url)
                      }
                      onUploadError={(error) => console.error(error)}
                      value={field.value}
                    />
                  )}
                </Field>

                <Field name="passport">
                  {({ field }: FieldProps) => (
                    <FileUploadWithProgress
                      label="Passport"
                      onFileUploaded={(url) => setFieldValue("passport", url)}
                      onUploadError={(error) => console.error(error)}
                      value={field.value}
                    />
                  )}
                </Field>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>

              <div className="flex gap-4">
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => handleFinish(values)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Client"}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Client Updated Successfully"
        message="The client information has been updated successfully."
        confirmText="View Client"
        onConfirm={handleSuccessModalClose}
      />

      {/* Error Modal */}
      <ErrorModal
        open={showErrorModal}
        onClose={handleErrorModalClose}
        title="Update Failed"
        message={errorMessage}
        showRetry={true}
        retryText="Try Again"
        onRetry={handleErrorModalClose}
      />
    </div>
  );
}

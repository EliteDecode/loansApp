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
import { useClientAddHook, type ClientFormValues } from "@/hooks";

const steps = [
  "Personal Info",
  "Employment / Business Info",
  "Guarantor Info",
  "Document Uploads",
];

const initialValues: ClientFormValues = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: null,
  email: "",
  phoneNumber: "",
  residentialAddress: "",
  stateOfResidence: "",
  lgaOfResidence: "",
  employmentType: "",
  occupationOrBusinessType: "",
  monthlyIncome: "",
  employer: "",
  workAddress: "",
  yearsInBusiness: "",
  guarantorFullName: "",
  guarantorRelationship: "",
  guarantorPhoneNumber: "",
  guarantorAddress: "",
  secondaryGuarantorFullName: "",
  secondaryGuarantorRelationship: "",
  secondaryGuarantorPhoneNumber: "",
  secondaryGuarantorAddress: "",
  validNIN: "",
  utilityBill: "",
  passport: "",
};

export default function AddClient() {
  const [activeStep, setActiveStep] = useState(0);

  // Use the client add hook
  const {
    isSubmitting,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    handleFinish,
    handleSuccessModalClose,
    handleErrorModalClose,
    validationSchemas,
  } = useClientAddHook();

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

  return (
    <div className="md:p-8 p-4 pt-0">
      <div className="md:pb-8 mb-4">
        <h1 className="md:text-[28px] text-[18px] md:leading-[120%] leading-[145%] font-semibold tracking-[-2%] text-gray-700">
          Add New Client
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

        {/* Success Modal */}
        <SuccessModal
          open={showSuccessModal}
          onClose={handleSuccessModalClose}
          title="Client Created Successfully!"
          message="The client has been successfully added to the system. You can now view them in the clients list."
          confirmText="View Clients"
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

        <div className="mt-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={() => {
              // Form submission is handled by the Finish button only
            }}
          >
            {({ validateForm, setTouched, values }) => (
              <Form className="flex flex-col gap-4">
                {/* step 1 */}
                {activeStep === 0 && (
                  <div className="space-y-2">
                    <TextInput
                      name="firstName"
                      type="text"
                      label="First Name"
                      placeholder="Enter client’s first name"
                    />

                    <TextInput
                      name="lastName"
                      type="text"
                      label="Last Name"
                      placeholder="Enter client’s Last name"
                    />

                    <SelectInput name="gender" label="Gender">
                      <option value="">Select client’s gender</option>
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
                      x
                      label="Email Address"
                      placeholder="Enter client’s email address"
                    />

                    <TextInput
                      name="phoneNumber"
                      type="tel"
                      label="Phone Number"
                      placeholder="Enter client’s phone number"
                    />

                    <TextInput
                      name="residentialAddress"
                      type="text"
                      label="Residential Address"
                      placeholder="Enter client’s residential address"
                    />

                    <TextInput
                      name="stateOfResidence"
                      type="text"
                      label="State of Residence"
                      placeholder="Enter client’s state of residence"
                    />

                    <TextInput
                      name="lgaOfResidence"
                      type="text"
                      label="LGA of Residence"
                      placeholder="Enter client's LGA of residence"
                    />
                  </div>
                )}

                {/* step 2 */}
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
                      type="text"
                      label="Monthly Income"
                      placeholder="Enter monthly income	"
                    />

                    <TextInput
                      name="employer"
                      type="text"
                      label="Employer/Business Name (Optional)"
                      placeholder="Enter employer/business name"
                    />

                    <TextInput
                      name="workAddress"
                      type="text"
                      label="Work Address"
                      placeholder="Enter work address"
                    />

                    <TextInput
                      name="yearsInBusiness"
                      type="text"
                      label="Years in Business/Job"
                      placeholder="Enter years in business/job"
                    />
                  </div>
                )}

                {/* step 3 */}
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
                        label="Secondary Guarantor's Full Name"
                        placeholder="Enter secondary guarantor's full name"
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
                        placeholder="Enter secondary guarantor's phone number"
                      />

                      <TextInput
                        name="secondaryGuarantorAddress"
                        type="text"
                        label="Address"
                        placeholder="Enter secondary guarantor's address"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-4">
                    <Field name="validNIN">
                      {({ field, form }: FieldProps) => (
                        <FileUploadWithProgress
                          label="Valid ID (NIN, Voter's ID, etc.)"
                          accept="image/*,application/pdf"
                          maxSizeMB={5}
                          value={field.value}
                          onFileUploaded={(url) => {
                            form.setFieldValue(field.name, url);
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
                          label="Utility Bill / Proof of Address"
                          accept="image/*,application/pdf"
                          maxSizeMB={5}
                          value={field.value}
                          onFileUploaded={(url) => {
                            form.setFieldValue(field.name, url);
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
                          value={field.value}
                          onFileUploaded={(url) => {
                            form.setFieldValue(field.name, url);
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
                  </div>
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
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={async () => {
                        const errors = await validateForm();
                        if (Object.keys(errors).length === 0) {
                          handleFinish(values);
                        } else {
                          setTouched(
                            Object.keys(errors).reduce<Record<string, boolean>>(
                              (acc, key) => {
                                acc[key] = true;
                                return acc;
                              },
                              {}
                            ),
                            true
                          );
                        }
                      }}
                    >
                      {isSubmitting ? "Creating Client..." : "Finish"}
                    </Button>
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
      </Box>
    </div>
  );
}

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
import FileDropzone from "@/components/FileDropzone/FileDropzone";
import { generatePassword } from "@/lib/utils";
import ReviewAgentInfo from "@/components/ui/ReviewAgentInfo";

const steps = [
  "Personal Info",
  "Work & Role Details",
  "Document Uploads",
  "System Access",
  "Review",
];

export interface ClientFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date | null;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  LGAOfResidence: string;
  employmentType: string;
  occupation: string;
  monthlyIncome: string | number;
  employer: string;
  workAddress: string;
  yearsInBusiness: string | number;
  guarantorFullName: string;
  relationshipToClient: string;
  guarantorPhoneNumber: string;
  guarantorAddress: string;
  idDocument: File | null;
  addressDocument: File | null;
  passportDocument: File | null;
  employmentLetter: File | null;
  doe: Date | null;
  status: string;
  temporaryPassword: string;
}

const initialValues: ClientFormValues = {
  firstName: "Elizabeth",
  lastName: "Johnson",
  gender: "Female",
  dob: new Date("1995-04-15"),
  email: "elizabeth.johnson@example.com",
  phoneNumber: "08012345678",
  residentialAddress: "12 Adewale Street, Ikeja, Lagos",
  stateOfResidence: "Lagos",
  LGAOfResidence: "Ikeja",
  employmentType: "Full-time",
  occupation: "Software Engineer",
  monthlyIncome: 250000,
  employer: "Tech Solutions Ltd",
  workAddress: "15 Marina Road, Lagos",
  yearsInBusiness: 5,
  guarantorFullName: "John Doe",
  relationshipToClient: "Brother",
  guarantorPhoneNumber: "08098765432",
  guarantorAddress: "45 Olabisi Onabanjo Street, Lagos",
  idDocument: null,
  addressDocument: null,
  passportDocument: null,
  employmentLetter: null,
  doe: new Date("2022-12-31"),
  status: "active",
  temporaryPassword: "Temp@1234",
};

// ✅ Reusable file schema
const fileValidation = (label: string) =>
  Yup.mixed<File>()
    .nullable()
    .required(`${label} is required`)
    .test("fileSize", "File too large (max 5 MB)", (value) =>
      value ? value.size <= 5 * 1024 * 1024 : false
    )
    .test("fileType", "Unsupported file format", (value) =>
      value
        ? ["image/jpeg", "image/png", "application/pdf"].includes(value.type)
        : false
    );

export default function AddAgent() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleFinish = (
    values: ClientFormValues,
    _helpers?: FormikHelpers<ClientFormValues>
  ) => {
    console.log(values);
    setOpen(true);
    alert("🎉 Client added successfully!");
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

  // 🔹 Validation schemas array (kept same as your code)
  const validationSchemas = [
    // Step 1: Personal Info
    Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      gender: Yup.string().required("Gender is required"),
      dob: Yup.date()
        .nullable()
        .required("Date of birth is required")
        .max(new Date(), "Date of birth cannot be in the future"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
        .required("Phone number is required"),
      residentialAddress: Yup.string().required(
        "Residential address is required"
      ),
      stateOfResidence: Yup.string().required("State of residence is required"),
      LGAOfResidence: Yup.string().required("LGA of residence is required"),
    }),

    // Step 2: Employment Info
    Yup.object({
      employmentType: Yup.string().required("Employment type is required"),
      doe: Yup.date()
        .nullable()
        .required("Date of employment is required")
        .max(new Date(), "Date of employment cannot be in the future"),
      status: Yup.string().required("Status is required"),
    }),

    // Step 3: Document Uploads
    Yup.object({
      idDocument: fileValidation("Valid ID"),
      addressDocument: fileValidation("Utility Bill / Proof of Address"),
      passportDocument: fileValidation("Passport photograph"),
      employmentLetter: fileValidation("Employment Letter"),
    }),

    // Step 4: System Access (temporaryPassword is auto-generated so no need for strict validation)
    Yup.object({
      temporaryPassword: Yup.string().required(
        "Temporary password is required"
      ),
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
              {({ validateForm, setTouched, setFieldValue }) => (
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
                        <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                          Date of Birth
                        </label>
                        <Field name="dob">
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
                                    form.touched.dob && form.errors.dob
                                  ),
                                  // helperText:
                                  //   form.touched.dob && form.errors.dob,
                                },
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="dob"
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
                        name="LGAOfResidence"
                        type="text"
                        label="LGA of Residence"
                        placeholder="Enter client’s LGA of residence"
                      />
                    </div>
                  )}

                  {/* step 2 */}
                  {activeStep === 1 && (
                    <div className="space-y-4">
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
                      </SelectInput>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900 text-[14px] leading-[145%]">
                          Date of Employment
                        </label>
                        <Field name="doe">
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
                                    form.touched.doe && form.errors.doe
                                  ),
                                },
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="doe"
                          component="span"
                          className="text-red-500 text-xs"
                        />
                      </div>

                      <SelectInput name="status" label="Status">
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </SelectInput>
                    </div>
                  )}

                  {/* step 3 */}
                  {activeStep === 2 && (
                    <div className="space-y-4">
                      <FileDropzone
                        name="idDocument"
                        label="Valid ID (NIN, Voter’s ID, etc.)"
                        accept={{
                          "image/*": [".jpg", ".jpeg", ".png"],
                          "application/pdf": [".pdf"],
                        }}
                        maxSizeMB={5} // 5 MB max
                      />

                      <FileDropzone
                        name="addressDocument"
                        label="Utility Bill / Proof of Address"
                        accept={{
                          "image/*": [".jpg", ".jpeg", ".png"],
                          "application/pdf": [".pdf"],
                        }}
                        maxSizeMB={5} // 5 MB max
                      />

                      <FileDropzone
                        name="passportDocument"
                        label="Passport photograph"
                        accept={{
                          "image/*": [".jpg", ".jpeg", ".png"],
                          "application/pdf": [".pdf"],
                        }}
                        maxSizeMB={5} // 5 MB max
                      />
                      <FileDropzone
                        name="employmentLetter"
                        label="Employment Letter"
                        accept={{
                          "image/*": [".jpg", ".jpeg", ".png"],
                          "application/pdf": [".pdf"],
                        }}
                        maxSizeMB={5} // 5 MB max
                      />
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-4">
                      <TextInput
                        name="email"
                        type="text"
                        label="Login Email"
                        disabled
                      />

                      <div className="flex items-center sm:gap-10 gap-0 flex-col sm:flex-row justify-center">
                        <TextInput
                          name="temporaryPassword"
                          type="text"
                          label="Temporary Password"
                          placeholder="auto-generated, can be reset later"
                          disabled
                        />

                        <Button
                          width="sm:mt-5 mt-2 w-full sm:w-fit h-14"
                          onClick={() =>
                            setFieldValue(
                              "temporaryPassword",
                              generatePassword(12)
                            )
                          }
                        >
                          Generate Password
                        </Button>
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

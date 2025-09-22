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

const steps = [
  "Personal Info",
  "Employment / Business Info",
  "Guarantor Info",
  "Document Uploads",
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
}

const initialValues: ClientFormValues = {
  firstName: "",
  lastName: "",
  gender: "",
  dob: null,
  email: "",
  phoneNumber: "",
  residentialAddress: "",
  stateOfResidence: "",
  LGAOfResidence: "",
  employmentType: "",
  occupation: "",
  monthlyIncome: "",
  employer: "",
  workAddress: "",
  yearsInBusiness: "",
  guarantorFullName: "",
  relationshipToClient: "",
  guarantorPhoneNumber: "",
  guarantorAddress: "",
  idDocument: null,
  addressDocument: null,
  passportDocument: null,
};

export default function AddClient() {
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

    Yup.object({
      employmentType: Yup.string().required("Employment type is required"),
      occupation: Yup.string().required(
        "Occupation / Business Type is required"
      ),
      monthlyIncome: Yup.number()
        .typeError("Monthly income must be a number")
        .positive("Monthly income must be positive")
        .required("Monthly income is required"),
      employer: Yup.string().nullable(),
      workAddress: Yup.string().nullable(),
      yearsInBusiness: Yup.number()
        .typeError("Years must be a number")
        .positive("Years must be positive")
        .nullable(),
    }),

    Yup.object({
      guarantorFullName: Yup.string().required(
        "Guarantor full name is required"
      ),
      relationshipToClient: Yup.string().required(
        "Relationship to client is required"
      ),
      guarantorPhoneNumber: Yup.string()
        .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
        .required("Guarantor phone number is required"),
      guarantorAddress: Yup.string().required("Guarantor address is required"),
    }),

    Yup.object({
      idDocument: Yup.mixed<File>()
        .required("Valid ID is required")
        .test("fileSize", "File too large (max 5 MB)", (value) => {
          return value ? value.size <= 5 * 1024 * 1024 : false;
        })
        .test("fileType", "Unsupported file format", (value) => {
          return value
            ? ["image/jpeg", "image/png", "application/pdf"].includes(
                value.type
              )
            : false;
        }),

      addressDocument: Yup.mixed<File>()
        .required("Utility Bill / Proof of Address is required")
        .test("fileSize", "File too large (max 5 MB)", (value) => {
          return value ? value.size <= 5 * 1024 * 1024 : false;
        })
        .test("fileType", "Unsupported file format", (value) => {
          return value
            ? ["image/jpeg", "image/png", "application/pdf"].includes(
                value.type
              )
            : false;
        }),

      passportDocument: Yup.mixed<File>()
        .required("Passport photograph is required")
        .test("fileSize", "File too large (max 5 MB)", (value) => {
          return value ? value.size <= 5 * 1024 * 1024 : false;
        })
        .test("fileType", "Unsupported file format", (value) => {
          return value
            ? ["image/jpeg", "image/png", "application/pdf"].includes(
                value.type
              )
            : false;
        }),
    }),
  ];

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
                if (activeStep === steps.length - 1) {
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
                    <div className="space-y-2">
                      <SelectInput
                        name="employmentType"
                        label="Employment Type"
                      >
                        <option value="" className="text-gray-400">
                          Select employment type
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </SelectInput>

                      <TextInput
                        name="occupation"
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
                        label="Work Address (Optional)"
                        placeholder="Enter work address"
                      />

                      <TextInput
                        name="yearsInBusiness"
                        type="text"
                        label="Years in Business/Job (Optional)"
                        placeholder="Enter years in business/job	"
                      />
                    </div>
                  )}

                  {/* step 3 */}
                  {activeStep === 2 && (
                    <div className="space-y-2">
                      <TextInput
                        name="guarantorFullName"
                        type="text"
                        label="Guarantor's Full Name"
                        placeholder="Enter guarantor’s ful name"
                      />

                      <SelectInput
                        name="relationshipToClient"
                        label="Relationship to Client"
                      >
                        <option value="">Select relationship to client</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </SelectInput>

                      <TextInput
                        name="guarantorPhoneNumber"
                        type="text"
                        label="Phone Number"
                        placeholder="Enter guarantor’s phone number"
                      />

                      <TextInput
                        name="guarantorAddress"
                        type="text"
                        label="Address"
                        placeholder="Enter guarantor’s address"
                      />
                    </div>
                  )}

                  {activeStep === 3 && (
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
                      <Button type="submit">Finish</Button>
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

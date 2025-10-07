import * as Yup from "yup";

// Login validation schema
export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Director login validation schema
export const directorLoginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Manager login validation schema
export const managerLoginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Agent login validation schema
export const agentLoginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Client form validation schemas
export const clientValidationSchemas = [
  // Step 1: Personal Info
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.date()
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
    lgaOfResidence: Yup.string().required("LGA of residence is required"),
  }),

  // Step 2: Employment / Business Info
  Yup.object({
    employmentType: Yup.string()
      .oneOf(
        ["employed", "self-employed", "business-owner", "unemployed"],
        "Employment type must be employed, self-employed, business-owner, or unemployed"
      )
      .required("Employment type is required"),
    occupationOrBusinessType: Yup.string().required(
      "Occupation / Business Type is required"
    ),
    monthlyIncome: Yup.number()
      .typeError("Monthly income must be a number")
      .positive("Monthly income must be positive")
      .required("Monthly income is required"),
    employer: Yup.string().nullable(),
    workAddress: Yup.string()
      .nullable()
      .test(
        "min-length",
        "Work address must be at least 10 characters long",
        function (value) {
          if (!value || value.trim() === "") return true; // Allow empty/null values
          return value.length >= 10;
        }
      ),
    yearsInBusiness: Yup.number()
      .typeError("Years must be a number")
      .positive("Years must be positive")
      .required("Years in business/job is required"),
  }),

  // Step 3: Guarantor Info
  Yup.object({
    guarantorFullName: Yup.string().required("Guarantor full name is required"),
    guarantorRelationship: Yup.string().required(
      "Relationship to client is required"
    ),
    guarantorPhoneNumber: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .required("Guarantor phone number is required"),
    guarantorAddress: Yup.string().required("Guarantor address is required"),
    secondaryGuarantorFullName: Yup.string().required(
      "Secondary guarantor full name is required"
    ),
    secondaryGuarantorRelationship: Yup.string().required(
      "Secondary guarantor relationship is required"
    ),
    secondaryGuarantorPhoneNumber: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
      .required("Secondary guarantor phone number is required"),
    secondaryGuarantorAddress: Yup.string().required(
      "Secondary guarantor address is required"
    ),
  }),

  // Step 4: Document Uploads
  Yup.object({
    validNIN: Yup.string().required("Valid NIN document is required"),
    utilityBill: Yup.string().required(
      "Utility Bill / Proof of Address is required"
    ),
    passport: Yup.string().required("Passport photograph is required"),
  }),
];

// Agent form validation schemas
export const agentValidationSchemas = [
  // Step 1: Personal Information
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    residentialAddress: Yup.string().required(
      "Residential address is required"
    ),
    stateOfResidence: Yup.string().required("State of residence is required"),
    lgaOfResidence: Yup.string().required("LGA of residence is required"),
    bankName: Yup.string().required("Bank name is required"),
    bankAccount: Yup.string().required("Bank account number is required"),
  }),
  // Step 2: Employment Details
  Yup.object({
    employmentType: Yup.string().required("Employment type is required"),
    dateOfEmployment: Yup.date().required("Date of employment is required"),
    validNIN: Yup.string().required("Valid NIN is required"),
    utilityBill: Yup.string().required("Utility bill is required"),
    passport: Yup.string().required("Passport photo is required"),
    employmentLetter: Yup.string().required("Employment letter is required"),
  }),
  // Step 3: System Access (for AddAgent only)
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
  // Step 4: Permissions
  Yup.object({
    canApproveLoans: Yup.boolean(),
    canViewReports: Yup.boolean(),
  }),
];

// Agent edit validation schemas (without password step)
export const agentEditValidationSchemas = [
  // Step 1: Personal Information
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    residentialAddress: Yup.string().required(
      "Residential address is required"
    ),
    stateOfResidence: Yup.string().required("State of residence is required"),
    lgaOfResidence: Yup.string().required("LGA of residence is required"),
  }),
  // Step 2: Employment Details
  Yup.object({
    employmentType: Yup.string().required("Employment type is required"),
    dateOfEmployment: Yup.date().required("Date of employment is required"),
    bankName: Yup.string().required("Bank name is required"),
    bankAccount: Yup.string().required("Bank account number is required"),
  }),
  // Step 3: Documents
  Yup.object({
    validNIN: Yup.string().required("Valid NIN is required"),
    utilityBill: Yup.string().required("Utility bill is required"),
    passport: Yup.string().required("Passport photo is required"),
    employmentLetter: Yup.string().required("Employment letter is required"),
  }),
];

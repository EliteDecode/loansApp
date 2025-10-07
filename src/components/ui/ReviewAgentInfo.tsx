import { useFormikContext } from "formik";
import Button from "../Button/Button";
import edit from "@/assets/icons/edit-icon.svg"; // adjust path
import check from "@/assets/icons/checkGreen.svg"; // adjust path
import pdf from "@/assets/icons/pdf.svg"; // adjust path

// Define the shape of your form values
interface AgentFormValues {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  dateOfBirth: string | Date | null;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  lgaOfResidence: string;
  bankName: string;
  bankAccount: string;
  employmentType: "full-time" | "part-time" | "contract" | "self-employed";
  dateOfEmployment: string | Date | null;
  password: string;
  confirmPassword: string;
  salaryAmount: string | number;

  // file uploads
  validNIN?: string;
  utilityBill?: string;
  passport?: string;
  employmentLetter?: string;
}

interface ReviewAgentInfoProps {
  setActiveStep: (step: number) => void;
}

export default function ReviewAgentInfo({
  setActiveStep,
}: ReviewAgentInfoProps) {
  const { values } = useFormikContext<AgentFormValues>();

  const formatDate = (date: string | Date | null): string => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return d instanceof Date && !isNaN(d.getTime())
      ? d.toLocaleDateString()
      : "-";
  };

  const formatCurrency = (amount: string | number): string => {
    if (!amount) return "-";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return isNaN(num) ? "-" : `₦${num.toLocaleString()}`;
  };

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="text-[16px] leading-[145%] text-gray-500 max-w-[300px] w-full">
      <p>{label}</p>
      <p className="font-semibold text-gray-800 truncate">{value || "-"}</p>
    </div>
  );

  // Map file fields to labels
  const documents = [
    { key: "validNIN", label: "Valid NIN" },
    { key: "utilityBill", label: "Utility Bill" },
    { key: "passport", label: "Passport Photograph" },
    { key: "employmentLetter", label: "Employment Letter" },
  ] as const;

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-500">
        Review all information before creating the agent profile
      </h1>

      {/* PERSONAL INFO */}
      <div className="bg-white p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-medium text-gray-600">
            Personal Information
          </h2>
          <Button
            icon={<img src={edit} />}
            variant="outline"
            onClick={() => setActiveStep(0)}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <InfoRow label="First Name" value={values.firstName} />
          <InfoRow label="Last Name" value={values.lastName} />
          <InfoRow label="Gender" value={values.gender} />
          <InfoRow
            label="Date of Birth"
            value={formatDate(values.dateOfBirth)}
          />
          <InfoRow label="Email Address" value={values.email} />
          <InfoRow label="Phone Number" value={values.phoneNumber} />
          <InfoRow
            label="Residential Address"
            value={values.residentialAddress}
          />
          <InfoRow label="State of Residence" value={values.stateOfResidence} />
          <InfoRow label="LGA of Residence" value={values.lgaOfResidence} />
        </div>
      </div>

      {/* WORK & ROLE */}
      <div className="bg-white p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-medium text-gray-600">
            Work & Role Details
          </h2>
          <Button
            icon={<img src={edit} />}
            variant="outline"
            onClick={() => setActiveStep(1)}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <InfoRow label="Bank Name" value={values.bankName} />
          <InfoRow label="Bank Account" value={values.bankAccount} />
          <InfoRow label="Employment Type" value={values.employmentType} />
          <InfoRow
            label="Date of Employment"
            value={formatDate(values.dateOfEmployment)}
          />
          <InfoRow
            label="Salary Amount"
            value={formatCurrency(values.salaryAmount)}
          />
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="bg-white p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-medium text-gray-600">Documents</h2>
          <Button
            icon={<img src={edit} />}
            variant="outline"
            onClick={() => setActiveStep(2)}
          >
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => {
            const fileUrl = values[doc.key];
            return (
              <div
                key={doc.key}
                className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3"
              >
                <div className="flex items-center gap-2">
                  <img src={pdf} />
                  <p className="text-[16px] text-gray-400">{doc.label}</p>
                </div>
                {fileUrl ? (
                  <div className="flex items-center gap-2">
                    <img src={check} />
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm hover:underline"
                    >
                      View
                    </a>
                  </div>
                ) : (
                  <span className="text-gray-400">Not Uploaded</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useFormikContext } from "formik";
import Button from "../Button/Button";
import edit from "@/assets/icons/edit-icon.svg"; // adjust path
import check from "@/assets/icons/checkGreen.svg"; // adjust path
import pdf from "@/assets/icons/pdf.svg"; // adjust path

// Define the shape of your form values
interface AgentFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string | Date | null;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  LGAOfResidence: string;
  employmentType: string;
  doe: string | Date | null;
  status: string;
  temporaryPassword: string;

  // file uploads
  idDocument?: File | null;
  addressDocument?: File | null;
  passportDocument?: File | null;
  employmentLetter?: File | null;
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

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="text-[16px] leading-[145%] text-gray-500 max-w-[300px] w-full">
      <p>{label}</p>
      <p className="font-semibold text-gray-800 truncate">{value || "-"}</p>
    </div>
  );

  // Map file fields to labels
  const documents = [
    { key: "idDocument", label: "Valid ID" },
    { key: "addressDocument", label: "Proof of Address" },
    { key: "passportDocument", label: "Passport Photograph" },
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
          <InfoRow label="Date of Birth" value={formatDate(values.dob)} />
          <InfoRow label="Email Address" value={values.email} />
          <InfoRow label="Phone Number" value={values.phoneNumber} />
          <InfoRow
            label="Residential Address"
            value={values.residentialAddress}
          />
          <InfoRow label="State of Residence" value={values.stateOfResidence} />
          <InfoRow label="LGA of Residence" value={values.LGAOfResidence} />
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
          <InfoRow label="Employment Type" value={values.employmentType} />
          <InfoRow label="Date of Employment" value={formatDate(values.doe)} />
          <InfoRow label="Status" value={values.status} />
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
            const file = values[doc.key];
            return (
              <div
                key={doc.key}
                className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3"
              >
                <div className="flex items-center gap-2">
                  <img src={pdf} />
                  <p className="text-[16px] text-gray-400">{doc.label}</p>
                </div>
                {file ? (
                  <img src={check} />
                ) : (
                  <span className="text-gray-400">Not Uploaded</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SYSTEM ACCESS */}
      <div className="bg-white p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-medium text-gray-600">
            System Access
          </h2>
          <Button
            icon={<img src={edit} />}
            variant="outline"
            onClick={() => setActiveStep(3)}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <InfoRow label="Login Email" value={values.email} />
          <InfoRow
            label="Temporary Password"
            value={values.temporaryPassword}
          />
        </div>
      </div>
    </div>
  );
}

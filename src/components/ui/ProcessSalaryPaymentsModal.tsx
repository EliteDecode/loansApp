import miscIcon from "@/assets/icons/misc-icon.svg";
import Button from "../Button/Button";

// ✅ Props type
interface ProcessSalaryPaymentProps {
  onClose: () => void;
}

export default function ProcessSalaryPaymentsModal({
  onClose,
}: ProcessSalaryPaymentProps) {
  return (
    <div className="space-y-4 leading-[145%]">
      <div className="bg-[#FF8D2814] p-5 flex items-start gap-4 border border-[#FF8D28]">
        <img src={miscIcon} />

        <div className="space-y-1 ">
          <h6 className="text-[16px] font-semibold text-gray-900">
            Confirm Salary Processing
          </h6>
          <p className="text-[14px] text-gray-600">
            Process salary payment for all users? This action will update
            payment records for all pending salaries
          </p>
        </div>
      </div>

      <div className="px-4 flex items-center gap-6 border-b-[0.6px] border-gray-200 h-[39px] text-[16px]">
        <p className="text-gray-600">Total Employees:</p>
        <h1 className="text-gray-600 font-medium">7</h1>
      </div>

      <div className="px-4 flex items-center gap-6 border-b-[0.6px] border-gray-200 h-[39px] text-[16px]">
        <p className="text-gray-600">Total Amount:</p>
        <h1 className="text-gray-600 font-medium">₦2,015,000</h1>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button>Process All Salaries</Button>
      </div>
    </div>
  );
}

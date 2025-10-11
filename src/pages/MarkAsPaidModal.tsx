import Button from "@/components/Button/Button";

interface StaffInfo {
  staffName: string;
  currentSalary: number;
  staffType?: string;
}

interface MarkAsPaidProps {
  onClose: () => void;
  staff: StaffInfo;
  onConfirm: () => void;
}

export default function MarkAsPaidModal({
  onClose,
  staff,
  onConfirm,
}: MarkAsPaidProps) {
  const { staffName, currentSalary, staffType } = staff;

  return (
    <div className="space-y-6 pt-4 leading-[145%] text-gray-700">
      <h1 className="text-center text-[22px] sm:text-[24px] leading-[120%] tracking-[-2%] font-semibold">
        Confirm Payment
      </h1>

      <p className="text-[15px] sm:text-[16px] text-center text-gray-600">
        Are you sure you want to mark the salary payment of{" "}
        <span className="font-semibold text-gray-900">
          ₦{currentSalary.toLocaleString()}
        </span>{" "}
        for <span className="font-semibold text-gray-900">{staffName}</span>
        {staffType ? ` (${staffType})` : ""} as paid?
      </p>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={onConfirm} type="button">
          Mark as Paid
        </Button>
      </div>
    </div>
  );
}

import Button from "@/components/Button/Button";

interface MarkAsPaidProps {
  onClose: () => void;
}

export default function MarkAsPaidModal({ onClose }: MarkAsPaidProps) {
  return (
    <div className="space-y-4 pt-4">
      <h1 className="text-center text-[24px] leading-[120%] tracking-[-2%] font-semibold text-gray-700">
        Confirm Action
      </h1>
      <p className="text-[16px] leading-[145%] text-gray-700 text-center">
        Are you sure you want to mark salary payment of{" "}
        <span className="font-semibold">₦450,000</span> for{" "}
        <span className="font-semibold">Adebayo Olumide</span> as paid?
      </p>

      <div className="flex items-center justify-center gap-4 ">
        <Button variant="outline" type="button" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button variant="success">Mark as paid</Button>
      </div>
    </div>
  );
}

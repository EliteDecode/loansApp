import infoIcon from "@/assets/icons/info-triangle.svg";
import Button from "../Button/Button";

// ✅ Define props type
interface ConfirmSystemShutdownProps {
  setOpenShutdownPasswordModal: (open: boolean) => void;
  onClose: () => void;
}

export default function ConfirmSystemShutdown({
  setOpenShutdownPasswordModal,
  onClose,
}: ConfirmSystemShutdownProps) {
  return (
    <div className="flex items-center justify-center flex-col gap-6 text-center">
      <img src={infoIcon} alt="info warning icon" />
      <h4 className="text-[24px] leading-[120%] tracking-[-2%] font-semibold text-gray-700">
        Confirm System Shutdown
      </h4>
      <p className="text-[16px] leading-[145%] text-gray-600 px-6">
        Are you sure you want to shut down all operations?
        <span className="block">
          This will immediately disable loan processing, repayments, and user
          access until reactivated.
        </span>
      </p>

      <div className="space-x-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onClose();
            setOpenShutdownPasswordModal(true);
          }}
        >
          Shutdown
        </Button>
      </div>
    </div>
  );
}

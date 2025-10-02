import refresh from "@/assets/icons/refresh.svg";
import Button from "../Button/Button";

// ✅ Define props type
interface ConfirmSystemRestoreProps {
  setOpenShutdownPasswordModal: (open: boolean) => void;
  onClose: () => void;
}

export default function ConfirmSystemRestore({
  setOpenShutdownPasswordModal,
  onClose,
}: ConfirmSystemRestoreProps) {
  return (
    <div className="flex items-center justify-center flex-col gap-6 text-center">
      <img src={refresh} alt="refresh icon" />
      <h4 className="text-[24px] leading-[120%] tracking-[-2%] font-semibold text-gray-700">
        Confirm System Shutdown
      </h4>
      <p className="text-[16px] leading-[145%] text-gray-600 px-6">
        Are you sure you want to restore system operations?
        <span className="block">
          This will immediately re-enable loan processing, repayments, and user
          access across the platform.
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
          Restore
        </Button>
      </div>
    </div>
  );
}

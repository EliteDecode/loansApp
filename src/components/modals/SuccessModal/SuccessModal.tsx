import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Button from "@/components/Button/Button";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
}

export default function SuccessModal({
  open,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "Continue",
  showCancel = false,
  cancelText = "Cancel",
}: SuccessModalProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (open) {
      // Trigger animation after modal opens
      const timer = setTimeout(() => {
        setShowCheckmark(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowCheckmark(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 0,
        },
      }}
    >
      <DialogContent className="text-center py-8 px-6">
        {/* Animated Checkmark */}
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto">
            {/* Circle Background */}
            <div
              className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
                showCheckmark
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            />

            {/* Animated Checkmark */}
            <svg
              className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                showCheckmark ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500"
                style={{
                  strokeDasharray: "20",
                  strokeDashoffset: showCheckmark ? "0" : "20",
                  transition: "stroke-dashoffset 0.5s ease-in-out 0.2s",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Success Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mt-8">
          {showCancel && (
            <Button variant="neutral" onClick={onClose} className="px-6">
              {cancelText}
            </Button>
          )}
          <Button onClick={handleConfirm} className="px-6">
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

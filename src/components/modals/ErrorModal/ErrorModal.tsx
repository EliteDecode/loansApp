import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Button from "@/components/Button/Button";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showRetry?: boolean;
}

export default function ErrorModal({
  open,
  onClose,
  title = "Something went wrong",
  message,
  onRetry,
  retryText = "Try Again",
  showRetry = false,
}: ErrorModalProps) {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    if (open) {
      // Trigger animation after modal opens
      const timer = setTimeout(() => {
        setShowIcon(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowIcon(false);
    }
  }, [open]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
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
        {/* Animated Error Icon */}
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto">
            {/* Circle Background */}
            <div
              className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
                showIcon
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            />

            {/* Animated X Icon */}
            <svg
              className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                showIcon ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
                style={{
                  strokeDasharray: "24",
                  strokeDashoffset: showIcon ? "0" : "24",
                  transition: "stroke-dashoffset 0.5s ease-in-out 0.2s",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mt-8">
          <Button variant="neutral" onClick={onClose} className="px-6">
            Close
          </Button>
          {showRetry && (
            <Button onClick={handleRetry} className="px-6">
              {retryText}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

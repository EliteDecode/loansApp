import React from "react";
import Button from "@/components/Button/Button";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "danger" | "primary";
  loading?: boolean;
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  loading = false,
}: ConfirmationModalProps) {
  if (!open) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "⚠️",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          confirmVariant: "danger" as const,
        };
      case "primary":
        return {
          icon: "ℹ️",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          confirmVariant: "primary" as const,
        };
      default: // warning
        return {
          icon: "⚠️",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          confirmVariant: "warning" as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 bg-opacity-30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          {/* Icon */}
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} mb-4`}
          >
            <span className={`text-2xl ${styles.iconColor}`}>
              {styles.icon}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="neutral"
              onClick={onClose}
              disabled={loading}
              className="px-6"
            >
              {cancelText}
            </Button>
            <Button
              variant={styles.confirmVariant}
              onClick={onConfirm}
              disabled={loading}
              className="px-6"
            >
              {loading ? "Processing..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

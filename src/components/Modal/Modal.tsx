"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[90%]",
} as const;

// 🔑 Define type for size keys
type ModalSize = keyof typeof sizeMap;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnOutsideClick?: boolean;
  children: ReactNode;
  title?: string;
  size?: ModalSize; // ✅ sm | md | lg | xl | full
  maxWidth?: string; // ✅ override tailwind class e.g. "max-w-[855px]"
}

export default function Modal({
  isOpen,
  onClose,
  closeOnOutsideClick = true,
  children,
  title,
  size = "md",
  maxWidth,
}: ModalProps) {
  // Decide final width class
  const widthClass = maxWidth ? maxWidth : sizeMap[size] || sizeMap.md;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0"
            onClick={() => closeOnOutsideClick && onClose()}
          />

          {/* Modal Content */}
          <motion.div
            className={`relative z-10 w-full ${widthClass} rounded-2xl bg-white p-6 shadow-lg mx-6`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[24px] leading-[120%] font-medium text-gray-700 tracking-[-2%]">
                  {title}
                </h2>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

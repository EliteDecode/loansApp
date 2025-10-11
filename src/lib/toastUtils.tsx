import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

/* ✅ Reusable Toast Container with Animation */
const ToastContainer = ({ t, icon, title, message, color }: any) => (
  <AnimatePresence>
    {t.visible && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="max-w-sm w-full bg-white shadow-lg border border-slate-100 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm"
        role="status"
      >
        <div
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-semibold text-[15px] text-gray-800">{title}</h4>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-400 hover:text-gray-700 text-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="text-[13px] text-gray-600 mt-1 leading-snug">
            {message}
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ✅ Icons (cleaner + unified size) */
const CheckIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path
      d="M5 12l4 4L19 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <path
      d="M6 6l12 12M18 6l-12 12"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ✅ showSuccessToast(message, title?)
 */
export function showSuccessToast(message: string, title = "Success") {
  toast.custom(
    (t) => (
      <ToastContainer
        t={t}
        icon={<CheckIcon />}
        title={title}
        message={message}
        color="#16A34A"
      />
    ),
    { id: `success-${Date.now()}` }
  );
}

/**
 * ❌ showErrorToast(message, title?)
 */
export function showErrorToast(message: string, title = "Error") {
  toast.custom(
    (t) => (
      <ToastContainer
        t={t}
        icon={<XIcon />}
        title={title}
        message={message}
        color="#DC2626"
      />
    ),
    { id: `error-${Date.now()}` }
  );
}

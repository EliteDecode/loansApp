import toast from "react-hot-toast";

// ✅ Success Icon
const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-3">
    <circle cx="12" cy="12" r="10" fill="#16A34A" />
    <path
      d="M7 12.5l2.5 2.5L17 8"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ✅ Error Icon
const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-3">
    <circle cx="12" cy="12" r="10" fill="#DC2626" />
    <path
      d="M8 8l8 8M16 8l-8 8"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * ✅ showSuccessToast(message, title?)
 */
export function showSuccessToast(message, title = "Success") {
  toast.custom(
    (t) => (
      <div
        className={`max-w-md w-full bg-white shadow-lg rounded-xl p-4 flex items-start gap-3 
          transition-all duration-300 ${
            t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        role="status"
      >
        <div className="flex-shrink-0">
          <SuccessIcon />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="font-medium text-sm text-slate-900">{title}</div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-400 hover:text-slate-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-1 text-xs text-slate-600">{message}</div>
        </div>
      </div>
    ),
    { id: `success-${Date.now()}` }
  );
}

/**
 * ❌ showErrorToast(message, title?)
 */
export function showErrorToast(message, title = "Error") {
  toast.custom(
    (t) => (
      <div
        className={`max-w-md w-full bg-white shadow-lg rounded-xl p-4 flex items-start gap-3 
          transition-all duration-300 ${
            t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        role="alert"
      >
        <div className="flex-shrink-0">
          <ErrorIcon />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="font-medium text-sm text-slate-900">{title}</div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-400 hover:text-slate-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-1 text-xs text-slate-600">{message}</div>
        </div>
      </div>
    ),
    { id: `error-${Date.now()}` }
  );
}

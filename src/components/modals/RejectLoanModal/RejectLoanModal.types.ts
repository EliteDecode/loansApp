export type RejectLoanModalProps = {
  onClose: () => void;
  onConfirm?: (comment: string) => void; // 👈 added back
};

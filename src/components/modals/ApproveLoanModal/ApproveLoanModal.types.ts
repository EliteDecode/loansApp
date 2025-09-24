export type ApproveLoanModalProps = {
  onClose: () => void;
  onConfirm?: (comment: string) => void; // 👈 added back
};

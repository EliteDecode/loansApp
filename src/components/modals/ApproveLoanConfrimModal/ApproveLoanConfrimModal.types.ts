export type ApproveLoanConfirmModalProps = {
  data: {
    id: string | number;
    name: string;
    comment?: string; // optional if user may or may not add it
  } | null;
  onClose: () => void;
  onConfirm?: () => void; // optional, if you need a callback for approving
};

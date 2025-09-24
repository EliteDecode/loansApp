import React from "react";
import Button from "../../Button/Button";
import type { ApproveLoanConfirmModalProps } from "./ApproveLoanConfrimModal.types";

export default function ApproveLoanConfrimModal({
  data,
  onClose,
}: ApproveLoanConfirmModalProps) {
  console.log(data);
  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <h1 className="text-[24px] leading-[120%] text-gray-700 font-semibold">
        Confirm Loan Approval
      </h1>
      <p className="text-center text-[16px] text-gray-600">
        Are you sure you want to approve a loan of{" "}
        <span className="font-semibold">₦1,500,000</span> for
        <span className="font-semibold">{data?.name}</span>?
      </p>

      <div className="space-x-4">
        <Button variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button variant="success">Yes, Approve</Button>
      </div>
    </div>
  );
}

import Button from "../Button/Button";

// ✅ Define props type
interface DeactivateManagerProps {
  onCancel: () => void;
}

export default function DeactivateManager({
  onCancel,
}: DeactivateManagerProps) {
  return (
    <div className="space-y-8">
      <p className="text-start text-[16px] leading-[145%] text-gray-700">
        Are you sure you want to deactivate <strong>Adebayo Olumide</strong>?
        This will restrict access but not delete data.
      </p>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger">Confirm</Button>
      </div>
    </div>
  );
}

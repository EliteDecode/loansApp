import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import Button from "../Button/Button";
import editIcon from "@/assets/icons/edit-icon.svg";
import deactivateIcon from "@/assets/icons/info-circle-D.svg";

// ✅ Define props type
interface ManagerDetailsProps {
  setDeactivateManager: (open: boolean) => void;
  setEditmanager: (open: boolean) => void;
  onCancel: () => void;
}

export default function ManagerDetails({
  setDeactivateManager,
  setEditmanager,
  onCancel,
}: ManagerDetailsProps) {
  const value = "Manager";

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="flex gap-6">
        <img
          src={profileImage}
          alt="Manager profile"
          className="h-20 w-20 object-cover rounded-[40px]"
        />

        <div className="space-y-2">
          <h6 className="text-[20px] leading-[120%] tracking-[-2%] font-semibold text-gray-700">
            Adebayo Olumide
          </h6>
          <p className="text-[14px] text-gray-500">Manager ID: #MG001</p>
          <p
            className={`px-3 py-1 text-[12px] leading-[145%] rounded-[12px] w-fit ${
              {
                Manager: "bg-[#8B15C21A] text-[#8B15C2]",
                Agent: "bg-[#0088FF1A] text-[#0088FF]",
              }[value] || "bg-gray-100 text-gray-600"
            }`}
          >
            {value}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="text-[16px] leading-[145%] text-gray-600 flex items-center gap-6 h-[39px] border-b border-gray-200">
        <p className="font-medium">Email Address:</p>
        <p>adebayo.olumide@asavictory.ng</p>
      </div>

      {/* Phone */}
      <div className="text-[16px] leading-[145%] text-gray-600 flex items-center gap-6 h-[39px] border-b border-gray-200">
        <p className="font-medium">Phone Number:</p>
        <p>09123456789</p>
      </div>

      {/* Status */}
      <div className="text-[16px] leading-[145%] text-gray-600 flex items-center gap-6 h-[39px] border-b border-gray-200">
        <p className="font-medium">Status:</p>
        <p
          className={`px-3 py-1 text-[12px] leading-[145%] rounded-[12px] w-fit ${
            {
              Manager: "bg-[#8B15C21A] text-[#8B15C2]",
              Agent: "bg-[#0088FF1A] text-[#0088FF]",
            }[value] || "bg-gray-100 text-gray-600"
          }`}
        >
          Active
        </p>
      </div>

      {/* Buttons */}
      <Button
        variant="outline"
        icon={<img src={editIcon} alt="edit" />}
        width="w-full"
        height="h-14"
        onClick={() => {
          onCancel();
          setEditmanager(true);
        }}
      >
        Edit Manager
      </Button>

      <Button
        variant="danger"
        icon={<img src={deactivateIcon} alt="deactivate" />}
        width="w-full"
        height="h-14"
        onClick={() => {
          onCancel();
          setDeactivateManager(true);
        }}
      >
        Deactivate Manager
      </Button>
    </div>
  );
}

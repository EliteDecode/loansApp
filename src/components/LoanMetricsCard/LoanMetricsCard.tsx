import type { LoanMetricsCardProps } from "./LoanMetricsCard.types";

export default function LoanMetricsCard({
  title = "Clients Registered",
  value = "0",
  icon,
  iconBg = "#C120C91A",
}: LoanMetricsCardProps) {
  return (
    <div className="flex items-start justify-between min-w-[258px] w-full h-fit p-4 border border-[#E4E7EC] rounded-2xl shadow-[0px_5px_3px_-2px_#00000005,0px_3px_2px_-2px_#0000000F]">
      {/* Left Section */}
      <div className="leading-[145%] space-y-4 tracking-[-0.5%] font-medium">
        <p className="text-gray-500 font-medium leading-[145%] tracking-[-0.5%] text-[12px]">
          {title}
        </p>
        <div className="space-y-2">
          <h1 className="md:text-[32px] text-[24px] tracking-[-2%] text-gray-800 font-semibold leading-[120%]">
            {value}
          </h1>
        </div>
      </div>

      {/* Right Section (Icon) */}
      <div
        className="h-12 w-12 flex items-center justify-center rounded-[8px]"
        style={{ backgroundColor: iconBg }}
      >
        {icon && <img src={icon} alt="icon" className="h-6 w-6" />}
      </div>
    </div>
  );
}

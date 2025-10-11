import type { LoanMetricsCardProps } from "./LoanMetricsCard.types";

export default function LoanMetricsCard({
  title = "Clients Registered",
  value = "0",
  icon,
  iconBg = "#C120C91A",
  isLoading = false,
}: LoanMetricsCardProps & { isLoading?: boolean }) {
  return (
    <div className="flex items-start justify-between min-w-[258px] w-full h-fit p-4 border border-[#E4E7EC] rounded-2xl shadow-[0px_5px_3px_-2px_#00000005,0px_3px_2px_-2px_#0000000F]">
      {isLoading ? (
        <div className="flex w-full justify-between items-center animate-pulse">
          <div className="space-y-3 w-2/3">
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-[8px]"></div>
        </div>
      ) : (
        <>
          <div className="leading-[145%] space-y-4 tracking-[-0.5%] font-medium">
            <p className="text-gray-500 text-[12px]">{title}</p>
            <h1 className="md:text-[32px] text-[24px] tracking-[-2%] text-gray-800 font-semibold leading-[120%]">
              {value}
            </h1>
          </div>

          <div
            className="h-12 w-12 flex items-center justify-center rounded-[8px]"
            style={{ backgroundColor: iconBg }}
          >
            {icon && <img src={icon} alt="icon" className="h-6 w-6" />}
          </div>
        </>
      )}
    </div>
  );
}

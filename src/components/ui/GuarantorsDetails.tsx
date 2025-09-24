import user from "@/assets/icons/user.svg";
import verifiedGreen from "@/assets/icons/verifiedGreen.svg";

export default function GuarantorsDetails() {
  return (
    <div className="flex items-start gap-4 flex-col lg:flex-row">
      <div className="space-y-6 border-[0.6px]  border-gray-200 rounded-[12px] w-full">
        <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
          <img src={user} alt="user-icon" className="w-8 h-8" />
          <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
            Primary Guarantor
          </p>
        </div>

        <div className="space-y-4 pb-4 lg:min-h-fit h-full">
          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Full Name:
            </p>
            <p>John Yinka</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Relationship
            </p>
            <p>Wife</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Phone Number:
            </p>
            <p>08123456789</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Email Address:
            </p>
            <p>John.yinka@gmail.com</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Address:
            </p>
            <p>15 Ogundimu Street, Ikeja, Lagos State, Nigeria</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[142px] text-wrap font-medium">
              Verification Status
            </p>
            <div className="flex gap-1 items-center text-[#34C759]">
              <img src={verifiedGreen} />
              <p>Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Occupation:
            </p>
            <p>Medical Doctor</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
        <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
          <img src={user} alt="user-icon" className="w-8 h-8" />
          <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
            Secondary Guarantor
          </p>
        </div>

        <div className="space-y-4 pb-4 lg:min-h-fit h-full">
          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Full Name:
            </p>
            <p>John Yinka</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Relationship
            </p>
            <p>Wife</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Phone Number:
            </p>
            <p>08123456789</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Email Address:
            </p>
            <p>John.yinka@gmail.com</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Address:
            </p>
            <p>15 Ogundimu Street, Ikeja, Lagos State, Nigeria</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[142px] text-wrap font-medium">
              Verification Status
            </p>
            <div className="flex gap-1 items-center text-[#34C759]">
              <img src={verifiedGreen} />
              <p>Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Occupation:
            </p>
            <p>Medical Doctor</p>
          </div>
        </div>
      </div>
    </div>
  );
}

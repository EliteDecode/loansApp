import receipt from "@/assets/icons/receipt.svg";

export default function ClientsInfo() {
  return (
    <div className="flex items-start gap-4 flex-col lg:flex-row">
      <div className="space-y-6 border-[0.6px]  border-gray-200 rounded-[12px] w-full">
        <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
          <img src={receipt} alt="receipt-icon" />
          <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
            Personal Information
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
              Date of Birth:
            </p>
            <p>March 15, 1988 (36 years)</p>
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
            <p className="w-full max-w-[130px] text-wrap font-medium">
              State of Origin:
            </p>
            <p>Ondo State</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              LGA of Origin:
            </p>
            <p>Owo Local Government</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
        <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4  rounded-t-[12px]">
          <img src={receipt} alt="money-icon" />
          <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
            Employment Details
          </p>
        </div>

        <div className="space-y-4 pb-4 lg:min-h-fit h-full">
          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Employer:
            </p>
            <p>Self Employed</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Position:
            </p>
            <p>Small Business Owner (Fashion)</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Monthly Income:
            </p>
            <p>₦280,000 - ₦350,000</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Years of Service:
            </p>
            <p>5 Years</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Office Address:
            </p>
            <p>15 Ogundimu Street, Ikeja, Lagos State, Nigeria</p>
          </div>

          <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
            <p className="w-full max-w-[130px] text-wrap font-medium">
              Credit Score:
            </p>
            <p className="text-[#34C759]">720 (Good)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

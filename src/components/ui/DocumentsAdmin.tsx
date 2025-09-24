import pdf from "@/assets/icons/pdf.svg";
import download from "@/assets/icons/download.svg";
import warning from "@/assets/icons/info-triangle-yellow.svg";

export default function DocumentsAdmin() {
  const files = [
    "National ID Card (Approved.pdf)",
    "Utility Bill (Approved.pdf)",
    "Bank Statement (Approved.pdf)",
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4 lg:min-h-fit pb-4 h-full">
        {files.map((file, i) => (
          <div
            key={i}
            className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3"
          >
            <div className="flex items-center gap-2">
              <img src={pdf} />
              <p className="text-[16px] leading-[145%] text-gray-400">{file}</p>
            </div>

            <img src={download} className="cursor-pointer" />
          </div>
        ))}
      </div>

      <div className="bg-[#FEF6E7] border-l-8 border-[#DD900D] rounded-[4px] p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="border border-[#FBE2B7] rounded-lg w-6 h-6 flex items-center justify-center">
              <img src={warning} alt="warning" />
            </div>

            <h1 className="text-[16px] leading-[145%] text-gray-900 font-semibold">
              Pending Documents
            </h1>
          </div>

          <p className="text-[14px] leading-[145%] text-gray-600">
            The following documents are still required to complete the loan
            application:
          </p>
        </div>

        <ul className="list-disc pl-5 text-[14px] leading-[145%] text-gray-600">
          <li>Secondary Guarantor Form (signed)</li>
          <li>Passport Photograph</li>
        </ul>
      </div>
    </div>
  );
}

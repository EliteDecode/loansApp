import logo from "@/assets/icons/logo.svg";
import infoCircle from "@/assets/icons/info-circle.svg";

// ✅ Load background correctly
const bgImage = new URL(
  "../../assets/icons/gradient-lines.svg",
  import.meta.url
).href;

export default function LoginPage() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-no-repeat bg-[linear-gradient(180deg,#002D62_0%,#00295A_50%,rgba(0,100,0,0.5)_100%)] bg-cover bg-center leading-[145%]"
      style={{
        backgroundImage: `linear-gradient(180deg,#002D62_0%,#00295A_50%,rgba(0,100,0,0.5)_100%), url(${bgImage})`,
      }}
    >
      <div className="w-full max-w-md mx-3 bg-white p-8 rounded-2xl shadow-lg space-y-6 text-[14px] leading-[145%]">
        {/* Logo + Text */}
        <div className="flex items-center gap-3 flex-col">
          <div className="h-[120px] w-full flex items-center justify-center">
            <img src={logo} className="w-[290px] h-[96px]" />
          </div>
          <h1 className="text-[16px] font-medium text-gray-500 text-center">
            Access Portal Selection
          </h1>
        </div>

        {/* Security Info Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <img
              src={infoCircle}
              alt="info"
              className="w-5 h-5 mt-0.5 flex-shrink-0"
            />
            <div>
              <h3 className="font-medium text-amber-800 mb-2">
                Security Notice
              </h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                For security reasons, please use your designated login portal.
                Each user role has a specific access point to ensure proper
                authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

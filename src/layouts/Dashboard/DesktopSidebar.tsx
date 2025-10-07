import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Logo from "../../assets/icons/logo.svg";
import { getFilteredSidebarLinks } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import info from "@/assets/icons/info-triangle-primary.svg";
import type { RootState } from "@/store";

// ✅ Props type
interface DesktopSidebarProps {
  setOpenShutdownModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRestoreModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopSidebar = ({
  setOpenShutdownModal,
  setOpenRestoreModal,
}: DesktopSidebarProps) => {
  const location = useLocation();
  const { role, user } = useSelector((state: RootState) => state.auth);
  const firstSegment = location.pathname.split("/")[1];
  const filteredSidebarLinks = getFilteredSidebarLinks(role);

  // Remove for later
  const sysyemDowm = true as boolean;

  console.log(user);

  return (
    <section className="fixed">
      <motion.div
        className="w-[272px] px-2 py-6"
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
      >
        <Link
          to="/dashboard"
          className="w-full flex items-center justify-center"
        >
          <img src={Logo} alt="" className="w-[197px] " />
        </Link>

        <ul className="mt-4">
          {filteredSidebarLinks.map((val, i) => {
            return (
              <div className="" key={i}>
                {
                  <li className="pb-0.5">
                    <Link
                      to={val.link}
                      className={`${
                        (val.name.toLowerCase() === "dashboard" &&
                          firstSegment === "") ||
                        firstSegment.toLowerCase() === val.link.toLowerCase()
                          ? "bg-primary font-medium text-white hover:bg-primary hover:text-white"
                          : ""
                      } flex gap-3 items-center text-[14px] leading-[145%] md:text-[14px] h-[44px] px-6 duration-300 hover:bg-[#F9FAFB] hover:text-primary rounded`}
                    >
                      <val.icon className="md:w-5 w-3.5" />
                      {val.name}
                    </Link>
                  </li>
                }
              </div>
            );
          })}
        </ul>

        {/* System Control - Only visible to Directors */}
        {role === "director" && (
          <div className="mt-8 px-6  text-[14px] leading-[145%]">
            <p className="font-medium text-[#CB1A14]">System Control</p>

            {sysyemDowm === true ? (
              <div
                className="flex items-center gap-3 h-[44px] cursor-pointer text-gray-700"
                onClick={() => setOpenRestoreModal(true)}
              >
                <img src={info} />
                <p>Restore System</p>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 h-[44px] cursor-pointer text-gray-700"
                onClick={() => setOpenShutdownModal(true)}
              >
                <img src={info} />
                <p>Shutdown System</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default DesktopSidebar;

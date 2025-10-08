import { useSelector } from "react-redux";
import { getFilteredSidebarLinks } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import info from "@/assets/icons/info-triangle-primary.svg";
import Logo from "../../assets/icons/logo.svg";
import type { RootState } from "@/store";
import { Menu, X } from "lucide-react";

const MobileSidebar = ({
  isOpen,
  setIsOpen,
  isShutdown,
  setOpenShutdownModal,
  setOpenRestoreModal,
}: any) => {
  const location = useLocation();
  const { role } = useSelector((state: RootState) => state.auth);
  const filteredSidebarLinks = getFilteredSidebarLinks(role);

  const toggleDrawer = () => {
    setIsOpen(false);
  };

  return (
    <section>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed top-0 z-10 w-full h-full bg-black opacity-30"
        ></div>
      )}
      <motion.div
        className="fixed w-[280px] px-4 py-6 left-0 right-0 z-20 md:top-0 bg-white h-screen"
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
      >
        <div className="relative">
          <Link to="/handyman/dashboard" className="w-fit">
            <img src={Logo} alt="" className="w-[223px] " />
          </Link>
          <button
            className="absolute top-0 right-0 outline-none lg:hidden"
            onClick={toggleDrawer}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        <ul className="mt-[20px] overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {filteredSidebarLinks.map((val, i) => {
            const Icon = val.icon;

            return (
              <div className="" key={i}>
                {
                  <li className="pb-0.5">
                    <Link
                      onClick={() => setIsOpen(false)}
                      to={val.link}
                      className={`${
                        location.pathname === val.link
                          ? "bg-primary font-semibold text-white hover:bg-primary hover:text-white"
                          : ""
                      } flex gap-3 items-center text-sm md:text-base h-[56px] px-6 duration-300 hover:bg-[#008080]/[7%] hover:text-primary rounded-lg`}
                    >
                      <Icon className="md:w-4 w-3.5" />
                      {val.name}
                    </Link>
                  </li>
                }
              </div>
            );
          })}

          {/* System Control - Only visible to Directors */}
          {role === "director" && (
            <div className="mt-8 mb-4 px-6  text-[14px] leading-[145%]">
              <p className="font-medium text-[#CB1A14]">System Control</p>

              {isShutdown === true ? (
                <div
                  className="flex items-center gap-3 h-[44px] cursor-pointer text-gray-700"
                  onClick={() => {
                    setOpenRestoreModal(true), toggleDrawer();
                  }}
                >
                  <img src={info} />
                  <p>Restore System</p>
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 h-[44px] cursor-pointer text-gray-700"
                  onClick={() => {
                    setOpenShutdownModal(true), toggleDrawer();
                  }}
                >
                  <img src={info} />
                  <p>Shutdown System</p>
                </div>
              )}
            </div>
          )}
        </ul>
      </motion.div>
    </section>
  );
};

export default MobileSidebar;

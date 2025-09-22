import { sidebarLinks } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Logo from "../../assets/icons/logo.svg";
import { Menu, X } from "lucide-react";

const MobileSidebar = ({ isOpen, setIsOpen }: any) => {
  const location = useLocation();

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

        <ul className="mt-[20px]">
          {sidebarLinks.map((val, i) => {
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
        </ul>
      </motion.div>
    </section>
  );
};

export default MobileSidebar;

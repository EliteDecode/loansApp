import { motion } from "framer-motion";
import Logo from "../../assets/icons/logo.svg";
import { sidebarLinks } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const DesktopSidebar = () => {
  const location = useLocation();
  const firstSegment = location.pathname.split("/")[1];
  console.log(firstSegment);
  console.log(sidebarLinks);

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
          {sidebarLinks.map((val, i) => {
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
      </motion.div>
    </section>
  );
};

export default DesktopSidebar;

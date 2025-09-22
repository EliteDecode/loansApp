import { Bell, ChevronDown, LogOut, Menu, Search, User, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import close from "@/assets/icons/close.svg";
import LogoutModal from "@/components/modals/logoutModal";

const Header = ({ isOpen, setIsOpen }: any) => {
  const [toggleProfile, setToggleProfile] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const firstPath = location.pathname.split("/")[1];

  const title = sidebarLinks.find(
    (val) => val.link.replace("/", "") === firstPath
  );

  const toggleDrawer = () => {
    setIsOpen((prev: boolean) => !prev);
  };

  const Notifications = [
    {
      title: "Loan Approved",
      message:
        "Loan Application LN01234 for Client John Smith has been approved.",
      time: "2h ago",
      read: true,
    },
    {
      title: "Payment Received",
      message: "Payment of ₦50,000 has been received from Client Jane Doe.",
      time: "30m ago",
      read: false,
    },
    {
      title: "Overdue Installment",
      message: "Client Michael Brown missed an installment of ₦25,000.",
      time: "1d ago",
      read: false,
    },
    {
      title: "New Client Registered",
      message: "Client Sophia Johnson has successfully registered an account.",
      time: "3d ago",
      read: true,
    },
    {
      title: "Loan Declined",
      message:
        "Loan Application LN05678 for Client David Williams was declined.",
      time: "5d ago",
      read: true,
    },
  ];

  // prevent body scroll when modals open
  useEffect(() => {
    if (toggleProfile || toggleNotifications || showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [toggleProfile, toggleNotifications, showLogoutModal]);

  return (
    <section className="flex flex-col px-6 lg:px-8 fixed top-0 left-0 right-0 lg:left-[280px] z-10 bg-white pb-4 lg:pb-0">
      <div className="flex justify-between gap-3 items-center h-[60px] lg:h-[80px] shadow-custom3 relative">
        <div className="flex gap-6 w-full">
          <div className="w-full">
            <div className="lg:hidden text-[20px] font-semibold block text-primary font-merriweather">
              {title?.name}
            </div>

            <div className="max-w-[629px] w-full hidden lg:block relative">
              <input
                placeholder="Search here..."
                className="h-10 w-full pl-10 pr-3 outline-0 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] rounded-[6px] text-[14px] placeholder:text-[#667185]"
              />
              <Search
                className="absolute top-2 left-3 w-5 h-5"
                color="#475367"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center z-30">
          <button className="block lg:hidden" onClick={toggleDrawer}>
            {isOpen ? <X /> : <Menu />}
          </button>
          <button
            className="text-primary cursor-pointer bg-[#F0F2F5] lg:w-12 lg:h-12 w-7 h-7 flex items-center justify-center rounded-full"
            onClick={() => setToggleNotifications((prev) => !prev)}
          >
            <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>

          <div className="flex items-center justify-center w-8 h-8 border-[1.5px] border-[#FFFFFF] rounded-full lg:w-10 lg:h-10 overflow-hidden">
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
              onClick={() => setToggleProfile((prev) => !prev)}
            />
          </div>
          <button
            onClick={() => setToggleProfile((prev) => !prev)}
            className="lg:flex hidden items-center gap-2 cursor-pointer"
          >
            <div className="leading-[145%] w-[100px] text-start">
              <h4 className="text-[14px] text-[#667185] font-medium">
                David Imasuen
              </h4>
              <p className="text-[12px] text-[#98A2B3]">Credit Agent</p>
            </div>
            <ChevronDown
              className={`w-6 h-6 ${toggleProfile ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Profile Modal */}
        {toggleProfile && (
          <>
            <div
              onClick={() => setToggleProfile(false)}
              className="fixed inset-0 z-10 bg-black/30"
            ></div>
            <motion.div
              className="absolute top-16 lg:top-20 right-3 w-[180px] py-3 px-3 bg-white shadow-md z-20 rounded-xl flex flex-col gap-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                to={"/profile"}
                onClick={() => {
                  setToggleProfile(false);
                }}
                className="hover:bg-primary hover:text-white w-full h-[32px] text-[14px] rounded-md flex items-center justify-center gap-2 px-2"
              >
                <User className="w-4 h-4" />
                <p>Profile</p>
              </Link>
              <button
                onClick={() => {
                  setToggleProfile(false);
                  setShowLogoutModal(true);
                }}
                className="hover:bg-primary hover:text-white w-full h-[32px] text-[14px] rounded-md flex items-center justify-center gap-2 px-2"
              >
                <LogOut className="w-4 h-4" />
                <p>Logout</p>
              </button>
            </motion.div>
          </>
        )}

        {/* Notifications Modal */}
        {toggleNotifications && (
          <>
            <div
              onClick={() => setToggleNotifications(false)}
              className="fixed inset-0 z-10 bg-black/30"
            ></div>
            <motion.div
              className="absolute top-16 lg:top-20 right-3 w-[95%] max-w-[480px] max-h-[80vh] overflow-y-auto bg-white shadow-md z-20 rounded-xl flex flex-col"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 sticky top-0 bg-white z-10">
                <h1 className="text-[20px] font-medium text-gray-700">
                  Notifications
                </h1>
                <img
                  src={close}
                  onClick={() => setToggleNotifications(false)}
                  className="cursor-pointer w-5 h-5"
                />
              </div>
              <div className="divide-y divide-gray-100">
                {Notifications.map((n, i) => (
                  <div
                    key={i}
                    className={`p-6 space-y-2 ${n.read ? "" : "bg-[#E6EAEF]"}`}
                  >
                    <h3 className="flex items-center gap-2 text-[16px] font-medium text-gray-700">
                      {n.title}
                      <span className="w-[6px] h-[6px] bg-primary rounded-full inline-block"></span>
                    </h3>
                    <p className="text-[14px] text-gray-500">{n.message}</p>
                    <p className="text-[13px] text-gray-400">{n.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <div
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 z-40 bg-black/40"
            ></div>

            <LogoutModal setShowLogoutModal={setShowLogoutModal} />
          </>
        )}
      </AnimatePresence>

      <div className="w-full lg:hidden block">
        <input
          placeholder="Search here..."
          className="h-10 w-full pl-10 pr-3 outline-0 bg-[#F9FAFB] rounded-[6px] text-[14px] placeholder:text-[#667185]"
        />
      </div>
    </section>
  );
};

export default Header;

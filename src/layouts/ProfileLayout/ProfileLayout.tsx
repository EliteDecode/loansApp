import PageHeader from "@/components/PageHeader/PageHeader";
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import user from "@/assets/icons/user.svg";
import shield from "@/assets/icons/shield.svg";
import bell from "@/assets/icons/bell.svg";

export default function ProfileLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <PageHeader
        title="My Profile"
        subtitle="Welcome back! Here's your loan portfolio overview"
      />

      {/* Mobile toggle button */}
      <div className="flex lg:hidden justify-end px-4 mb-4">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Open Menu
        </button>
      </div>

      <div className="w-full h-full flex flex-col lg:flex-row gap-6">
        {/* Sidebar for Desktop */}
        <div className="hidden lg:flex items-center justify-start max-w-[288px] w-full flex-col p-6 gap-6 bg-white rounded-xl">
          <SidebarNav />
        </div>

        {/* Sidebar Drawer for Mobile */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black z-40 lg:hidden"
              />

              {/* Drawer */}
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white p-6 rounded-b-2xl shadow-lg lg:hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">My Profile</h2>
                  <button onClick={() => setOpen(false)}>
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                <SidebarNav onClick={() => setOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="w-full h-full bg-white rounded-xl p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function SidebarNav({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <img
        src={profileImage}
        className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] rounded-full object-cover mb-4"
      />

      <div className="text-center space-y-2 lg:space-y-4 leading-[120%] tracking-[-2%] mb-6">
        <h1 className="text-[24px] lg:text-[32px] font-semibold text-gray-800">
          David Imasuen
        </h1>
        <p className="text-[18px] lg:text-[24px] text-gray-500">Credit Agent</p>
      </div>

      <div className="w-full space-y-4">
        <NavLink
          to="basic-info"
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 h-[44px] cursor-pointer ${
              isActive ? "text-primary font-semibold" : "text-gray-600"
            }`
          }
        >
          <img src={user} alt="user" className="w-5 h-5" />
          <p className="text-[14px] font-medium">Basic Information</p>
        </NavLink>

        <NavLink
          to="security"
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 h-[44px] cursor-pointer ${
              isActive ? "text-primary font-semibold" : "text-gray-600"
            }`
          }
        >
          <img src={shield} alt="shield" className="w-5 h-5" />
          <p className="text-[14px] font-medium">Security Settings</p>
        </NavLink>

        <NavLink
          to="notifications"
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 h-[44px] cursor-pointer ${
              isActive ? "text-primary font-semibold" : "text-gray-600"
            }`
          }
        >
          <img src={bell} alt="bell" className="w-5 h-5" />
          <p className="text-[14px] font-medium">Notification & Preference</p>
        </NavLink>
      </div>
    </>
  );
}

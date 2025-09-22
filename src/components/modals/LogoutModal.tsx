import React from "react";
import { motion } from "framer-motion";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import Button from "../Button/Button";

type setShowLogoutModalProps = {
  setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LogoutModal({
  setShowLogoutModal,
}: setShowLogoutModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white w-full max-w-[381px] rounded-2xl p-6 shadow-lg flex flex-col gap-4 items-center justify-center py-8 mx-5 sm:mx-0">
        <img
          src={profileImage}
          className="w-[78px] h-[78px] rounded-full object-cover"
          alt="profile image"
        />

        <h1 className="text-[20px] leading-[120%] tracking-[-2%] text-gray-700 font-semibold">
          Confirm Logout
        </h1>
        <p className="text-center text-[16px] leading-[145%]  text-gray-600 px-5">
          Are you sure you want to log out? You’ll need to sign in again to
          continue using the system.
        </p>

        <div className="space-x-4">
          <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger">Yes, Logout</Button>
        </div>
      </div>
    </motion.div>
  );
}

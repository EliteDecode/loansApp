import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import Button from "../Button/Button";
import { logout } from "@/services/features/auth/authSlice";
import type { RootState } from "@/store";

type setShowLogoutModalProps = {
  setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LogoutModal({
  setShowLogoutModal,
}: setShowLogoutModalProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { role, isLoading } = useSelector((state: RootState) => state.auth);
  // Helper function to get the correct login page based on role
  const getLoginPageByRole = (userRole: string) => {
    switch (userRole) {
      case "director":
        return "/director";
      case "manager":
        return "/manager";
      case "creditAgent":
        return "/agent";
      default:
        return "/login"; // Fallback to generic login
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    console.log("🔄 Logout button clicked");
    const refreshToken = localStorage.getItem("asavic_refresh_token");
    console.log("🔑 Refresh token:", refreshToken);
    console.log("👤 Role:", role);

    try {
      if (refreshToken && role) {
        console.log("🚀 Dispatching logout action...");
        await dispatch(
          logout({
            refreshToken: JSON.parse(refreshToken),
            role: role as "director" | "manager" | "agent",
          }) as any
        );

        console.log("✅ Logout successful, clearing data...");
        // Clear all auth data
        localStorage.removeItem("asavic_token");
        localStorage.removeItem("asavic_refresh_token");
        localStorage.removeItem("asa_role");

        // Navigate to role-specific login page
        console.log("🏠 Navigating to role-specific login...");
        const loginPage = getLoginPageByRole(role);
        navigate(loginPage);
      } else {
        console.log("⚠️ No refresh token or role, clearing data anyway...");
        // Clear local data and navigate if no tokens
        localStorage.clear();
        navigate("/login"); // Default to generic login if no role
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Still clear local data and navigate even if API call fails
      localStorage.clear();
      if (role) {
        const loginPage = getLoginPageByRole(role);
        navigate(loginPage);
      } else {
        navigate("/login");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };
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
          <Button
            variant="outline"
            onClick={() => setShowLogoutModal(false)}
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log("🔘 Button clicked!");
              handleLogout();
            }}
            disabled={isLoggingOut || isLoading}
          >
            {isLoggingOut || isLoading ? "Logging out..." : "Yes, Logout"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

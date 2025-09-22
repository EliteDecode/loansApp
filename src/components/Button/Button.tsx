import React from "react";
import type { ButtonProps } from "./Button.types";

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  onClick,
  icon,
  iconPosition = "left",
  disabled = false,
  type = "button",
  width,
  height,
}) => {
  const base =
    "rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 cursor-pointer";

  const sizes = {
    sm: "px-4 py-2.5 text-[14px] leading-[145%] font-semibold",
    md: "px-4 py-[16.5px] text-[16px] leading-[145%] font-semibold",
    lg: "px-6 py-3 text-lg",
  };

  const styles = {
    primary: "bg-primary text-white",
    muted: "bg-gray-500 text-white",
    neutral: "bg-gray-300 text-white hover:bg-gray-400", // instead of "secondary"
    success: "bg-secondary text-white", // instead of "green"
    outline: "border-[1.5px] border-primary text-primary hover:bg-gray-100",
    danger: "bg-[#CB1A14] text-white hover:bg-red-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600", // new option
    ghost: "bg-transparent text-primary hover:bg-gray-100", // subtle button
  };

  // Only apply size if width/height not set
  const sizeClass = width || height ? "" : sizes[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      // style={{
      //   height: height,
      // }}
      className={`${base} ${sizeClass} ${styles[variant]} ${
        width ? width : ""
      } ${height ? height : ""} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
};

export default Button;

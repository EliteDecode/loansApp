// src/components/ui/Button/Button.tsx
import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "neutral"
    | "success"
    | "outline"
    | "danger"
    | "warning"
    | "ghost"
    | "muted";

  size?: "sm" | "md" | "lg";
  loading?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  width?: string;
  height?: string;
}

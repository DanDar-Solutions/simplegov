"use client";

import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: "#0f62fe", color: "#fff", border: "none" },
  secondary: { backgroundColor: "#e6e6e6", color: "#111827", border: "none" },
  ghost: { backgroundColor: "transparent", color: "#0f62fe", border: "1px solid transparent" },
};

const SIZE_STYLES: Record<string, React.CSSProperties> = {
  sm: { padding: "6px 10px", fontSize: "0.875rem" },
  md: { padding: "8px 14px", fontSize: "1rem" },
  lg: { padding: "12px 18px", fontSize: "1.125rem" },
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  style,
  ...rest
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    borderRadius: 6,
    cursor: rest.disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...VARIANT_STYLES[variant],
    ...SIZE_STYLES[size],
  };

  return (
    <button {...rest} style={{ ...baseStyle, ...style }} className={className}>
      {children}
    </button>
  );
}

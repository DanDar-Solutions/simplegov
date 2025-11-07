"use client";

import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
  className?: string;
};

export default function Input({ label, id, className = "", ...rest }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label ? (
        <label htmlFor={id} style={{ fontSize: "0.875rem", color: "#111827" }}>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        {...rest}
        className={className}
        style={{ padding: 8, borderRadius: 6, border: "1px solid rgba(0,0,0,0.08)" }}
      />
    </div>
  );
}

import React from "react";

export type CardProps = {
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export default function Card({ title, className = "", children }: CardProps) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid rgba(15,23,42,0.04)",
        padding: 16,
        background: "#fff",
      }}
    >
      {title ? <div style={{ marginBottom: 8, fontWeight: 600 }}>{title}</div> : null}
      <div>{children}</div>
    </div>
  );
}

import React from "react";

export default function Footer() {
  return (
    <footer style={{ padding: 20, borderTop: "1px solid rgba(0,0,0,0.04)", marginTop: 40 }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", textAlign: "center", color: "#6b7280" }}>
        © {new Date().getFullYear()} SimpleGov — Built with care.
      </div>
    </footer>
  );
}

"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header style={{ padding: 16, borderBottom: "1px solid rgba(0,0,0,0.04)", background: "transparent" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1024, margin: "0 auto" }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}>
          SimpleGov
        </Link>

        <nav>
          <Link href="/" style={{ marginRight: 12 }}>
            Home
          </Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}

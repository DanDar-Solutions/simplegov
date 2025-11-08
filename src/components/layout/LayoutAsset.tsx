"use client";
import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header style={{ padding: 16, borderBottom: "1px solid rgba(0,0,0,0.04)", background: "transparent" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1024,
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          Hen be?
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "block",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 24,
          }}
        >
          ☰
        </button>
        <nav
          style={{
            display: "none",
          }}
          className="desktop-nav"
        >
          <Link href="/swipe" style={{ marginLeft: 16 }}>
            Swipe
          </Link>
          <Link href="/news" style={{ marginLeft: 16 }}>
            News
          </Link>
        </nav>
      </div>
{/* Mobile navigation dropdown */}
{isMenuOpen && (
  <nav className="flex flex-col mt-3 absolute right-2 bg-blue-200/50 rounded-lg shadow-lg p-4 w-48 z-50">
    <Link 
      href="/swipe" 
      className="px-1 py-1 text-center border-b hover:bg-blue-300 transition-colors"
    >
      Swipe
    </Link>  
    <Link 
      href="/news" 
      className="px-1 py-1 text-center border-b hover:bg-blue-300 transition-colors"
    >
      News
    </Link>
    <span 
      className="px-1 py-1 text-center border-b text-gray-400 cursor-not-allowed"
    >
      Gossip
    </span>
    <span 
      className="px-1 py-1 text-center text-gray-400 cursor-not-allowed"
    >
      Profile
    </span>
  </nav>
)}



      <style jsx>{`
        @media (min-width: 768px) {
          button {
            display: none;
          }
          .desktop-nav {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ padding: 16, borderTop: "1px solid rgba(0,0,0,0.04)", marginTop: 40 }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", textAlign: "center", color: "#6b7280" }}>
        © {new Date().getFullYear()} SimpleGov — Built with care.
      </div>
    </footer>
  );
}

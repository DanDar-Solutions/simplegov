
import Link from "next/link";

export  function Header() {
  return (
    <header style={{ padding: 16, borderBottom: "1px solid rgba(0,0,0,0.04)", background: "transparent" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1024, margin: "0 auto" }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}>
          SimpleGov
        </Link>
        <div>
          {/* hamburger here */}
        </div>
        <nav>
          <Link href="/swipe">Swipe</Link>
          <Link href="/news">News</Link>
        </nav>
      </div>
    </header>
  );
}

export  function Footer() {
  return (
    <footer style={{ padding: 20, borderTop: "1px solid rgba(0,0,0,0.04)", marginTop: 40 }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", textAlign: "center", color: "#6b7280" }}>
        © {new Date().getFullYear()} SimpleGov — Built with care.
      </div>
    </footer>
  );
}

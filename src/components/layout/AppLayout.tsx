import { Footer, Header } from "@/components/layout/LayoutAsset";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-row  items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}

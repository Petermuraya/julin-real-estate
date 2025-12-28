"use client";

import { ReactNode } from "react";
import Navbar from "@/ui/layouts/Navbar";
import Footer from "@/ui/layouts/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">{children}</main>

      <Footer />
    </div>
  );
}
 
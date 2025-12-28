"use client";

import { ReactNode } from "react";
import Link from "next/link";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Julin Real Estate
          </Link>
          <nav className="space-x-4 flex items-center">
            <Link href="/">Home</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/about" className="opacity-90 hover:opacity-100 transition-opacity">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login" className="bg-white text-blue-600 px-3 py-1 rounded">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 p-4 text-center">
        &copy; {new Date().getFullYear()} Julin Real Estate. All rights reserved.
      </footer>
    </div>
  );
}

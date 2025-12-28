"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";

type NavLink = { href: string; label: string };

interface NavbarProps {
	logo?: ReactNode | string;
	links?: NavLink[];
}

export default function NavbarComponent({
	logo = "Julin Real Estate",
	links = [
		{ href: "/", label: "Home" },
		{ href: "/properties", label: "Properties" },
		{ href: "/blog", label: "Blog" },
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	],
}: NavbarProps) {
	const [open, setOpen] = useState(false);

	return (
		<header className="bg-[var(--color-primary)] text-white">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-4">
						<Link href="/" className="text-lg sm:text-xl font-bold leading-none text-white">
							{logo}
						</Link>

						<nav className="hidden sm:flex items-center gap-6 text-sm" aria-label="Primary">
							{links.map((l) => (
								<Link key={l.href} href={l.href} className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 rounded text-white">
									{l.label}
								</Link>
							))}
						</nav>
					</div>

					<div className="hidden sm:flex items-center gap-3">
						<Link href="/login" className="px-3 py-2 rounded bg-white text-[var(--color-primary)] font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40">Login</Link>
						<Link href="/properties" className="px-3 py-2 rounded bg-[var(--color-primary-light)] text-white font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-light)]">List a property</Link>
					</div>

					<div className="sm:hidden">
						<button
							onClick={() => setOpen((v) => !v)}
							aria-expanded={open}
							aria-controls="mobile-menu"
							aria-label="Toggle menu"
							className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60"
						>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
								{open ? (
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>
			</div>

			<div id="mobile-menu" className={`sm:hidden ${open ? "max-h-[800px]" : "max-h-0"} overflow-hidden transition-all duration-200`}>
				<nav className="bg-[var(--color-primary)]/95 px-4 pt-2 pb-4">
					<ul className="flex flex-col gap-2">
						{links.map((l) => (
							<li key={l.href}>
								<Link href={l.href} className="block px-3 py-2 rounded hover:bg-[var(--color-primary)]/10 text-white">
									{l.label}
								</Link>
							</li>
						))}

						<li>
							<Link href="/login" className="block px-3 py-2 mt-2 bg-white text-[var(--color-primary)] rounded text-center">Login</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}

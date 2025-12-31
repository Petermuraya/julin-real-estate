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
	const [scrolled, setScrolled] = useState(false);

	// Handle scroll effect
	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', () => {
			setScrolled(window.scrollY > 20);
		});
	}

	return (
		<header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-8">
						<Link href="/" className={`text-xl sm:text-2xl font-bold leading-none transition-colors ${scrolled ? 'text-[var(--color-primary)]' : 'text-white'}`}>
							{logo}
						</Link>

						<nav className="hidden md:flex items-center gap-8 text-sm font-medium" aria-label="Primary">
							{links.map((l) => (
								<Link 
									key={l.href} 
									href={l.href} 
									className={`transition-colors hover:text-[var(--color-primary-light)] ${scrolled ? 'text-[var(--color-text)]' : 'text-white/90 hover:text-white'}`}
								>
									{l.label}
								</Link>
							))}
						</nav>
					</div>

					<div className="hidden md:flex items-center gap-4">
						<Link 
							href="/login" 
							className={`px-4 py-2 rounded-lg font-medium transition-all ${
								scrolled 
									? 'text-[var(--color-text)] hover:bg-[var(--color-surface)]' 
									: 'text-white hover:bg-white/10'
							}`}
						>
							Login
						</Link>
						<Link 
							href="/properties" 
							className={`px-5 py-2.5 rounded-lg font-semibold shadow-lg transition-all hover:-translate-y-0.5 ${
								scrolled
									? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
									: 'bg-white text-[var(--color-primary)] hover:bg-[var(--color-surface)]'
							}`}
						>
							List Property
						</Link>
					</div>

					<div className="md:hidden">
						<button
							onClick={() => setOpen((v) => !v)}
							aria-expanded={open}
							aria-controls="mobile-menu"
							aria-label="Toggle menu"
							className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
								scrolled ? 'text-[var(--color-text)]' : 'text-white'
							}`}
						>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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

			{/* Mobile Menu Overlay */}
			<div 
				className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity md:hidden ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
				onClick={() => setOpen(false)}
			/>

			<div 
				id="mobile-menu" 
				className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
			>
				<div className="p-6 flex flex-col h-full">
					<div className="flex items-center justify-between mb-8">
						<span className="text-xl font-bold text-[var(--color-primary)]">Menu</span>
						<button onClick={() => setOpen(false)} className="p-2 text-[var(--color-muted)] hover:text-[var(--color-text)]">
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<nav className="flex-1">
						<ul className="flex flex-col gap-2">
							{links.map((l) => (
								<li key={l.href}>
									<Link 
										href={l.href} 
										className="block px-4 py-3 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text)] font-medium transition-colors"
										onClick={() => setOpen(false)}
									>
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="pt-6 border-t border-[var(--color-border)] space-y-3">
						<Link 
							href="/login" 
							className="block w-full px-4 py-3 text-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface)]"
							onClick={() => setOpen(false)}
						>
							Login
						</Link>
						<Link 
							href="/properties" 
							className="block w-full px-4 py-3 text-center rounded-lg bg-[var(--color-primary)] text-white font-semibold shadow-lg hover:bg-[var(--color-primary-dark)]"
							onClick={() => setOpen(false)}
						>
							List a Property
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}

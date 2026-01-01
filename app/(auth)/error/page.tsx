"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function reasonMessage(reason?: string) {
	switch (reason) {
		case "auth_required":
			return {
				title: "Authentication required",
				desc: "You must be signed in to access this admin area.",
				action: "Sign in",
			};
		case "unauthorized":
			return {
				title: "Access denied",
				desc: "Your account is not authorized to view this page.",
				action: "Contact support",
			};
		case "session_expired":
			return {
				title: "Session expired",
				desc: "Please sign in again to continue.",
				action: "Sign in",
			};
		default:
			return {
				title: "Something went wrong",
				desc: "An unexpected error occurred while processing your request.",
				action: "Back to home",
			};
	}
}

export default function AuthErrorPage() {
	const params = useSearchParams();
	const reason = params?.get("reason") ?? undefined;
	const info = reasonMessage(reason);

	const mailto = `mailto:support@julin.example?subject=Admin%20Access%20Issue&body=I%20received%20an%20auth%20error%20(${encodeURIComponent(
		reason ?? "unknown"
	)})%20when%20visiting%20the%20admin%20area.%0A%0ADescribe%20what%20you%20were%20doing:%0A`;

	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="max-w-2xl w-full space-y-6">
				<div className="card p-6">
					<h1 className="text-2xl font-semibold">{info.title}</h1>
					<p className="text-sm text-[var(--color-muted)] mt-2">{info.desc}</p>

					<div className="mt-4 flex flex-wrap gap-2">
						{info.action === "Sign in" && (
							<Link href="/login" className="btn btn-primary">
								Sign in
							</Link>
						)}

						{info.action === "Contact support" && (
							<a href={mailto} className="px-3 py-2 rounded border hover:bg-[var(--color-primary)] hover:text-white transition">
								Contact support
							</a>
						)}

						{info.action === "Back to home" && (
							<Link href="/" className="px-3 py-2 rounded border hover:bg-[var(--color-primary)] hover:text-white transition">
								Back to home
							</Link>
						)}

						<Link href="/" className="px-3 py-2 rounded border text-sm ml-2">
							Browse site
						</Link>
					</div>

					<div className="mt-6 text-xs text-[var(--color-muted)]">
						<div>Debug info:</div>
						<pre className="mt-2 bg-[var(--color-surface)] p-2 rounded text-[var(--color-text)] text-xs break-words">{`reason=${reason ?? "-"}`}</pre>
					</div>
				</div>

				<div className="text-xs text-[var(--color-muted)]">
					If you believe this is a mistake, contact the site admin or use the support link above. Admin access is restricted and enforced server-side for security.
				</div>
			</div>
		</div>
	);
}


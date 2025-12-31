export default function AdminDashboardPage() {
	return (
		<div className="p-6 space-y-6">
			<header className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Admin Dashboard</h1>
					<p className="text-sm text-[var(--color-muted)]">High-level business visibility in 10 seconds</p>
				</div>

				<div className="flex items-center gap-2">
					<a href="/(admin)/admin/properties/new" className="btn btn-primary">Add Property</a>
					<a href="/(admin)/admin/leads" className="px-3 py-2 rounded border hover:bg-[var(--color-primary)] hover:text-white transition">View Leads</a>
				</div>
			</header>

			{/* Key metrics */}
			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="card p-4">
					<div className="text-sm text-[var(--color-muted)]">Total Listings</div>
					<div className="text-2xl font-bold">—</div>
					<div className="text-xs text-[var(--color-muted)] mt-2">By category: Land / Residential / Commercial</div>
				</div>

				<div className="card p-4">
					<div className="text-sm text-[var(--color-muted)]">Status (Active / Sold / Draft)</div>
					<div className="text-2xl font-bold">— / — / —</div>
					<div className="text-xs text-[var(--color-muted)] mt-2">Quick publish controls available in list view</div>
				</div>

				<div className="card p-4">
					<div className="text-sm text-[var(--color-muted)]">New Leads (24h / 7d)</div>
					<div className="text-2xl font-bold">— / —</div>
					<div className="text-xs text-[var(--color-muted)] mt-2">Quick actions: Assign / Contact</div>
				</div>

				<div className="card p-4">
					<div className="text-sm text-[var(--color-muted)]">Properties Missing Images</div>
					<div className="text-2xl font-bold">—</div>
					<div className="text-xs text-[var(--color-muted)] mt-2">Prioritise uploads to improve trust</div>
				</div>
			</section>

			{/* Detailed quick panels */}
			<section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="card p-4">
					<h3 className="font-semibold mb-2">Most Viewed Properties</h3>
					<p className="text-sm text-[var(--color-muted)]">Top viewed listings in the last 7 days</p>
					<ul className="mt-3 list-disc list-inside text-[var(--color-text)]">
						<li>—</li>
						<li>—</li>
						<li>—</li>
					</ul>
				</div>

				<div className="card p-4">
					<h3 className="font-semibold mb-2">Properties With No Leads</h3>
					<p className="text-sm text-[var(--color-muted)]">Identify listings needing promotion</p>
					<ul className="mt-3 list-disc list-inside text-[var(--color-text)]">
						<li>—</li>
						<li>—</li>
					</ul>
				</div>

				<div className="card p-4">
					<h3 className="font-semibold mb-2">Recent Admin Activity</h3>
					<p className="text-sm text-[var(--color-muted)]">Audit trail of recent actions</p>
					<ul className="mt-3 text-sm text-[var(--color-text)]">
						<li>—</li>
						<li>—</li>
					</ul>
				</div>
			</section>

			{/* Guidance */}
			<footer className="text-sm text-[var(--color-muted)]">
				Core principle: One admin action = one business outcome. Use the Properties module for detailed management and Leads for conversion workflows.
			</footer>
		</div>
	);
}


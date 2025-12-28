import Link from "next/link";

type Action = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

interface HeroProps {
  title?: string;
  description?: string;
  actions?: Action[];
  whatsapp?: string;
}

export default function Hero({
  title = "Buy Verified Land & Plots Across Kenya",
  description = "Search by county or town for plots, acres and farms with clear title deeds. Find verified sellers, compare prices in KES, and complete transactions with confidence.",
  actions = [
    { href: "/properties", label: "Browse Land", variant: "primary" },
    { href: "/contact", label: "Contact Us", variant: "secondary" },
  ],
  whatsapp,
}: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="overflow-hidden">
      <div className="bg-[var(--color-primary-gradient)] p-4 sm:p-6 md:p-10 lg:p-12 rounded-lg">
        <div className="max-w-4xl md:max-w-5xl mx-auto text-center px-2">
          <h1 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-[var(--color-background)]">
            {title}
          </h1>

          <p className="text-[var(--color-muted)] mb-6 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-3 w-full">
            {actions.map((a) => (
              <Link
                key={a.href + a.label}
                href={a.href}
                aria-label={a.label}
                className={
                  a.variant === "primary"
                    ? "w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[var(--color-primary-light)] text-white rounded-lg text-base font-semibold shadow-md hover:brightness-95 focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-[var(--color-primary-light)]"
                    : "w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-lg text-white bg-[var(--color-primary)]/10 text-sm font-medium hover:bg-[var(--color-primary)]/15 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-light)]"
                }
                style={a.variant === "primary" ? { background: 'linear-gradient(90deg, var(--color-primary-light), var(--color-primary-sky))' } : undefined}
              >
                {a.label}
              </Link>
            ))}

            {whatsapp && (
              <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi, I'm interested in land listings and title deed details")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-3 bg-[var(--color-success)] text-white rounded-lg text-sm font-medium shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-success)]"
                  aria-label="Contact via WhatsApp"
                >
                  WhatsApp
                </a>
            )}
          </div>

          <form method="get" action="/properties" className="mt-6 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 items-center px-2">
            <label htmlFor="hero-search" className="sr-only">Search properties</label>
            <input
              id="hero-search"
              name="q"
              type="search"
              placeholder="County, town, or keyword (e.g. Nairobi, 1 acre)"
              className="flex-1 w-full px-4 py-3 rounded-lg border border-transparent focus:border-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-primary-light)] focus:ring-offset-2"
              aria-label="Search properties"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-[var(--color-primary-gradient)] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-light)]"
              aria-label="Explore listings"
            >
              Explore Listings
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

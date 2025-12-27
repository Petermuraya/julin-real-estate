import { getPublicProperties } from "@/domains/property/property.repository";

// Force static generation at build time for sitemap
export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function buildUrl(loc: string, lastmod?: string) {
  return `  <url>\n    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`;
}

export async function GET() {
  try {
    const properties = await getPublicProperties();

    const urls = [
      buildUrl("/"),
      buildUrl("/properties"),
      // add property pages
      ...properties
        .filter((p: any) => p?.slug)
        .map((p: any) => buildUrl(`/properties/${p.slug}`, p.updated_at || p.created_at)),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch (err: any) {
    return new Response("", { status: 500 });
  }
}

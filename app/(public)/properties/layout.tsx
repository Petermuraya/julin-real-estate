import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Properties — Julin Real Estate",
  description:
    "Browse properties and land listings across Kenya. Filter by county, price, and property type.",
  openGraph: {
    title: "Properties — Julin Real Estate",
    description:
      "Browse properties and land listings across Kenya. Filter by county, price, and property type.",
    images: ["/assets/og-default.jpg"],
  },
};

export default function PropertiesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

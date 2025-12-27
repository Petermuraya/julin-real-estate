import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import PublicLayout from "@/ui/layouts/public.layout";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"), // change on production
  title: {
    default: "Julin Real Estate | Land & Property for Sale in Kenya",
    template: "%s | Julin Real Estate",
  },
  description:
    "Julin Real Estate is a trusted platform for buying land, plots, and property in Kenya. Discover verified listings across counties with transparent pricing.",
  applicationName: "Julin Real Estate",
  keywords: [
    "land for sale in Kenya",
    "plots for sale",
    "buy land Kenya",
    "real estate Kenya",
    "property listings Kenya",
    "Julin Real Estate",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Julin Real Estate",
    title: "Julin Real Estate | Land & Property for Sale in Kenya",
    description:
      "Explore verified land and property listings across Kenya. Buy plots and properties with confidence on Julin Real Estate.",
    images: [
      {
        url: "/assets/og-default.jpg", // add later
        width: 1200,
        height: 630,
        alt: "Julin Real Estate - Land & Property in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Julin Real Estate | Land & Property for Sale in Kenya",
    description:
      "Find verified land and property listings across Kenya. Buy plots with confidence on Julin Real Estate.",
    images: ["/assets/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-KE">
      <body>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}

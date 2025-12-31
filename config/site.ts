// config/site.ts

export const SITE = {
  name: "Julin Real Estate",
  tagline: "Building Trust, One Home at a Time",
  domain: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
  apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || "http://localhost:3000/api",
  defaultLocale: "en",
  defaultCurrency: "KES",
  colors: {
    primary: "#1E90FF",    // Sky blue
    secondary: "#00BFFF",  // Deep sky blue
    accent: "#32CD32",     // Lime green
    background: "#F9FAFB",
    text: "#111827",
  },
  socialLinks: {
    facebook: "https://www.facebook.com/sammy.wailer.319",
    instagram: "https://www.instagram.com/murayandungu/",
    twitter: "https://x.com/sammie1604",
    linkedin: "https://www.linkedin.com/in/peter-muraya-ndungu/",
  },
  contact: {
    email: "sammypeter1944@gmail.com",
    phone: "+254700471113",
  },
};

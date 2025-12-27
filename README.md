🏡 Julin Real Estate

Land-First Property Marketplace for Kenya

Julin Real Estate is a modern, scalable, land-first property marketplace built with Next.js App Router, designed to simplify the discovery, marketing, and inquiry of land, plots, and property in Kenya.
The platform is optimized for SEO, performance, and long-term extensibility, while remaining practical for real-world deployment.

✨ Core Vision

Land-first focus (primary market in Kenya)

Expandable to houses, rentals, cars, and other assets

High SEO visibility for property listings

Hybrid backend architecture for flexibility and performance

Clean architecture suitable for startup or enterprise growth

🚀 Features (Current)
Public Features

🏘️ Land & property listings

🔍 Advanced filtering (county, price range, type)

📄 SEO-friendly property detail pages (/properties/[slug])

🖼️ Responsive image carousel

📞 Lead capture with WhatsApp CTA

📱 Mobile-first responsive UI

⚡ Optimized images using next/image

🔄 Cursor-based pagination / load more

SEO & Performance

Dynamic metadata using Next.js Metadata API

OpenGraph & Twitter Cards

Server-side rendering (SSR)

Lazy-loaded images

Clean URLs and semantic structure

🧠 Architecture Overview

Julin Real Estate uses a hybrid backend architecture:

1️⃣ Supabase (PostgreSQL) — Primary Data Store

Used for:

Properties (land, houses, rentals)

Locations (county-based filtering)

Leads & inquiries

Blog posts (SEO-critical content)

Admin-managed structured data

Why Supabase?

Strong relational queries

Pagination & filtering

SEO-friendly data access

Reliability for core business data

2️⃣ MongoDB — Flexible / Non-Relational Data

Used for:

AI chatbot memory (future)

Logs & analytics

Future modules (cars, auctions, insights)

MongoDB is server-only and isolated from the frontend.

🧱 Tech Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

React Server Components

Next.js Metadata API

next/image

Backend / Infrastructure

Supabase (PostgreSQL)

MongoDB

Cloudinary (media storage)

Next.js API Routes (BFF)

Planned

NextAuth (Google Authentication)

Admin Dashboard (RBAC)

AI Chatbot (OpenAI)

Blog CMS

Analytics (GA / Hotjar)

📁 Project Structure
julin-real-estate/
├── app/                    # Next.js App Router (UI & routes)
│   ├── (public)/           # Public website
│   ├── (auth)/             # Authentication pages
│   ├── (admin)/            # Admin dashboard (planned)
│   ├── api/                # Backend-for-Frontend (BFF)
│   └── layout.tsx
│
├── domains/                # Core business logic
│   ├── property/
│   ├── blog/
│   ├── lead/
│   ├── auth/
│   └── chatbot/
│
├── infrastructure/         # External systems
│   ├── database/
│   ├── auth/
│   ├── storage/
│   └── ai/
│
├── ui/                     # Pure UI components
├── hooks/                  # Custom React hooks
├── shared/                 # Cross-domain utilities
├── config/                 # App configuration
├── middleware.ts           # Auth & RBAC enforcement
├── public/                 # Static assets
└── README.md

🔐 Environment Variables

Create a .env.local file (do NOT commit it):

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# MongoDB (server only)
MONGODB_URI=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Auth (planned)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Admin access
ADMIN_EMAILS=
NEXT_PUBLIC_ADMIN_EMAILS=

🛠️ Local Development
1️⃣ Install dependencies
npm install

2️⃣ Run development server
npm run dev

3️⃣ Open in browser
http://localhost:3000

🧪 Current Project Status
✅ Completed

Frontend marketplace

Property listings & filters

Property detail pages

Lead capture

Pagination

SEO foundation

Image optimization

Supabase & MongoDB integration

Repository & domain layers

🚧 In Progress / Planned

Authentication (NextAuth)

Admin dashboard & RBAC

Blog publishing

AI chatbot

Sitemap & schema markup

Production hardening

Analytics & monitoring

📌 Design Principles

Land-first, market-aware design

Security layered, not rushed

SEO before AI

Clean architecture over shortcuts

Production realism, not demo code

🌍 Target Market

Kenyan land buyers

Real estate agents & developers

Investors seeking verified listings

Future expansion to rentals & other assets

📜 License

This project is currently proprietary.
Licensing terms will be defined before public distribution.

👤 Author

Peter Muraya
IoT & Full-Stack Engineer
Safaricom (IoT)
Founder / Co-Founder — Akili Edge Solutions
Coauthor test by ndungu-muraya <ndungu.muraya@s.karu.ac.ke>
\nDocs: fix small typo  clarify Getting Started section.

# THEUNOiA — Modern Web & Supabase Integration

High-performance, search-crawlable React + Vite web platform paired with official **Supabase** cloud database storage.

---

## Architecture Overview

```
theunoia-react/
├── supabase/
│   └── schema.sql            # Version-controlled Supabase SQL schema & Row Level Security (RLS) policies
│
├── theunoia-react/           # React + Vite frontend (Vercel-ready & pre-rendered)
│   ├── public/               # Static assets, robots.txt, sitemap.xml, llms.txt
│   ├── scripts/
│   │   └── prerender.js      # Build-time SSG/prerendering pipeline
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.js   # Official Supabase JS client & form submission helpers
│   │   ├── pages/            # Public pages (Home, Story, Team, Hivh, Hunhar, Blog, Contact, BecomeMaker, NotFound)
│   │   └── ...
│   ├── .env.example          # Supabase environment variables template
│   ├── vercel.json           # Vercel deployment configuration with cleanUrls
│   └── package.json
│
├── .gitignore                # Protects secrets (.env) and environment files
├── .env.example              # Project environment variables reference
├── vercel.json               # Root Vercel deployment configuration
└── README.md
```

---

## 1. Database Setup (Supabase)

Supabase is the sole database powering the application. Submissions are stored in PostgreSQL tables secured with Row Level Security (RLS).

### Schema Setup
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).

This initializes:
- `contact_submissions`: Stores enquiries from `/contact` (`full_name`, `company`, `email`, `phone`, `address`, `message`, `status`, `created_at`).
- `team_member_applications`: Stores applications from `/become-a-maker` (`full_name`, `email`, `phone`, `role`, `custom_role`, `status`, `created_at`).
- **Row Level Security (RLS)**: Anonymous visitors are granted INSERT-only permissions. Anonymous SELECT, UPDATE, and DELETE are strictly disabled, preventing unauthorized data access.

---

## 2. Environment Configuration

Copy the example configuration file:
```bash
cp theunoia-react/.env.example theunoia-react/.env
```

Retrieve your credentials from **Supabase Dashboard** -> **Project Settings** -> **API**:
- `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://<project-ref>.supabase.co`)
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase `anon` / `public` API key

> **Security Note:** Never place your Supabase `service_role` secret key in frontend environment variables or client bundles.

---

## 3. Development & Production Build

### Installation
```bash
npm install --prefix theunoia-react
```

### Run Locally
```bash
npm run dev --prefix theunoia-react
```
Accessible by default at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Executes Vite production build and the automated prerendering pipeline (`scripts/prerender.js`), generating full static HTML pages for all indexable routes in `theunoia-react/dist`.

---

## 4. Production Deployment (Vercel)

1. Deploy repository to [Vercel](https://vercel.com).
2. Configure **Environment Variables** in Vercel Project Settings:
   - `VITE_SUPABASE_URL`: `https://<project-ref>.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: `<your-anon-key>`
3. Build Command: `npm run build`
4. Output Directory: `theunoia-react/dist`

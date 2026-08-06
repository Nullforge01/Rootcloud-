# rootcloud

Upload static site files, get a live shareable link. Built with Next.js + Supabase Storage.

## 1. Create your Supabase project

1. Go to https://supabase.com/dashboard and create a new project (free tier is fine).
2. Once it's ready, go to **Storage** in the left sidebar and click **New bucket**.
   - Name it exactly `sites`
   - You can leave it **private** — the app uses a service role key on the server, so it doesn't need the bucket to be public.
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public key**
   - **service_role key** (click "reveal" — keep this one secret, never share it or commit it)

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the three values from step 1:

```
cp .env.local.example .env.local
```

## 3. Install and run locally

```
npm install
npm run dev
```

Visit http://localhost:3000, drop in some HTML/CSS/JS files, and click **Deploy site**.
You'll get a link like `http://localhost:3000/s/still-water-4f2` — open it to see your deployed site.

## 4. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import it into Vercel (https://vercel.com/new).
3. In the Vercel project settings, add the same three environment variables from `.env.local`.
4. Deploy. Your live app will be at `your-project.vercel.app`, and every uploaded site will be reachable at `your-project.vercel.app/s/{slug}`.

## How it works

- `public/index.html` — the upload dashboard, written in plain HTML, CSS, and vanilla JavaScript (no React/JSX). It talks to the backend with a normal `fetch()` call — **fully built, nothing left to do here**
- `next.config.js` — a one-line rewrite that serves `public/index.html` at the root URL (`/`)
- `app/api/deploy/route.js` — receives uploaded files, generates a random slug, saves each file to the `sites` bucket in Supabase under `{slug}/{filename}` — **fully built**
- `app/s/[slug]/[[...path]]/route.js` — when someone visits a deployed site's link, this fetches the matching file from Supabase Storage and serves it back with the right content type (defaults to `index.html` when no sub-path is given) — **fully built**
- `lib/notFoundPage.js` — a styled 404 page (matches the dashboard's plain look) shown when a deploy is missing `index.html` or a requested file — **fully built**

Note: the backend routes (`api/deploy`, `s/[slug]`) still have to be written in JavaScript — that's what actually talks to Supabase and can't be done in plain HTML. Only the *dashboard page itself* is plain HTML/CSS/JS, per your request.

**What's actually left for you:** just the Supabase setup in step 1 below (create the project, create the `sites` bucket, paste your keys into `.env.local`). No code is missing — the whole app is wired end to end and will work as soon as your Supabase credentials are in place.

## Notes / next steps

- Supabase's free tier caps storage at 1 GB and bandwidth at 2 GB/month — fine for testing, worth watching once real traffic shows up.
- There's currently no dashboard listing of past deploys — each deploy just hands back its own link. Adding a `sites` table in Supabase's Postgres database (also included in your project) would let you list and manage deploys later.
- No authentication yet — anyone with the app URL can deploy a site. Add Supabase Auth if you want to restrict who can upload.

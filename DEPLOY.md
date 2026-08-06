# Deploy rootcloud on Mobile with GitHub + Vercel

No terminal needed — everything happens in your browser!

## Step 1: Create a GitHub repo

1. Go to **github.com** (sign in or create account)
2. Click the **+** icon → **New repository**
3. Name it `rootcloud`
4. Leave it public (Vercel works better this way)
5. Click **Create repository**

## Step 2: Upload your files to GitHub

1. On your new repo page, click **Add file → Upload files**
2. Drag your rootcloud folder contents into GitHub (everything except `.env.local`)
   - Include: `package.json`, `app/`, `lib/`, `public/`, `next.config.js`, `.gitignore`, etc.
   - **DO NOT include `.env.local`** — GitHub will refuse it (it's in `.gitignore`)
3. Click **Commit changes**

## Step 3: Deploy to Vercel

1. Go to **vercel.com** (sign in with GitHub)
2. Click **Add New Project** → Select your `rootcloud` repo
3. Click **Import**
4. Vercel will ask for **Environment Variables** — add these three:

   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key

5. Click **Deploy**

Done! Your site is now live at `rootcloud.vercel.app` (or whatever Vercel names it).

## Every time you update

Just push new files to GitHub → Vercel auto-deploys. No extra steps needed.

## Your dashboard

Visit `yoursite.vercel.app` → drag files → click Deploy → get a live link for your uploaded site!

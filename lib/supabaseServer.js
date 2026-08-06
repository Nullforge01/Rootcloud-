import { createClient } from '@supabase/supabase-js';

// Server-only client. Uses the service role key so it can write to storage
// even if the bucket itself is private. NEVER import this file into a
// component that runs in the browser.
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

export const BUCKET = 'sites';

import { createClient } from '@supabase/supabase-js';

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase credentials in environment variables');
  }

  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

export const BUCKET = 'sites';

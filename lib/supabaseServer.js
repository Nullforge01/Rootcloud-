import { createClient } from '@supabase/supabase-js';

const BUCKET = 'sites';

export function supabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!supabaseKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  if (!supabaseUrl.startsWith('https://')) {
    throw new Error('Invalid SUPABASE_URL format');
  }

  if (supabaseKey.length < 50) {
    throw new Error('Invalid SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export { BUCKET };

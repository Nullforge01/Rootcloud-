import { createClient } from '@supabase/supabase-js';

export function supabaseServer() {
  // Get and validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  // Detailed error checking
  if (!supabaseUrl) {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is missing');
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseKey) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is missing');
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  // Validate URL format
  if (!supabaseUrl.startsWith('https://')) {
    console.error('ERROR: Invalid SUPABASE_URL format:', supabaseUrl);
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL');
  }

  // Validate key format (service role keys are long)
  if (supabaseKey.length < 50) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is too short');
    throw new Error('SUPABASE_SERVICE_ROLE_KEY appears to be invalid');
  }

  // Log (for debugging - remove in production)
  console.log('✓ Supabase credentials loaded successfully');
  console.log('  URL:', supabaseUrl);
  console.log('  Key length:', supabaseKey.length);

  // Create and return the client with credentials
  try {
    const client = createClient(supabaseUrl, supabaseKey, {
      auth: { 
        persistSession: false,
        autoRefreshToken: false,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      fetch: (...args) => fetch(...args),
    });

    return client;
  } catch (error) {
    console.error('ERROR: Failed to create Supabase client:', error);
    throw new Error(`Failed to initialize Supabase: ${error.message}`);
  }
}

export const BUCKET = 'sites';

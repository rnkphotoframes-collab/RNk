import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  if (SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY)) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!);
      return supabaseClient;
    } catch (err) {
      console.warn('Could not initialize Supabase client:', err);
    }
  }
  return null;
}

export function getSupabaseStatus() {
  const isConfigured = Boolean(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY));
  return {
    isConfigured,
    url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 15)}...` : null,
    hasServiceKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    hasAnonKey: Boolean(SUPABASE_ANON_KEY),
    mode: isConfigured ? 'supabase_cloud' : 'local_database_engine',
  };
}

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
export const hasSupabaseServiceRole = Boolean(
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY !== supabaseAnonKey &&
  !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-supabase-service-role-key')
);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ WARNING: SUPABASE_URL or SUPABASE_ANON_KEY is not defined in .env file.');
}

/**
 * Standard public Supabase client (respects Row Level Security)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Admin Supabase client (bypasses Row Level Security for server-side trusted operations)
 */
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : supabase;

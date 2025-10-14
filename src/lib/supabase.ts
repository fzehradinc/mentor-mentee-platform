import { createClient } from '@supabase/supabase-js';

// Supabase configuration (environment variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Geçici fallback - eğer env variables yoksa mock client döndür
if (!supabaseUrl || supabaseUrl.includes('your-project') || !supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
  console.warn('⚠️ Supabase environment variables not configured, using mock client');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Mock functions for development
export const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      data: [],
      error: null
    }),
    insert: () => ({
      data: [],
      error: null
    }),
    update: () => ({
      data: [],
      error: null
    }),
    delete: () => ({
      data: [],
      error: null
    })
  }),
  auth: {
    signIn: () => Promise.resolve({ data: { user: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null })
  }
};
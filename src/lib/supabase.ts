import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!SUPABASE_URL) {
  throw new Error(
    "Missing Supabase URL. Define VITE_SUPABASE_URL in your .env file.",
  );
}
if (!SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase anon key. Define VITE_SUPABASE_ANON_KEY in your .env file.",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
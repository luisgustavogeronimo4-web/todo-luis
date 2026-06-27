import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// CORREÇÃO DO HIGH: Estratégia Fail Fast estrita exigida pelo scanner de segurança.
// Remove os fallbacks em texto plano para evitar vazamentos no bundle final do cliente.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Configuração crítica do banco de dados ausente no ambiente.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
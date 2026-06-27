import { createClient } from "@supabase/supabase-js";

// Captura as chaves limpando espaços em branco
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Variável para armazenar a instância do cliente
let supabaseInstance;

// Validação e inicialização protegida
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Em produção, evita jogar erros que quebram o script global expor stack traces.
  // Criamos um cliente "dummy" (vazio) para que o app não dê crash na inicialização
  supabaseInstance = createClient(
    "https://placeholder-missing-env-url.supabase.co", 
    "placeholder-missing-env-key"
  );
} else {
  try {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch {
    // Fallback de segurança caso a biblioteca do Supabase falhe internamente
    supabaseInstance = createClient(
      "https://placeholder-missing-env-url.supabase.co", 
      "placeholder-missing-env-key"
    );
  }
}

export const supabase = supabaseInstance;
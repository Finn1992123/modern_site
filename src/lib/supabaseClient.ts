import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createMissingSupabaseClient(): SupabaseClient {
  return new Proxy(
    {},
    {
      get() {
        throw new Error("Missing Supabase environment variables.");
      },
    },
  ) as SupabaseClient;
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMissingSupabaseClient();

import { createClient } from "@supabase/supabase-js";

// Client-side Supabase (already exists in app/community/lib/supabase.ts, but here for reference)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase with service role (for admin operations)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL in environment variables. Check your .env.local file."
  );
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY in environment variables. Get it from Supabase Dashboard → Settings → API (service_role key). Add it to your .env.local file."
  );
}

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

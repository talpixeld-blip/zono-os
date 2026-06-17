/**
 * Centralised, validated access to Supabase environment variables.
 * Throwing here gives a clear error instead of a confusing runtime failure
 * deep inside the Supabase SDK.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. ` +
        `Add it to .env.local (see .env.example).`,
    );
  }
  return value;
}

/** Public values — safe to expose to the browser. */
export const supabasePublicEnv = {
  url: () =>
    required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
  anonKey: () =>
    required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
};

/** Server-only secret — never import this into a client component. */
export const supabaseServiceRoleKey = () =>
  required(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_WINDOWS_INSTALLER_URL: z.string().url().optional(),
  NEXT_PUBLIC_MAC_INSTALLER_URL: z.string().url().optional(),
  NEXT_PUBLIC_LINUX_INSTALLER_URL: z.string().url().optional(),
  NEXT_PUBLIC_IOS_STORE_URL: z.string().url().optional(),
  NEXT_PUBLIC_ANDROID_STORE_URL: z.string().url().optional(),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_BASIC_MONTHLY: z.string().min(1).optional(),
  STRIPE_PRICE_PRO_MONTHLY: z.string().min(1).optional(),
  STRIPE_PRICE_SEMESTER: z.string().min(1).optional(),
});
const allowedOriginsSchema = z.string().min(1);

type PublicEnv = z.infer<typeof publicSchema>;
type ServerEnv = z.infer<typeof serverSchema>;

let cachedPublicEnv: PublicEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;
let cachedAllowedOrigins: string[] | null = null;

export function getPublicEnv() {
  if (cachedPublicEnv) return cachedPublicEnv;

  cachedPublicEnv = publicSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_WINDOWS_INSTALLER_URL: process.env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL,
    NEXT_PUBLIC_MAC_INSTALLER_URL: process.env.NEXT_PUBLIC_MAC_INSTALLER_URL,
    NEXT_PUBLIC_LINUX_INSTALLER_URL: process.env.NEXT_PUBLIC_LINUX_INSTALLER_URL,
    NEXT_PUBLIC_IOS_STORE_URL: process.env.NEXT_PUBLIC_IOS_STORE_URL,
    NEXT_PUBLIC_ANDROID_STORE_URL: process.env.NEXT_PUBLIC_ANDROID_STORE_URL,
  });

  return cachedPublicEnv;
}

export function getServerEnv() {
  if (cachedServerEnv) return cachedServerEnv;

  cachedServerEnv = serverSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_WINDOWS_INSTALLER_URL: process.env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL,
    NEXT_PUBLIC_MAC_INSTALLER_URL: process.env.NEXT_PUBLIC_MAC_INSTALLER_URL,
    NEXT_PUBLIC_LINUX_INSTALLER_URL: process.env.NEXT_PUBLIC_LINUX_INSTALLER_URL,
    NEXT_PUBLIC_IOS_STORE_URL: process.env.NEXT_PUBLIC_IOS_STORE_URL,
    NEXT_PUBLIC_ANDROID_STORE_URL: process.env.NEXT_PUBLIC_ANDROID_STORE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_BASIC_MONTHLY: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    STRIPE_PRICE_PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY,
    STRIPE_PRICE_SEMESTER: process.env.STRIPE_PRICE_SEMESTER,
  });

  return cachedServerEnv;
}

export function getAllowedOrigins(): string[] {
  if (cachedAllowedOrigins) return cachedAllowedOrigins;

  // Default CORS to the app URL so missing API-only config does not break page builds.
  cachedAllowedOrigins = allowedOriginsSchema
    .parse(process.env.ALLOWED_ORIGINS ?? getPublicEnv().NEXT_PUBLIC_APP_URL)
    .split(",")
    .map((origin: string) => origin.trim())
    .filter(Boolean);

  return cachedAllowedOrigins ?? [getPublicEnv().NEXT_PUBLIC_APP_URL];
}

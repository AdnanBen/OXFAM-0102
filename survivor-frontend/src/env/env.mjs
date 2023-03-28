/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const server = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url()
  ),
  AZURE_AD_B2C_TENANT_NAME: z.string(),
  AZURE_AD_B2C_CLIENT_ID: z.string(),
  AZURE_AD_B2C_CLIENT_SECRET: z.string(),
  AZURE_AD_B2C_PRIMARY_USER_FLOW: z.string(),
  AZURE_AD_SERVER_CLIENT_SECRET: z.string(),
  AZURE_AD_SERVER_TENANT_ID: z.string(),
  AZURE_AD_B2C_USER_EXTENSION_APP_ID: z.string(),
  SSR_HOST: z.string(),
  SSR_SECRET_KEY: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  NEXT_PUBLIC_PANIC_URL_PATH: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * edge runtimes (e.g. middlewares) or client-side so we need to destruct manually.
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  AZURE_AD_B2C_TENANT_NAME: process.env.AZURE_AD_B2C_TENANT_NAME,
  AZURE_AD_B2C_CLIENT_ID: process.env.AZURE_AD_B2C_CLIENT_ID,
  AZURE_AD_B2C_CLIENT_SECRET: process.env.AZURE_AD_B2C_CLIENT_SECRET,
  AZURE_AD_B2C_PRIMARY_USER_FLOW: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
  AZURE_AD_SERVER_CLIENT_SECRET: process.env.AZURE_AD_SERVER_CLIENT_SECRET,
  AZURE_AD_SERVER_TENANT_ID: process.env.AZURE_AD_SERVER_TENANT_ID,
  AZURE_AD_B2C_USER_EXTENSION_APP_ID:
    process.env.AZURE_AD_B2C_USER_EXTENSION_APP_ID,
  SSR_HOST: process.env.SSR_HOST,
  NEXT_PUBLIC_PANIC_URL_PATH: process.env.NEXT_PUBLIC_PANIC_URL_PATH,
  SSR_SECRET_KEY: process.env.SSR_SECRET_KEY,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);
/** @type z.infer<merged>
 *  @ts-ignore - can't type this properly in jsdoc */
let env = process.env;

export { env };

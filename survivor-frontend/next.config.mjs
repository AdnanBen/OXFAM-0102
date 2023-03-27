// @ts-check

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  // TODO remove this
  typescript: { ignoreBuildErrors: true },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en", "ny"],
    defaultLocale: "en",
  },
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
  },
};
export default config;

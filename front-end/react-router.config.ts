import type { Config } from "@react-router/dev/config";

// Disable SSR in development so Vite HMR updates pages in-place
// (react-router's dev server enables SSR by default which can trigger full
// page reloads when route modules change). In production we keep SSR enabled.
const isDev = typeof process !== "undefined" ? process.env.NODE_ENV === "development" : false;

export default {
  ssr: isDev ? false : true,
} satisfies Config;

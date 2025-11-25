import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Combined Vite config: server options for Docker/WSL HMR reliability
// and plugins for tailwind, react-router dev and tsconfig paths.
export default defineConfig(() => ({
  server: {
    host: true,
    port: 5173,
    watch: {
      // Use polling for Docker/WSL where native fs events are unreliable
      usePolling: true,
      interval: 100,
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
}));

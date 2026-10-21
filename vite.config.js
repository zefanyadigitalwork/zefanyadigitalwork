import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

const pages = ["index", "about", "projects", "project", "contact", "page", "admin"];

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (command === "build" && (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY)) {
    throw new Error("Build membutuhkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY. Atur di .env.local atau Vercel Environment Variables.");
  }

  return {
    base: "/",
    build: {
      outDir: "dist",
      rollupOptions: {
        input: pages.map((page) => resolve(process.cwd(), `${page}.html`))
      }
    }
  };
});

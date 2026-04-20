export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || "/"
  },
  nitro: process.env.NODE_ENV === "development" ? {} : { preset: "github_pages" },
  compatibilityDate: "2026-04-20"
});

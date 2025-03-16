import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        szkolenia: "szkolenia/stylizacja-paznokci.html",
      },
    },
  },
});

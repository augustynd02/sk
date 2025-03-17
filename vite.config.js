import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        paznokcie: resolve(__dirname, 'szkolenia/stylizacja-paznokci.html'),
        wybielanie: resolve(__dirname, 'szkolenia/wybielanie-zębów.html')
      }
    }
  }
});

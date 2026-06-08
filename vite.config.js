import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        army: resolve(__dirname, 'army.html'),
        queen: resolve(__dirname, 'queen.html')
      }
    }
  }
});

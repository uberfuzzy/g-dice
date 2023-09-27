import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
        "~components": path.resolve(__dirname, "./src", "components"),
        "~contexts": path.resolve(__dirname, "./src", "contexts"),
        "~util": path.resolve(__dirname, "./src", "util"),
      },
    },
    build: {
      outDir: 'build',
    },
    plugins: [react()],
  };
});

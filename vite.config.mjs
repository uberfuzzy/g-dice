import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const importDirname = import.meta.dirname;
  return {
    resolve: {
      alias: {
        "~": path.resolve(importDirname, "./src"),
        "~components": path.resolve(importDirname, "./src", "components"),
        "~contexts": path.resolve(importDirname, "./src", "contexts"),
        "~util": path.resolve(importDirname, "./src", "util"),
      },
    },
    build: {
      outDir: 'build',
    },
    plugins: [react()],
  };
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Copy the new logo file sent by the user to public, assets, and app icon folders
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const logoSrc = "C:/Users/HP/.gemini/antigravity-ide/brain/2c7cd8fc-31b3-42dd-a25e-8cdb7859de97/.user_uploaded/media_1788707745667.jpg";
if (fs.existsSync(logoSrc)) {
  const destPublic = path.join(__dirname, 'public', 'logo.png');
  const destAssets = path.join(__dirname, 'assets', 'logo.png');
  try {
    fs.copyFileSync(logoSrc, destPublic);
    console.log("[LCS Logo] Copied → public/logo.png (", fs.statSync(destPublic).size, "bytes)");
  } catch(e) { console.error("[LCS Logo] ERROR copying to public:", e.message); }
  try {
    if (fs.existsSync(path.dirname(destAssets))) {
      fs.copyFileSync(logoSrc, destAssets);
      console.log("[LCS Logo] Copied → assets/logo.png");
    }
  } catch(e) { /* assets dir may not exist, that's ok */ }
  console.log("[LCS Logo] Logo update complete.");
} else {
  console.warn("[LCS Logo] Source file not found:", logoSrc);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Increase chunk size warning limit (our dashboard is legitimately large)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunk splitting — separates vendor libs from app code
        manualChunks(id) {
          // React core in its own chunk — cached by browser across deploys
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // Router in its own chunk
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // Everything else from node_modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
  },
})

import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://brix-ia.com", // Deve stare qui, non in experimental
  experimental: {
    contentLayer: true, // Enable content layer collections
  },
  integrations: [tailwind(), icon(), react()],
  
  // Ottimizzazioni per build più veloci
  vite: {
    build: {
      minify: 'esbuild', // Build più veloce
      cssMinify: true,
    }
  },
  
  // Cache ottimizzata
  output: 'static',
  
  // Compressione immagini
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});

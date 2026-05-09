import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// Usiamo la versione a funzione di defineConfig per poter usare loadEnv se necessario
export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente basate sul 'mode' (es. .env.production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Base path fondamentale per il deploy su GitHub Pages
    base: '/Agende_Riutilizzabili/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Solitamente l'alias '@' punta alla cartella 'src' per pulizia nei path
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});

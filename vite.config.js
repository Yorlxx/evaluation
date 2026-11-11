import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const readEnv = (...keys) =>
    keys.map((key) => env[key] || process.env[key]).find(Boolean) || '';

  const supabaseUrl = readEnv('REACT_APP_SUPABASE_URL', 'VITE_SUPABASE_URL');
  const supabaseAnonKey = readEnv('REACT_APP_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    server: {
      port: 5173,
      host: true,
      // Permite exponer la demo con un túnel rápido de Cloudflare.
      allowedHosts: ['.trycloudflare.com'],
    },
    preview: {
      port: 4173,
      host: true,
      allowedHosts: ['.trycloudflare.com'],
    },
  };
});

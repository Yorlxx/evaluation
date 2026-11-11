import { HeartHandshake } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/40 print-hide">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          <p>
            <span className="font-semibold text-slate-700">JavaLab</span> · Proyección Social 2026 ·
            Enseñanza de programación en Java
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            aria-hidden="true"
          />
          <span>
            {isSupabaseConfigured
              ? 'Supabase conectado'
              : 'Modo local de demostración · configura Supabase en .env'}
          </span>
        </div>
      </div>
    </footer>
  );
}

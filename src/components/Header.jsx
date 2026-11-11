import { Braces, CalendarDays, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ onAdminClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#f5f6fa]/85 backdrop-blur-xl print-hide">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <Braces className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="flex items-baseline gap-2">
              <span className="font-extrabold tracking-tight text-slate-950">JavaLab</span>
              <span className="hidden rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 sm:inline">
                Diagnóstico
              </span>
            </span>
            <span className="block truncate text-[11px] font-medium text-slate-500">
              Proyección Social · Programación en Java
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2 text-[11px] font-semibold text-slate-600 shadow-sm lg:flex">
          <CalendarDays className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
          6 sesiones · 2 horas · 3 estudiantes
        </div>

        <button
          type="button"
          onClick={onAdminClick}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white px-3 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:px-4"
        >
          <Lock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span className="hidden sm:inline">Acceso Docente</span>
          <span className="sm:hidden">Docente</span>
        </button>
      </div>
    </header>
  );
}

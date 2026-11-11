import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  BarChart2,
  CalendarRange,
  Cloud,
  HardDrive,
  LayoutDashboard,
  ListChecks,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import ReportTab from './ReportTab';
import ResponsesTab from './ResponsesTab';
import ScheduleTab from './ScheduleTab';
import { useLockBodyScroll } from '../../lib/useLockBodyScroll';
import { cargarDatosDemo, eliminarDiagnostico, listarDiagnosticos } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

const TABS = [
  { id: 'reporte', label: 'Reporte maestro', shortLabel: 'Reporte', icon: LayoutDashboard },
  { id: 'respuestas', label: 'Respuestas detalladas', shortLabel: 'Respuestas', icon: ListChecks },
  { id: 'horarios', label: 'Matriz de horarios', shortLabel: 'Horarios', icon: CalendarRange },
];

function PanelSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse p-4 sm:p-6 lg:p-8">
      <div className="h-4 w-40 rounded bg-slate-200" />
      <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-36 rounded-2xl bg-white ring-1 ring-slate-200/70">
            <div className="p-5">
              <div className="h-10 w-10 rounded-xl bg-slate-100" />
              <div className="mt-4 h-7 w-20 rounded bg-slate-100" />
              <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-white ring-1 ring-slate-200/70" />
        <div className="h-64 rounded-2xl bg-white ring-1 ring-slate-200/70" />
      </div>
      <div className="mt-4 h-72 rounded-2xl bg-white ring-1 ring-slate-200/70" />
    </div>
  );
}

function PanelError({ message, onRetry, loading }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">
        No pudimos cargar el panel
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{message}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button onClick={onRetry} loading={loading}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Reintentar
        </Button>
      </div>
      <p className="mt-4 max-w-md text-[10px] leading-relaxed text-slate-400">
        Verifica que la tabla exista, que el SQL de supabase/schema.sql se haya ejecutado y que las
        variables REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY estén configuradas.
      </p>
    </div>
  );
}

export default function AdminPanel({ open, onClose }) {
  const [tab, setTab] = useState('reporte');
  const [records, setRecords] = useState([]);
  const [source, setSource] = useState(isSupabaseConfigured ? 'supabase' : 'local');
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);

  useLockBodyScroll(open);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    setHasLoaded(false);
    try {
      const result = await listarDiagnosticos();
      setRecords(result.data);
      setSource(result.source);
    } catch (loadError) {
      setError(loadError?.message || 'No se pudieron cargar los diagnósticos.');
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setTab('reporte');
    loadRecords();
  }, [open, loadRecords]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleDelete = async (id) => {
    await eliminarDiagnostico(id);
    setRecords((previous) => previous.filter((record) => record.id !== id));
  };

  const handleSeed = async () => {
    setSeeding(true);
    setError('');
    try {
      await cargarDatosDemo();
      const result = await listarDiagnosticos();
      setRecords(result.data);
      setSource(result.source);
    } catch (seedError) {
      setError(seedError?.message || 'No se pudieron cargar los datos de ejemplo.');
    } finally {
      setSeeding(false);
    }
  };

  if (!open) return null;

  const cloud = source === 'supabase';
  const initialLoading = !hasLoaded && !error && records.length === 0;
  const fatalError = Boolean(error) && records.length === 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] animate-fade-in bg-slate-950/65 p-0 backdrop-blur-md sm:p-4 lg:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex h-full max-w-[1400px] animate-scale-in flex-col overflow-hidden bg-[#f5f6fa] shadow-2xl ring-1 ring-white/15 sm:rounded-[28px]">
        <header className="relative shrink-0 overflow-hidden bg-slate-950 px-4 py-4 text-white sm:px-6">
          <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-indigo-200 ring-1 ring-white/10">
                <BarChart2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-base font-extrabold tracking-tight sm:text-lg">
                    Panel Docente
                  </h1>
                  <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-300 ring-1 ring-white/10 sm:inline">
                    Proyección Social
                  </span>
                </div>
                <p className="truncate text-[10px] text-slate-400">
                  Diagnóstico de programación · 6 sesiones de Java
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  'hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ring-1 ring-inset sm:inline-flex',
                  cloud
                    ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20'
                    : 'bg-amber-400/10 text-amber-300 ring-amber-400/20'
                )}
              >
                {cloud ? (
                  <Cloud className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <HardDrive className="h-3 w-3" aria-hidden="true" />
                )}
                {cloud ? 'Supabase conectado' : 'Modo local'}
              </span>

              <button
                type="button"
                onClick={loadRecords}
                disabled={loading}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
                aria-label="Actualizar datos"
                title="Actualizar datos"
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Cerrar panel docente"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <div className="shrink-0 border-b border-slate-200 bg-white px-2 sm:px-5">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar" aria-label="Secciones del panel docente">
            {TABS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex shrink-0 items-center gap-2 px-3 py-3.5 text-[11px] font-semibold transition-colors sm:px-4 sm:text-xs',
                    active ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.id === 'respuestas' && records.length > 0 ? (
                    <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
                      {records.length}
                    </span>
                  ) : null}
                  {active ? (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-indigo-600" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
            <span className="ml-auto hidden items-center gap-1 px-2 text-[9px] font-medium text-slate-400 lg:flex">
              <ShieldCheck className="h-3 w-3 text-emerald-500" aria-hidden="true" />
              Acceso con PIN
            </span>
          </nav>
        </div>

        {loading && records.length > 0 ? (
          <div className="h-0.5 w-full shrink-0 overflow-hidden bg-indigo-100">
            <div className="h-full w-full animate-pulse bg-indigo-400" />
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {initialLoading ? (
            <PanelSkeleton />
          ) : fatalError ? (
            <PanelError message={error} onRetry={loadRecords} loading={loading} />
          ) : (
            <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
              {tab === 'reporte' ? (
                <ReportTab
                  records={records}
                  error={error}
                  onRefresh={loadRecords}
                  loading={loading}
                  onSeed={handleSeed}
                  seeding={seeding}
                  source={source}
                />
              ) : null}
              {tab === 'respuestas' ? (
                <ResponsesTab
                  records={records}
                  loading={loading}
                  error={error}
                  onRefresh={loadRecords}
                  onDelete={handleDelete}
                  onSeed={handleSeed}
                  seeding={seeding}
                  source={source}
                />
              ) : null}
              {tab === 'horarios' ? (
                <ScheduleTab
                  records={records}
                  loading={loading}
                  error={error}
                  onRefresh={loadRecords}
                  source={source}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

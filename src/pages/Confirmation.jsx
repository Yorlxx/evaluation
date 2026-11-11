import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Cloud,
  HardDrive,
  Laptop,
  Lock,
  Printer,
  Sparkles,
  Target,
  Wifi,
} from 'lucide-react';
import ScoreRing from '../components/ui/ScoreRing';
import { LevelBadge, SoftBadge } from '../components/ui/Badge';
import { DAYS_SHORT, GROUP_GUIDANCE } from '../lib/constants';
import { levelFromRecord, firstName, formatDateTime, rangeToPercent } from '../lib/diagnostic';
import { readLastResult } from '../lib/resultStorage';

function EmptyResult() {
  return (
    <main className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" aria-hidden="true" />
      <div className="surface relative max-w-xl p-8 text-center sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Target className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          Aún no hay un diagnóstico reciente
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Completa el formulario de 3 pasos para descubrir tu nivel y recibir una ruta de
          aprendizaje personalizada.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Ir al diagnóstico
        </Link>
      </div>
    </main>
  );
}

export default function Confirmation() {
  const location = useLocation();
  const result = location.state?.record ? location.state : readLastResult();
  const record = result?.record;

  if (!record) return <EmptyResult />;

  const level = levelFromRecord(record);
  const guidance = GROUP_GUIDANCE[level.level];
  const percent = rangeToPercent(record.puntaje, 6);
  const availabilityDays = Array.isArray(record.disponibilidad_dias)
    ? record.disponibilidad_dias
    : [];
  const availabilitySlots = Array.isArray(record.disponibilidad_franjas)
    ? record.disponibilidad_franjas
    : [];
  const isCloud = result.source === 'supabase';

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 print-hide" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-indigo-50/80 via-transparent to-transparent" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -right-24 top-36 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[360px] bg-dots opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 shadow-sm">
            <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Diagnóstico completado
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-4xl">
            ¡Listo, {firstName(record.nombre_completo)}!
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
            Ya tenemos tu punto de partida. Tu facilitador usará este resultado para adaptar las 6
            sesiones y acompañarte desde donde estás.
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section className="surface print-area animate-fade-up p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <SoftBadge tone={isCloud ? 'emerald' : 'amber'}>
                {isCloud ? (
                  <Cloud className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <HardDrive className="h-3 w-3" aria-hidden="true" />
                )}
                {isCloud ? 'Guardado en Supabase' : 'Guardado en este navegador'}
              </SoftBadge>
              <span className="text-[10px] font-medium text-slate-400">
                {formatDateTime(record.created_at)}
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <ScoreRing score={record.puntaje} total={6} level={level} size={188} strokeWidth={12} />
              <div className="mt-4">
                <LevelBadge level={level} />
              </div>
              <p className="mt-3 text-[11px] font-semibold text-slate-400">
                {percent}% de respuestas correctas · {level.range}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-sm font-bold text-slate-900">{record.nombre_completo}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">{record.grado}</p>
            </div>

            <p className="mt-5 text-center text-xs leading-relaxed text-slate-600">
              {level.message}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-5">
              <div className="rounded-xl border border-slate-100 bg-white p-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  <Laptop className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
                  Equipo
                </div>
                <p className="mt-1.5 text-[11px] font-bold leading-snug text-slate-700">
                  {record.equipo}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white p-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  <Wifi className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
                  Internet
                </div>
                <p className="mt-1.5 text-[11px] font-bold leading-snug text-slate-700">
                  {record.conexion_internet}
                </p>
              </div>
              <div className="col-span-2 rounded-xl border border-slate-100 bg-white p-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
                  Tu disponibilidad
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {availabilityDays.map((day) => (
                    <span
                      key={day}
                      className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700"
                    >
                      {DAYS_SHORT[day] || day}
                    </span>
                  ))}
                  {availabilitySlots.map((slot) => (
                    <span
                      key={slot}
                      className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="plan-card relative animate-fade-up overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_30px_90px_-40px_rgba(15,23,42,0.8)] ring-1 ring-white/10 [animation-delay:100ms] sm:p-8 print:bg-white print:text-slate-900 print:ring-slate-200">
            <div
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl print-hide"
              aria-hidden="true"
            />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-indigo-200 print:bg-indigo-50 print:text-indigo-600">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-300 print:text-indigo-600">
                  Tu ruta personalizada
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-[28px]">
                {guidance.headline}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-[13px] print:text-slate-600">
                {level.message}
              </p>

              <div className="mt-5 space-y-2.5">
                {level.roadmap.map((phase, index) => (
                  <div
                    key={phase.title}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-3.5 print:border-slate-200 print:bg-slate-50"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-500/20 text-[9px] font-extrabold text-indigo-200 print:bg-indigo-100 print:text-indigo-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white print:text-slate-900">{phase.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400 print:text-slate-600">
                        {phase.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 print:border-slate-200 print:bg-white">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">Ritmo</p>
                  <p className="mt-1 text-[10px] font-semibold leading-snug text-slate-200 print:text-slate-700">
                    {guidance.pace}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 print:border-slate-200 print:bg-white">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">Foco</p>
                  <p className="mt-1 text-[10px] font-semibold leading-snug text-slate-200 print:text-slate-700">
                    {guidance.focus}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3.5 print:border-slate-200 print:bg-slate-50">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-indigo-300 print:text-indigo-600">
                  Cómo empezaremos · Sesión 01
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-300 print:text-slate-600">
                  {level.nextStep}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 print-hide sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-50 sm:w-auto"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Imprimir resultado
          </button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] font-medium text-slate-400 print-hide">
          <Lock className="h-3 w-3" aria-hidden="true" />
          Tu facilitador verá este resultado en el panel docente para ajustar el plan.
        </p>
      </div>
    </main>
  );
}

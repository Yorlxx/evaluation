import {
  ArrowDown,
  BarChart2,
  CalendarDays,
  Clock,
  GraduationCap,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
} from 'lucide-react';
import DiagnosticWizard from '../components/wizard/DiagnosticWizard';
import { SESSION_PLAN } from '../lib/constants';
import { cn } from '../lib/utils';

const FEATURES = [
  { icon: Clock, label: '5–7 minutos' },
  { icon: ListChecks, label: '6 preguntas' },
  { icon: GraduationCap, label: '4to y 5to de secundaria' },
  { icon: ShieldCheck, label: 'Sin experiencia previa' },
];

function TerminalPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[350px]">
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-indigo-400/25 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-sky-400/20 blur-2xl" aria-hidden="true" />

      <div className="relative rotate-[1.5deg] overflow-hidden rounded-[26px] bg-slate-950 p-1.5 shadow-[0_32px_80px_-30px_rgba(15,23,42,0.7)] ring-1 ring-white/10 transition-transform duration-500 hover:rotate-0">
        <div className="rounded-[20px] border border-white/5 bg-slate-950">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-rose-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
              <Terminal className="h-3 w-3" aria-hidden="true" />
              diagnostico.java
            </span>
          </div>

          <pre className="overflow-hidden p-5 font-mono text-[11px] leading-[1.85] text-slate-300 sm:text-[11.5px]">
            <span className="text-slate-500">// Tu plan, a tu medida</span>
            {'\n'}
            <span className="text-violet-300">int</span> nivel = <span className="text-sky-300">diagnostico</span>(estudiante);
            {'\n\n'}
            <span className="text-violet-300">if</span> (nivel == <span className="text-amber-300">0</span>) {'{'}
            {'\n'}    plan.<span className="text-emerald-300">desdeCero</span>();
            {'\n'}    plan.<span className="text-emerald-300">practicar</span>(<span className="text-amber-300">2</span>);
            {'\n'}
            {'}'} <span className="text-violet-300">else</span> {'{'}
            {'\n'}    plan.<span className="text-emerald-300">acelerar</span>();
            {'\n'}
            {'}'}
            {'\n\n'}
            <span className="text-slate-500">// 6 sesiones · 2 h cada una</span>
            {'\n'}
            <span className="text-emerald-300">System</span>.out.<span className="text-sky-300">println</span>(
            {'\n'}    <span className="text-amber-200">"¡A programar!"</span>);
          </pre>

          <div className="mx-4 mb-4 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Evaluación lista
              </span>
            </div>
            <div className="mt-2.5 flex gap-1.5" aria-hidden="true">
              <span className="h-1 flex-1 rounded-full bg-amber-400/80" />
              <span className="h-1 flex-1 rounded-full bg-sky-400/80" />
              <span className="h-1 flex-1 rounded-full bg-emerald-400/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-6 top-14 hidden rotate-3 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-lg shadow-slate-900/10 backdrop-blur lg:block">
        <div className="flex items-center gap-1.5">
          <BarChart2 className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
          <span className="text-[10px] font-bold text-slate-700">Panel docente</span>
        </div>
      </div>
    </div>
  );
}

function RouteCard() {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
            Ruta del programa
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-950">
            6 sesiones · 2 horas
          </h2>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Del primer programa a la recursión, un tema por encuentro.
          </p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5">
        {SESSION_PLAN.map((session, index) => (
          <div key={session.number} className="relative flex gap-3 pb-4 last:pb-0">
            {index < SESSION_PLAN.length - 1 ? (
              <span
                className="absolute left-[13px] top-7 h-[calc(100%-14px)] w-px bg-slate-200"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={cn(
                'relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-extrabold ring-2',
                index === 0
                  ? 'bg-indigo-600 text-white ring-indigo-100'
                  : 'bg-white text-slate-500 ring-slate-100'
              )}
            >
              {session.number}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-xs font-bold leading-snug text-slate-800">{session.title}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{session.short}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl bg-slate-950 p-4 text-white">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/30 blur-2xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-indigo-300" aria-hidden="true" />
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">La meta</p>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
            No memorizar código: comprender la lógica y poder explicar cada solución.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-indigo-50/80 via-transparent to-transparent" />
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-dots opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-700 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              Diagnóstico abierto · Proyección Social 2026
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[58px]">
              Descubre tu nivel.{' '}
              <span className="text-gradient">Aprende Java</span> desde donde estás.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Un diagnóstico de 3 pasos que adapta las 6 sesiones del programa a lo que ya sabes.
              Sin experiencia previa, sin presión: solo una brújula para empezar bien.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <span
                    key={feature.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur"
                  >
                    <Icon className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
                    {feature.label}
                  </span>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#diagnostico"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Empezar mi diagnóstico
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-[11px] font-medium text-slate-400">
                No necesitas crear una cuenta.
              </span>
            </div>
          </div>

          <div className="hidden animate-fade-up [animation-delay:140ms] lg:block">
            <TerminalPreview />
          </div>
        </div>
      </section>

      <section
        id="diagnostico"
        className="relative mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16"
      >
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.58fr)_minmax(300px,0.72fr)] lg:items-start">
          <div className="min-w-0">
            <DiagnosticWizard />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <RouteCard />

            <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-xs font-extrabold text-slate-900">¿Qué evaluamos?</h3>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Variables', 'Tipos de dato', 'Condicionales', 'Bucles', 'Arreglos', 'Lógica'].map(
                  (topic) => (
                    <span
                      key={topic}
                      className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200"
                    >
                      {topic}
                    </span>
                  )
                )}
              </div>
              <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-500">
                El resultado no es una nota. Es una referencia para que el facilitador ajuste el
                ritmo de las sesiones y tú sepas qué esperar.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

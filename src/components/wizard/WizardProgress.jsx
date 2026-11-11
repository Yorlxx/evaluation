import { Check, Code2, Target, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const STEPS = [
  { number: 1, label: 'Logística', subtitle: 'Tus datos', icon: User },
  { number: 2, label: 'Experiencia', subtitle: 'Tu punto de partida', icon: Code2 },
  { number: 3, label: 'Diagnóstico', subtitle: 'Mini-quiz', icon: Target },
];

export default function WizardProgress({ step }) {
  const percent = Math.round((step / 3) * 100);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Progreso del diagnóstico
        </p>
        <p className="text-[10px] font-bold text-indigo-600">
          Paso {step} de 3
          <span className="ml-1.5 font-medium text-slate-400">· {percent}%</span>
        </p>
      </div>

      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        >
          <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%] animate-shimmer" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
        {STEPS.map((item) => {
          const completed = item.number < step;
          const active = item.number === step;
          const Icon = item.icon;
          return (
            <div
              key={item.number}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2 text-center transition-colors sm:flex-row sm:items-center sm:justify-start sm:gap-2 sm:px-2.5 sm:text-left',
                active
                  ? 'border-indigo-200 bg-indigo-50/70'
                  : completed
                    ? 'border-emerald-100 bg-emerald-50/50'
                    : 'border-transparent bg-slate-50/70'
              )}
            >
              <span
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold transition-colors',
                  active
                    ? 'bg-indigo-600 text-white'
                    : completed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-slate-400 ring-1 ring-slate-200'
                )}
              >
                {completed ? (
                  <Check className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Icon className="h-3 w-3" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    'block whitespace-nowrap text-[10px] font-bold leading-tight sm:truncate sm:text-[11px]',
                    active ? 'text-indigo-900' : completed ? 'text-emerald-800' : 'text-slate-400'
                  )}
                >
                  {item.label}
                </span>
                <span className="hidden truncate text-[9px] text-slate-400 sm:block">
                  {item.subtitle}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

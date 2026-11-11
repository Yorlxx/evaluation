import { AlertTriangle, CheckCircle, MessageSquareQuote, Sparkles } from 'lucide-react';
import { EXPERIENCE_OPTIONS } from '../../lib/constants';
import { cn } from '../../lib/utils';

const TONES = {
  amber: {
    active: 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/20',
    icon: 'bg-amber-100 text-amber-600',
    check: 'text-amber-600',
  },
  sky: {
    active: 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500/20',
    icon: 'bg-sky-100 text-sky-600',
    check: 'text-sky-600',
  },
  emerald: {
    active: 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500/20',
    icon: 'bg-emerald-100 text-emerald-600',
    check: 'text-emerald-600',
  },
};

function FieldError({ children }) {
  if (!children) return null;
  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-rose-600" role="alert">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function StepExperience({ form, updateField, errors }) {
  return (
    <div className="space-y-7">
      <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold text-indigo-900">Aquí no hay respuestas incorrectas</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-indigo-700/80">
            Queremos conocer tu punto de partida para adaptar el ritmo. Responde con sinceridad: eso
            nos ayuda a acompañarte mejor.
          </p>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
              Nivel de experiencia previa <span className="text-rose-500">*</span>
            </h3>
            <p className="mt-1.5 text-xs text-slate-500">Elige la opción que mejor te describa.</p>
          </div>
        </div>

        <div className="space-y-2.5" role="radiogroup" aria-label="Nivel de experiencia previa">
          {EXPERIENCE_OPTIONS.map((option, index) => {
            const selected = form.experiencia === option.value;
            const tone = TONES[option.tone] || TONES.sky;
            const Icon = option.icon;
            return (
              <label
                key={option.value}
                className={cn(
                  'group flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2',
                  selected
                    ? tone.active
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                )}
              >
                <input
                  id={`experiencia-${index}`}
                  type="radio"
                  name="experiencia"
                  value={option.value}
                  checked={selected}
                  onChange={() => updateField('experiencia', option.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors',
                    selected ? tone.icon : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-800">{option.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                    {option.hint}
                  </span>
                </span>
                {selected ? (
                  <CheckCircle className={cn('mt-1 h-5 w-5 shrink-0', tone.check)} aria-hidden="true" />
                ) : (
                  <span className="mt-1 h-5 w-5 shrink-0 rounded-full border border-slate-200" aria-hidden="true" />
                )}
              </label>
            );
          })}
        </div>
        <FieldError>{errors.experiencia}</FieldError>
      </div>

      <div>
        <label
          htmlFor="experienciaDetalle"
          className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-600"
        >
          <MessageSquareQuote className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          Cuéntanos un poco más
          <span className="text-[10px] font-medium normal-case tracking-normal text-slate-400">
            (opcional)
          </span>
        </label>
        <p className="mb-2 text-xs text-slate-500">
          ¿Qué has practicado? ¿Qué te gustaría aprender primero? Cualquier detalle nos sirve.
        </p>
        <div className="relative">
          <textarea
            id="experienciaDetalle"
            rows={5}
            maxLength={500}
            value={form.experienciaDetalle}
            onChange={(event) => updateField('experienciaDetalle', event.target.value)}
            placeholder="Ej. Hice un juego en Scratch con condicionales. Quiero aprender a hacer lo mismo en Java y entender mejor los bucles."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
          <span
            className={cn(
              'absolute bottom-2.5 right-3 text-[10px] font-medium',
              form.experienciaDetalle.length > 460 ? 'text-amber-600' : 'text-slate-400'
            )}
          >
            {form.experienciaDetalle.length}/500
          </span>
        </div>
      </div>
    </div>
  );
}

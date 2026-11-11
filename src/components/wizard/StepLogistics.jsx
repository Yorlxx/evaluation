import {
  AlertTriangle,
  CheckCircle,
  Clock,
  GraduationCap,
  Laptop,
  User,
  Wifi,
} from 'lucide-react';
import { DAYS, EQUIPMENT_OPTIONS, GRADES, INTERNET_OPTIONS, TIME_SLOTS } from '../../lib/constants';
import { cn } from '../../lib/utils';

const TONES = {
  emerald: {
    active: 'border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500/25',
    icon: 'bg-emerald-100 text-emerald-600',
    check: 'text-emerald-600',
  },
  amber: {
    active: 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-500/25',
    icon: 'bg-amber-100 text-amber-600',
    check: 'text-amber-600',
  },
  rose: {
    active: 'border-rose-500 bg-rose-50/80 ring-1 ring-rose-500/25',
    icon: 'bg-rose-100 text-rose-600',
    check: 'text-rose-600',
  },
  sky: {
    active: 'border-sky-500 bg-sky-50/80 ring-1 ring-sky-500/25',
    icon: 'bg-sky-100 text-sky-600',
    check: 'text-sky-600',
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

function SectionTitle({ icon: Icon, title, hint, id }) {
  return (
    <div className="mb-3" id={id} tabIndex={-1}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-indigo-500" aria-hidden="true" />
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">{title}</h3>
        <span className="h-px flex-1 bg-slate-100" />
      </div>
      {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function OptionCard({ option, selected, onClick, name }) {
  const tone = TONES[option.tone] || TONES.sky;
  const Icon = option.icon;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={option.label}
      onClick={onClick}
      data-option={name}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:flex-col sm:gap-2.5 sm:p-4',
        selected
          ? tone.active
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
      )}
    >
      <span
        className={cn(
          'grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors',
          selected ? tone.icon : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold leading-snug text-slate-800 sm:text-[13px]">
          {option.label}
        </span>
        <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{option.hint}</span>
      </span>
      {selected ? (
        <CheckCircle
          className={cn('absolute right-3 top-3 h-4 w-4 sm:static sm:mt-1', tone.check)}
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

export default function StepLogistics({ form, updateField, toggleArray, errors }) {
  return (
    <div className="space-y-7">
      <div>
        <label
          htmlFor="nombreCompleto"
          className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-600"
        >
          <span>
            Nombre completo <span className="text-rose-500">*</span>
          </span>
          <span className="text-[10px] font-medium normal-case tracking-normal text-slate-400">
            Como figurará en tu registro
          </span>
        </label>
        <div className="relative">
          <User
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            autoComplete="name"
            maxLength={120}
            placeholder="Ej. Valeria Ríos Quispe"
            value={form.nombreCompleto}
            onChange={(event) => updateField('nombreCompleto', event.target.value)}
            aria-invalid={Boolean(errors.nombreCompleto)}
            aria-describedby={errors.nombreCompleto ? 'nombre-error' : undefined}
            className={cn(
              'h-12 w-full rounded-xl border bg-slate-50/60 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:ring-4',
              errors.nombreCompleto
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
            )}
          />
        </div>
        <span id="nombre-error">
          <FieldError>{errors.nombreCompleto}</FieldError>
        </span>
      </div>

      <div>
        <SectionTitle
          icon={GraduationCap}
          title="Grado académico"
          hint="Selecciona el año que estás cursando."
          id="grado-group"
        />
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Grado académico">
          {GRADES.map((grade, index) => {
            const selected = form.grado === grade.value;
            return (
              <label
                key={grade.value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2',
                  selected
                    ? 'border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                )}
              >
                <input
                  id={`grado-${index}`}
                  type="radio"
                  name="grado"
                  value={grade.value}
                  checked={selected}
                  onChange={() => updateField('grado', grade.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors',
                    selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-800">{grade.label}</span>
                  <span className="block text-[11px] text-slate-500">{grade.hint}</span>
                </span>
                {selected ? (
                  <CheckCircle className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
                ) : null}
              </label>
            );
          })}
        </div>
        <FieldError>{errors.grado}</FieldError>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
        <SectionTitle
          icon={Clock}
          title="Disponibilidad horaria"
          hint="Marca todos los días y franjas en las que podrías asistir a una clase de 2 horas."
          id="dias-group"
        />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {DAYS.map((day) => {
            const selected = form.dias.includes(day);
            return (
              <button
                key={day}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleArray('dias', day)}
                className={cn(
                  'h-10 rounded-xl border text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                  selected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
        <FieldError>{errors.dias}</FieldError>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {TIME_SLOTS.map((slot) => {
            const selected = form.franjas.includes(slot.value);
            const Icon = slot.icon;
            return (
              <button
                key={slot.value}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleArray('franjas', slot.value)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                  selected
                    ? 'border-indigo-500 bg-white ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                )}
              >
                <span
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-lg',
                    selected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800">{slot.label}</span>
                  <span className="block text-[10px] font-medium text-slate-500">{slot.time}</span>
                </span>
              </button>
            );
          })}
        </div>
        <FieldError>{errors.franjas}</FieldError>

        <div className="mt-4">
          <label htmlFor="disponibilidadDetalle" className="mb-1.5 block text-[11px] font-semibold text-slate-500">
            ¿Algún detalle que debamos considerar? <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            id="disponibilidadDetalle"
            type="text"
            maxLength={240}
            placeholder="Ej. Los sábados solo por la mañana, o avísame con anticipación."
            value={form.disponibilidadDetalle}
            onChange={(event) => updateField('disponibilidadDetalle', event.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div>
        <SectionTitle
          icon={Laptop}
          title="Equipamiento"
          hint="¿Con qué equipo cuentas para practicar?"
          id="equipo-group"
        />
        <div className="grid gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Equipamiento">
          {EQUIPMENT_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              selected={form.equipo === option.value}
              onClick={() => updateField('equipo', option.value)}
              name="equipo"
            />
          ))}
        </div>
        <FieldError>{errors.equipo}</FieldError>
      </div>

      <div>
        <SectionTitle
          icon={Wifi}
          title="Conexión a internet"
          hint="Así sabremos cómo preparar los materiales de práctica."
          id="conexion-group"
        />
        <div className="grid gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Conexión a internet">
          {INTERNET_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              selected={form.conexion === option.value}
              onClick={() => updateField('conexion', option.value)}
              name="conexion"
            />
          ))}
        </div>
        <FieldError>{errors.conexion}</FieldError>
      </div>
    </div>
  );
}

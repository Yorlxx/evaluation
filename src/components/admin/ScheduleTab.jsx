import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Laptop,
  RefreshCw,
  Users,
  Wifi,
} from 'lucide-react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { DAYS_SHORT, TIME_SLOTS } from '../../lib/constants';
import { avatarTone, buildScheduleMatrix, getInitials } from '../../lib/diagnostic';
import { cn } from '../../lib/utils';

function coverageClasses(count, total) {
  if (count === 0) return 'border-slate-100 bg-slate-50/50';
  if (count === total) return 'border-emerald-200 bg-emerald-50/80';
  if (count / total >= 0.66) return 'border-sky-200 bg-sky-50/80';
  return 'border-amber-200 bg-amber-50/80';
}

function buildCopyText(best, options, total) {
  if (!best) return '';
  const lines = [
    'JavaLab · Horario tentativo para las sesiones de Java',
    `${best.day}, ${best.slot.label} (${best.slot.time})`,
    `Disponibilidad: ${best.count} de ${total} estudiantes`,
    `Estudiantes: ${best.students.map((student) => student.nombre_completo).join(', ')}`,
    '',
    'Alternativas:',
    ...options.slice(1, 3).map(
      (option, index) =>
        `${index + 2}. ${option.day}, ${option.slot.label} (${option.slot.time}) · ${option.count}/${total}`
    ),
  ];
  return lines.join('\n');
}

function EmptySchedule({ onRefresh, loading }) {
  return (
    <div className="surface p-8 text-center sm:p-12">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
        <CalendarRange className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">
        Aún no hay horarios por cruzar
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        La matriz se construye automáticamente con los días y franjas que declare cada estudiante
        en el diagnóstico.
      </p>
      <Button variant="secondary" className="mt-5" onClick={onRefresh} loading={loading}>
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Actualizar
      </Button>
    </div>
  );
}

export default function ScheduleTab({ records, loading, error, onRefresh, source }) {
  const [copied, setCopied] = useState(false);
  const matrix = useMemo(() => buildScheduleMatrix(records), [records]);
  const { best, options, total, days } = matrix;

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    const text = buildCopyText(best, options, total);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  if (records.length === 0) {
    return (
      <div className="space-y-5">
        {error ? (
          <Alert variant="error" title="No se pudieron cargar los datos">
            {error}
          </Alert>
        ) : null}
        <EmptySchedule onRefresh={onRefresh} loading={loading} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-950">Matriz de horarios</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Cruce de disponibilidad de los estudiantes para elegir el horario oficial.
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {source === 'supabase' ? 'Datos de Supabase' : 'Datos locales'} · {total} estudiante{total === 1 ? '' : 's'}
        </span>
      </div>

      {error ? (
        <Alert variant="error" title="No se pudieron actualizar los datos">
          {error}
        </Alert>
      ) : null}

      {best ? (
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-900/10">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-indigo-200 ring-1 ring-white/10">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-300">
                      Horario sugerido
                    </p>
                    <p className="text-[10px] text-slate-400">Mayor coincidencia del grupo</p>
                  </div>
                </div>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight">
                  {best.day} · {best.slot.label}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-indigo-300" aria-hidden="true" />
                  {best.slot.time} · {best.count} de {total} estudiantes disponibles
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {best.students.map((student) => (
                    <span
                      key={student.id}
                      className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-200 ring-1 ring-white/10"
                    >
                      <span className={cn('grid h-5 w-5 place-items-center rounded-full text-[8px] font-extrabold', avatarTone(student.nombre_completo))}>
                        {getInitials(student.nombre_completo)}
                      </span>
                      {student.nombre_completo.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 lg:items-end">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ring-1 ring-inset',
                    best.count === total
                      ? 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30'
                      : 'bg-amber-400/15 text-amber-300 ring-amber-400/30'
                  )}
                >
                  {best.count === total ? (
                    <CheckCircle className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <Users className="h-3 w-3" aria-hidden="true" />
                  )}
                  {best.count === total ? 'Cobertura completa' : 'Cobertura parcial'}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  className="border-0 bg-white/10 text-white ring-white/15 hover:bg-white/20 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                  {copied ? 'Copiado' : 'Copiar propuesta'}
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {options.slice(0, 3).map((option, index) => (
                <div
                  key={`${option.day}-${option.slot.value}`}
                  className={cn(
                    'rounded-xl border p-3',
                    index === 0
                      ? 'border-indigo-400/30 bg-indigo-400/10'
                      : 'border-white/10 bg-white/[0.035]'
                  )}
                >
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Opción {index + 1}
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-slate-100">
                    {option.day} · {option.slot.label}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-400">
                    {option.count}/{total} disponibles · {option.slot.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {best && best.count < total ? (
        <Alert variant="warning" compact>
          No hay una franja en la que coincidan todos los estudiantes. La mejor opción reúne a{' '}
          {best.count} de {total}; coordina una alternativa o una sesión de recuperación para el
          resto.
        </Alert>
      ) : best ? (
        <Alert variant="success" compact>
          La mejor franja coincide con todo el grupo. Confirma la disponibilidad final antes de
          fijar el horario oficial.
        </Alert>
      ) : null}

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <CalendarRange className="h-4 w-4 text-indigo-500" aria-hidden="true" />
              Disponibilidad cruzada
            </h3>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Cada celda muestra cuántos estudiantes pueden asistir y sus iniciales.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold text-slate-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm border border-emerald-300 bg-emerald-100" aria-hidden="true" />Todos</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm border border-sky-300 bg-sky-100" aria-hidden="true" />Mayoría</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm border border-amber-300 bg-amber-100" aria-hidden="true" />Parcial</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm border border-slate-200 bg-slate-50" aria-hidden="true" />Nadie</span>
          </div>
          <p className="text-[9px] font-medium text-slate-400 sm:hidden">
            Desliza la tabla hacia el lado para ver todas las franjas →
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Día / Franja
                </th>
                {TIME_SLOTS.map((slot) => {
                  const Icon = slot.icon;
                  return (
                    <th key={slot.value} className="border-b border-slate-100 bg-white px-3 py-3 text-left">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                        <Icon className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
                        {slot.label}
                      </span>
                      <span className="mt-0.5 block text-[9px] font-medium text-slate-400">{slot.time}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day.day}>
                  <th className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-4 py-2.5 text-left text-[10px] font-extrabold text-slate-700">
                    {day.day}
                  </th>
                  {day.slots.map((cell) => (
                    <td key={`${day.day}-${cell.slot.value}`} className="border-b border-slate-100 p-1.5">
                      <div
                        className={cn(
                          'min-h-[58px] rounded-xl border p-2 transition-colors',
                          coverageClasses(cell.count, total)
                        )}
                        title={cell.students.map((student) => student.nombre_completo).join(', ') || 'Sin estudiantes disponibles'}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn('text-[9px] font-extrabold', cell.count === total ? 'text-emerald-700' : cell.count > 0 ? 'text-slate-600' : 'text-slate-300')}>
                            {cell.count}/{total}
                          </span>
                          {cell.count === total ? (
                            <CheckCircle className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                          ) : null}
                        </div>
                        {cell.count > 0 ? (
                          <div className="mt-1 flex flex-wrap gap-0.5">
                            {cell.students.map((student) => (
                              <span
                                key={student.id}
                                className={cn('grid h-5 w-5 place-items-center rounded-full text-[7px] font-extrabold ring-1 ring-white', avatarTone(student.nombre_completo))}
                                title={student.nombre_completo}
                              >
                                {getInitials(student.nombre_completo)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="mt-1 block text-[9px] font-medium text-slate-300">—</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] leading-relaxed text-slate-400">
            La matriz suma intersecciones declaradas. Confirma cada horario con los estudiantes antes
            de publicarlo.
          </p>
          <Button variant="ghost" size="sm" onClick={onRefresh} loading={loading}>
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Actualizar
          </Button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          <h3 className="text-sm font-extrabold text-slate-900">Disponibilidad declarada</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {records.map((record) => (
            <div key={record.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex items-center gap-2.5">
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold', avatarTone(record.nombre_completo))}>
                  {getInitials(record.nombre_completo)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">{record.nombre_completo}</p>
                  <p className="text-[10px] text-slate-500">{record.grado}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {(record.disponibilidad_dias || []).map((day) => (
                  <span key={day} className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
                    {DAYS_SHORT[day] || day}
                  </span>
                ))}
                {(record.disponibilidad_franjas || []).map((slot) => (
                  <span key={slot} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                    {slot}
                  </span>
                ))}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-2.5 text-[9px] text-slate-500">
                <span className="flex items-center gap-1"><Laptop className="h-3 w-3 text-indigo-500" aria-hidden="true" />{record.equipo}</span>
                <span className="flex items-center gap-1"><Wifi className="h-3 w-3 text-indigo-500" aria-hidden="true" />{record.conexion_internet}</span>
              </div>
              {record.disponibilidad_detalle ? (
                <p className="mt-2 rounded-lg bg-slate-50 px-2.5 py-2 text-[9px] leading-relaxed text-slate-500">
                  “{record.disponibilidad_detalle}”
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

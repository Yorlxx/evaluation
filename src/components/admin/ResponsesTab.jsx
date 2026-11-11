import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle,
  ChevronDown,
  Laptop,
  MessageSquareQuote,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  User,
  Users,
  Wifi,
  XCircle,
} from 'lucide-react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { LevelBadge } from '../ui/Badge';
import ConfirmDialog from './ConfirmDialog';
import {
  avatarTone,
  formatDateTime,
  getBreakdown,
  getInitials,
  levelFromRecord,
  rangeToPercent,
} from '../../lib/diagnostic';
import { DAYS_SHORT } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

function equipmentShort(value) {
  if (value === 'PC/Laptop propia') return 'Equipo propio';
  if (value === 'PC/Laptop compartida') return 'Equipo compartido';
  return 'Sin equipo';
}

function internetShort(value) {
  if (value === 'Estable') return 'Internet estable';
  if (value === 'Inestable / Solo datos móviles') return 'Internet inestable';
  return 'Sin internet';
}

function DetailPanel({ record, onDelete }) {
  const breakdown = getBreakdown(record);
  const level = levelFromRecord(record);

  return (
    <div className="bg-slate-50/80 p-4 sm:p-5">
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h4 className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-white text-indigo-600 ring-1 ring-slate-200">
                <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              Desglose del mini-quiz
            </h4>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
              {record.puntaje}/6 aciertos
            </span>
          </div>

          {breakdown.length > 0 ? (
            <div className="mt-3 space-y-2">
              {breakdown.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex gap-2.5 rounded-xl border p-2.5',
                    item.acierto
                      ? 'border-emerald-200 bg-emerald-50/70'
                      : 'border-rose-200 bg-rose-50/70'
                  )}
                >
                  {item.acierto ? (
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        P{item.numero} · {item.tema}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider',
                          item.acierto
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        )}
                      >
                        {item.acierto ? 'Acierto' : 'Error'}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-snug text-slate-700">
                      {item.pregunta}
                    </p>
                    <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                      <span className="font-semibold text-slate-600">Respondió:</span>{' '}
                      <span className={item.acierto ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700'}>
                        {item.respuestaSeleccionada || 'Sin responder'}
                      </span>
                      {!item.acierto ? (
                        <>
                          {' · '}
                          <span className="font-semibold text-emerald-700">
                            Correcta: {item.respuestaCorrecta}
                          </span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert variant="info" className="mt-3" compact>
              Este registro no tiene desglose del quiz.
            </Alert>
          )}
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-white text-indigo-600 ring-1 ring-slate-200">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            Datos y logística
          </h4>

          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <dl className="divide-y divide-slate-100 text-[10px]">
              <div className="flex items-start justify-between gap-3 px-3 py-2.5">
                <dt className="shrink-0 font-semibold text-slate-400">Grado</dt>
                <dd className="text-right font-semibold text-slate-700">{record.grado}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 px-3 py-2.5">
                <dt className="shrink-0 font-semibold text-slate-400">Experiencia</dt>
                <dd className="text-right font-semibold text-slate-700">{record.experiencia_previa}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 px-3 py-2.5">
                <dt className="shrink-0 font-semibold text-slate-400">Equipo</dt>
                <dd className="flex items-center justify-end gap-1 text-right font-semibold text-slate-700">
                  <Laptop className="h-3 w-3 text-indigo-500" aria-hidden="true" />
                  {record.equipo}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3 px-3 py-2.5">
                <dt className="shrink-0 font-semibold text-slate-400">Internet</dt>
                <dd className="flex items-center justify-end gap-1 text-right font-semibold text-slate-700">
                  <Wifi className="h-3 w-3 text-indigo-500" aria-hidden="true" />
                  {record.conexion_internet}
                </dd>
              </div>
              <div className="px-3 py-2.5">
                <dt className="font-semibold text-slate-400">Disponibilidad</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1">
                  {(record.disponibilidad_dias || []).map((day) => (
                    <span
                      key={day}
                      className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700"
                    >
                      {DAYS_SHORT[day] || day}
                    </span>
                  ))}
                  {(record.disponibilidad_franjas || []).map((slot) => (
                    <span
                      key={slot}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600"
                    >
                      {slot}
                    </span>
                  ))}
                </dd>
              </div>
              {record.disponibilidad_detalle ? (
                <div className="px-3 py-2.5">
                  <dt className="font-semibold text-slate-400">Nota de horario</dt>
                  <dd className="mt-0.5 text-slate-600">{record.disponibilidad_detalle}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="mt-2.5 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <MessageSquareQuote className="h-3 w-3 text-indigo-500" aria-hidden="true" />
              Comentario del estudiante
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
              {record.experiencia_detalle || 'Sin comentario adicional.'}
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <LevelBadge level={level} size="sm" />
            <Button variant="dangerGhost" size="sm" onClick={() => onDelete(record)}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Eliminar registro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResponsesTab({
  records,
  loading,
  error,
  onRefresh,
  onDelete,
  onSeed,
  seeding,
  source,
}) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (!action) return undefined;
    const timer = window.setTimeout(() => setAction(null), 4500);
    return () => window.clearTimeout(timer);
  }, [action]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) => {
      const haystack = [
        record.nombre_completo,
        record.grado,
        record.nivel,
        record.experiencia_previa,
        record.equipo,
        record.conexion_internet,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [records, search]);

  const openDelete = useCallback((record) => {
    setDeleteTarget(record);
    setDeleteError('');
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await onDelete(deleteTarget.id);
      setAction({
        type: 'success',
        message: `Registro de ${deleteTarget.nombre_completo} eliminado correctamente.`,
      });
      if (expandedId === deleteTarget.id) setExpandedId(null);
      setDeleteTarget(null);
    } catch (deleteFailure) {
      setDeleteError(deleteFailure?.message || 'No se pudo eliminar el registro.');
    } finally {
      setDeleting(false);
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
        <div className="surface p-8 text-center sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Users className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">
            Todavía no hay respuestas
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Cuando los estudiantes envíen el diagnóstico, aquí podrás revisar cada respuesta,
            detectar errores y eliminar registros de prueba.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Button variant="secondary" onClick={onRefresh} loading={loading}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Actualizar
            </Button>
            {!isSupabaseConfigured && onSeed ? (
              <Button onClick={onSeed} loading={seeding}>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Cargar datos de ejemplo
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
              Respuestas detalladas
            </h2>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
              {records.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Despliega un estudiante para ver aciertos, errores y logística. {source === 'supabase' ? 'Datos de Supabase.' : 'Datos locales de demostración.'}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o nivel..."
              aria-label="Buscar estudiantes"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:w-60"
            />
          </div>
          <Button variant="secondary" size="md" onClick={onRefresh} loading={loading}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Actualizar
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="error" title="No se pudieron actualizar los datos">
          {error}
        </Alert>
      ) : null}

      {action ? (
        <Alert variant={action.type === 'success' ? 'success' : 'error'} compact>
          {action.message}
        </Alert>
      ) : null}

      {filtered.length === 0 ? (
        <div className="surface p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500">
            <Search className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-bold text-slate-800">No encontramos coincidencias</p>
          <p className="mt-1 text-xs text-slate-500">Prueba con otro nombre, grado o nivel.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => setSearch('')}>
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
          <div className="hidden md:block">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-4 py-3">Estudiante</th>
                  <th className="px-4 py-3">Puntaje</th>
                  <th className="px-4 py-3">Nivel</th>
                  <th className="px-4 py-3">Logística</th>
                  <th className="hidden px-4 py-3 xl:table-cell">Fecha</th>
                  <th className="px-4 py-3 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((record) => {
                  const level = levelFromRecord(record);
                  const expanded = expandedId === record.id;
                  return (
                    <FragmentRow
                      key={record.id}
                      record={record}
                      level={level}
                      expanded={expanded}
                      onToggle={() => setExpandedId(expanded ? null : record.id)}
                      onDelete={() => openDelete(record)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {filtered.map((record) => {
              const level = levelFromRecord(record);
              const expanded = expandedId === record.id;
              return (
                <div key={record.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : record.id)}
                    aria-expanded={expanded}
                    className="w-full p-4 text-left transition hover:bg-slate-50/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold', avatarTone(record.nombre_completo))}>
                          {getInitials(record.nombre_completo)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900">{record.nombre_completo}</p>
                          <p className="text-[10px] text-slate-500">{record.grado} · {formatDateTime(record.created_at)}</p>
                        </div>
                      </div>
                      <ChevronDown className={cn('mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <LevelBadge level={level} size="sm" />
                      <span className="text-[11px] font-extrabold text-slate-700">{record.puntaje}/6 aciertos</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Laptop className="h-3 w-3 text-indigo-500" aria-hidden="true" />{equipmentShort(record.equipo)}</span>
                      <span className="flex items-center gap-1"><Wifi className="h-3 w-3 text-indigo-500" aria-hidden="true" />{internetShort(record.conexion_internet)}</span>
                    </div>
                  </button>
                  {expanded ? (
                    <DetailPanel record={record} onDelete={openDelete} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-400">
        Los registros se ordenan del más reciente al más antiguo. Eliminar un registro es
        permanente.
      </p>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `¿Eliminar el registro de ${deleteTarget.nombre_completo}?` : 'Eliminar registro'}
        description="Se quitará el diagnóstico completo, incluido el desglose del quiz. Esta acción no se puede deshacer."
        confirmLabel="Eliminar registro"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) {
            setDeleteTarget(null);
            setDeleteError('');
          }
        }}
        loading={deleting}
        error={deleteError}
      />
    </div>
  );
}

function FragmentRow({ record, level, expanded, onToggle, onDelete }) {
  return (
    <>
      <tr
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
        tabIndex={0}
        aria-expanded={expanded}
        className={cn(
          'cursor-pointer text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500',
          expanded ? 'bg-indigo-50/50' : 'hover:bg-slate-50/70'
        )}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold', avatarTone(record.nombre_completo))}>
              {getInitials(record.nombre_completo)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">{record.nombre_completo}</p>
              <p className="text-[10px] text-slate-500">{record.grado}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900">{record.puntaje}<span className="text-[10px] font-bold text-slate-400">/6</span></span>
            <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
              <div className={cn('h-full rounded-full', level.colors.bar)} style={{ width: `${rangeToPercent(record.puntaje, 6)}%` }} />
            </div>
          </div>
        </td>
        <td className="px-4 py-3"><LevelBadge level={level} size="sm" /></td>
        <td className="px-4 py-3">
          <div className="space-y-1 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><Laptop className="h-3 w-3 text-indigo-500" aria-hidden="true" />{equipmentShort(record.equipo)}</span>
            <span className="flex items-center gap-1"><Wifi className="h-3 w-3 text-indigo-500" aria-hidden="true" />{internetShort(record.conexion_internet)}</span>
          </div>
        </td>
        <td className="hidden px-4 py-3 text-[10px] text-slate-500 xl:table-cell">
          <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3 text-slate-400" aria-hidden="true" />{formatDateTime(record.created_at)}</span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 lg:inline">
              {expanded ? 'Cerrar' : 'Ver más'}
            </span>
            <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
          </div>
        </td>
      </tr>
      {expanded ? (
        <tr>
          <td colSpan={6} className="p-0">
            <DetailPanel record={record} onDelete={onDelete} />
          </td>
        </tr>
      ) : null}
    </>
  );
}

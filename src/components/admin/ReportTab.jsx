import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  GraduationCap,
  Laptop,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { LevelBadge } from '../ui/Badge';
import { LEVEL_LIST } from '../../lib/constants';
import { buildGroupRecommendation, formatDateTime } from '../../lib/diagnostic';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

const STATUS_PILL = {
  good: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warn: 'bg-amber-50 text-amber-700 ring-amber-200',
  bad: 'bg-rose-50 text-rose-700 ring-rose-200',
  neutral: 'bg-slate-100 text-slate-500 ring-slate-200',
};

function StatusPill({ tone = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider ring-1 ring-inset ${STATUS_PILL[tone]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === 'good'
            ? 'bg-emerald-500'
            : tone === 'warn'
              ? 'bg-amber-500'
              : tone === 'bad'
                ? 'bg-rose-500'
                : 'bg-slate-400'
        }`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, iconClass, label, value, suffix, helper, bar, barClass }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</span>
      </div>
      <div className="mt-4 flex items-end gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-slate-950">{value}</span>
        {suffix ? <span className="mb-1 text-sm font-bold text-slate-400">{suffix}</span> : null}
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{helper}</p>
      {typeof bar === 'number' ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ${barClass}`}
            style={{ width: `${Math.min(Math.max(bar, 0), 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function EmptyReport({ onSeed, seeding, onRefresh, loading }) {
  return (
    <div className="surface p-8 text-center sm:p-12">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
        <BarChart2 className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-extrabold tracking-tight text-slate-950">
        Aún no hay diagnósticos registrados
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        Comparte el enlace del diagnóstico con los estudiantes. En cuanto envíen el formulario,
        verás aquí el reporte maestro, los niveles y la recomendación pedagógica.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
        <Button variant="secondary" onClick={onRefresh} loading={loading}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Actualizar
        </Button>
        {!isSupabaseConfigured && onSeed ? (
          <Button onClick={onSeed} loading={seeding}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Cargar 3 perfiles de ejemplo
          </Button>
        ) : null}
      </div>
      {!isSupabaseConfigured ? (
        <p className="mt-4 text-[10px] font-medium text-amber-600">
          Modo local activo: los ejemplos se guardan solo en este navegador.
        </p>
      ) : null}
    </div>
  );
}

export default function ReportTab({
  records,
  error,
  onRefresh,
  loading,
  onSeed,
  seeding,
  source,
}) {
  const recommendation = buildGroupRecommendation(records);
  const { stats, guidance, level } = recommendation;
  const own = records.filter((record) => record.equipo === 'PC/Laptop propia').length;
  const shared = records.filter((record) => record.equipo === 'PC/Laptop compartida').length;
  const noEquipment = records.filter((record) => record.equipo === 'Sin equipo').length;
  const stable = records.filter((record) => record.conexion_internet === 'Estable').length;
  const unstable = records.filter(
    (record) => record.conexion_internet === 'Inestable / Solo datos móviles'
  ).length;
  const noInternet = records.filter((record) => record.conexion_internet === 'Sin internet').length;
  const total = records.length;

  if (total === 0) {
    return (
      <div className="space-y-5">
        {error ? (
          <Alert variant="error" title="No se pudieron cargar los datos">
            {error}
          </Alert>
        ) : null}
        <EmptyReport
          onSeed={onSeed}
          seeding={seeding}
          onRefresh={onRefresh}
          loading={loading}
        />
      </div>
    );
  }

  const equipmentTone = noEquipment > 0 ? 'bad' : shared > 0 ? 'warn' : 'good';
  const internetTone = noInternet > 0 ? 'bad' : unstable > 0 ? 'warn' : 'good';
  const overallTone =
    equipmentTone === 'bad' || internetTone === 'bad'
      ? 'bad'
      : equipmentTone === 'warn' || internetTone === 'warn'
        ? 'warn'
        : 'good';
  const supportStudents = records
    .filter(
      (record) => record.equipo !== 'PC/Laptop propia' || record.conexion_internet !== 'Estable'
    )
    .map((record) => record.nombre_completo);

  return (
    <div className="space-y-5">
      {error ? (
        <Alert variant="error" title="Error al actualizar">
          {error}
        </Alert>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-950">Reporte maestro</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Vista general del grupo, logística y ajuste pedagógico de las 6 sesiones.
          </p>
        </div>
        <p className="text-[10px] font-medium text-slate-400">
          {source === 'supabase' ? 'Datos en la nube' : 'Datos locales'} ·{' '}
          {formatDateTime(records[0]?.created_at)}
        </p>
      </div>

      {recommendation.partial ? (
        <Alert variant="info" compact>
          Muestra parcial: hay {stats.total} de {stats.meta} diagnósticos. Las recomendaciones se
          ajustarán cuando complete el grupo.
        </Alert>
      ) : null}

      <div className="grid gap-3.5 sm:grid-cols-3">
        <StatCard
          icon={Users}
          iconClass="bg-indigo-50 text-indigo-600"
          label="Meta 3"
          value={stats.total}
          suffix={`/ ${stats.meta}`}
          helper="Estudiantes inscritos con diagnóstico"
          bar={(stats.total / stats.meta) * 100}
          barClass="bg-gradient-to-r from-indigo-500 to-violet-500"
        />
        <StatCard
          icon={TrendingUp}
          iconClass="bg-sky-50 text-sky-600"
          label="Promedio"
          value={stats.averageDisplay}
          suffix="/ 6"
          helper={`${Math.round((stats.average / 6) * 100)}% de dominio general del quiz`}
          bar={(stats.average / 6) * 100}
          barClass="bg-gradient-to-r from-sky-400 to-blue-600"
        />
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-start justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Predominante
            </span>
          </div>
          <div className="mt-4">
            <LevelBadge level={stats.predominant} size="sm" />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            {stats.isTie
              ? 'Empate entre niveles · se toma el nivel promedio del grupo'
              : `${stats.predominantCount} de ${stats.total} estudiantes · ${level.eyebrow}`}
          </p>
          {stats.isTie ? (
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-violet-500">
              Lectura conservadora
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-600">
                  <Laptop className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                Semáforo logístico
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">Equipamiento y conectividad del grupo.</p>
            </div>
            <StatusPill tone={overallTone}>
              {overallTone === 'good' ? 'Óptimo' : overallTone === 'warn' ? 'Con apoyo' : 'Atención'}
            </StatusPill>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <Laptop className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
                  Equipos
                </span>
                <StatusPill tone={equipmentTone}>
                  {equipmentTone === 'good' ? 'Bien' : equipmentTone === 'warn' ? 'Parcial' : 'Crítico'}
                </StatusPill>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {own}
                <span className="text-sm font-bold text-slate-400">/{total}</span>
              </p>
              <p className="text-[10px] text-slate-500">con PC o laptop propia</p>
              <div className="mt-2.5 flex h-1.5 gap-1" aria-hidden="true">
                {Array.from({ length: total }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-full flex-1 rounded-full ${
                      index < own
                        ? 'bg-emerald-400'
                        : index < own + shared
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-[9px] font-medium text-slate-400">
                {shared} compartida{shared === 1 ? '' : 's'} · {noEquipment} sin equipo
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <Wifi className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
                  Internet
                </span>
                <StatusPill tone={internetTone}>
                  {internetTone === 'good' ? 'Bien' : internetTone === 'warn' ? 'Parcial' : 'Crítico'}
                </StatusPill>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {stable}
                <span className="text-sm font-bold text-slate-400">/{total}</span>
              </p>
              <p className="text-[10px] text-slate-500">con conexión estable</p>
              <div className="mt-2.5 flex h-1.5 gap-1" aria-hidden="true">
                {Array.from({ length: total }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-full flex-1 rounded-full ${
                      index < stable
                        ? 'bg-emerald-400'
                        : index < stable + unstable
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-[9px] font-medium text-slate-400">
                {unstable} inestable o con datos · {noInternet} sin internet
              </p>
            </div>
          </div>

          {supportStudents.length > 0 ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
              <p className="text-[10px] leading-relaxed text-amber-800">
                <span className="font-bold">Apoyo previsto:</span>{' '}
                {supportStudents.join(', ')}.
              </p>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
              <p className="text-[10px] text-emerald-800">
                Todo el grupo cuenta con equipo propio e internet estable.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-600">
              <BarChart2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            Distribución por nivel
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">Conteo de estudiantes en cada punto de partida.</p>

          <div className="mt-5 space-y-4">
            {LEVEL_LIST.map((item) => {
              const row = stats.distribution.find((entry) => entry.level === item.level);
              return (
                <div key={item.level}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <span className={`h-2 w-2 rounded-full ${item.colors.dot}`} aria-hidden="true" />
                      {item.short}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {row.count} estudiante{row.count === 1 ? '' : 's'} · {row.percent}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-[width] duration-700 ${item.colors.bar}`}
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-3.5">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              <Target className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
              Lectura rápida
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
              {level.level === 0
                ? 'El grupo requiere bases guiadas: prioriza comprensión, trazas y práctica acompañada.'
                : level.level === 1
                  ? 'El grupo puede avanzar con repaso express y foco en bucles y arreglos.'
                  : 'El grupo está listo para retos: acelera hacia cadenas, matrices y recursión.'}
            </p>
          </div>
        </section>
      </div>

      <section className="surface overflow-hidden">
        <div className="relative overflow-hidden bg-slate-950 p-5 text-white sm:p-6">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-indigo-200 ring-1 ring-white/10">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-300">
                    Recomendación pedagógica automática
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold leading-tight sm:text-xl">
                    {guidance.headline}
                  </h3>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-slate-300 ring-1 ring-white/10">
                {stats.total} de {stats.meta} diagnósticos
              </span>
            </div>
            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-300">{guidance.summary}</p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">Ritmo</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-slate-200">{guidance.pace}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">Foco</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-slate-200">{guidance.focus}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">Meta</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-slate-200">{guidance.goal}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
              Ajuste sugerido por sesión
            </h4>
            <span className="text-[10px] font-medium text-slate-400">
              Nivel detectado: {level.label}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {recommendation.sessions.map((session) => (
              <div
                key={session.number}
                className={`flex gap-3 rounded-xl border p-3 transition ${
                  session.priority
                    ? 'border-indigo-100 bg-indigo-50/50'
                    : 'border-slate-100 bg-slate-50/60'
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[9px] font-extrabold ${
                    session.priority
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-500 ring-1 ring-slate-200'
                  }`}
                >
                  {session.number}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-bold text-slate-800">{session.title}</p>
                    {session.priority ? (
                      <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-indigo-700">
                        Foco
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">{session.adjustment}</p>
                </div>
              </div>
            ))}
          </div>

          {recommendation.logisticsActions.length > 0 ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-700">
                <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
                Ajustes logísticos
              </div>
              <ul className="mt-1.5 space-y-1">
                {recommendation.logisticsActions.map((action) => (
                  <li key={action} className="flex gap-1.5 text-[10px] leading-relaxed text-amber-800">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

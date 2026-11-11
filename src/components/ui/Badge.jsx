import { LEVELS } from '../../lib/constants';
import { cn } from '../../lib/utils';

export function LevelBadge({ level, size = 'md', showRange = false, className }) {
  const data = typeof level === 'number' ? LEVELS[level] : level;
  if (!data) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset',
        data.colors.badge,
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', data.colors.dot)} aria-hidden="true" />
      {data.label}
      {showRange ? <span className="font-medium opacity-70">· {data.range}</span> : null}
    </span>
  );
}

export function SoftBadge({ children, tone = 'slate', className }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        tones[tone] || tones.slate,
        className
      )}
    >
      {children}
    </span>
  );
}
